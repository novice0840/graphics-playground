import './style.css'
import { Perlin, setFadeMode, fadeMode } from './perlin'

const SIZE = 500
// 값이 클수록 영역(덩어리)이 커진다. 한 칸이 차지하는 픽셀 수.
const SCALE = 60

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!
const ctx = canvas.getContext('2d')!

const perlin = new Perlin()

// 비스듬한 빛 방향 (정규화된 벡터). 표면 법선과 내적해 명암을 낸다.
const LIGHT = (() => {
  const lx = -0.6
  const ly = -0.6
  const lz = 0.5
  const len = Math.hypot(lx, ly, lz)
  return { x: lx / len, y: ly / len, z: lz / len }
})()

// 노이즈를 높이맵으로 보고 음영을 입혀 그린다.
// 기울기(1차 미분)가 꺾이는 셀 경계는 선형 보간일 때 격자 줄무늬로 드러난다.
function render() {
  const image = ctx.createImageData(SIZE, SIZE)
  const data = image.data
  const eps = 1 / SCALE // 기울기 계산용 미소 간격

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const nx = x / SCALE
      const ny = y / SCALE

      // 중심 차분으로 x·y 방향 기울기 → 표면 법선
      const dx = perlin.noise(nx + eps, ny) - perlin.noise(nx - eps, ny)
      const dy = perlin.noise(nx, ny + eps) - perlin.noise(nx, ny - eps)
      // 법선 = (-dx, -dy, 1) 정규화
      const nz = 1
      const len = Math.hypot(dx, dy, nz)
      const normal = { x: -dx / len, y: -dy / len, z: nz / len }

      // 람베르트 음영: 법선·빛 내적
      const diffuse = Math.max(
        0,
        normal.x * LIGHT.x + normal.y * LIGHT.y + normal.z * LIGHT.z
      )
      const value = diffuse * 255

      const i = (y * SIZE + x) * 4
      data[i] = value
      data[i + 1] = value
      data[i + 2] = value
      data[i + 3] = 255
    }
  }

  ctx.putImageData(image, 0, 0)
}

// smooth ↔ linear 토글 버튼
const button = document.createElement('button')
button.style.cssText = 'display:block;margin:12px 0;padding:6px 12px;font-size:14px;'
function updateLabel() {
  button.textContent = `fade: ${fadeMode} (클릭해서 전환)`
}
button.addEventListener('click', () => {
  setFadeMode(fadeMode === 'smooth' ? 'linear' : 'smooth')
  updateLabel()
  render()
})
updateLabel()
canvas.parentElement?.insertBefore(button, canvas)

render()
