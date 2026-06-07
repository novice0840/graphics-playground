import './style.css'

const SIZE = 500

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!
const ctx = canvas.getContext('2d')!

// 각 픽셀을 흑(0) 또는 백(255)으로 균일하게 랜덤 채우기
const image = ctx.createImageData(SIZE, SIZE)
const data = image.data

for (let i = 0; i < data.length; i += 4) {
  const value = Math.random() < 0.5 ? 0 : 255
  data[i] = value // R
  data[i + 1] = value // G
  data[i + 2] = value // B
  data[i + 3] = 255 // A (불투명)
}

ctx.putImageData(image, 0, 0)
