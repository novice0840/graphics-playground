import './style.css'
import { Perlin } from './perlin'

const SIZE = 500
// 값이 클수록 영역(덩어리)이 커진다. 한 칸이 차지하는 픽셀 수.
const SCALE = 60

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!
const ctx = canvas.getContext('2d')!

const perlin = new Perlin()

// Perlin noise 값을 임계값으로 잘라 흑/백 영역을 만든다.
const image = ctx.createImageData(SIZE, SIZE)
const data = image.data

for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const n = perlin.noise(x / SCALE, y / SCALE) // 대략 [-1, 1]
    const value = n < 0 ? 0 : 255 // 임계값 0 기준으로 흑 or 백

    const i = (y * SIZE + x) * 4
    data[i] = value // R
    data[i + 1] = value // G
    data[i + 2] = value // B
    data[i + 3] = 255 // A
  }
}

ctx.putImageData(image, 0, 0)
