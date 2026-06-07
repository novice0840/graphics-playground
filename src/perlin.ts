// 2D Perlin noise (classic, Ken Perlin's improved noise)
// 매 인스턴스마다 순열 테이블을 섞어 다른 패턴을 생성한다.

function fade(t: number): number {
  // 6t^5 - 15t^4 + 10t^3 : 경계에서 부드럽게 보간되도록
  return t * t * t * (t * (t * 6 - 15) + 10)
}

function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a)
}

function grad(hash: number, x: number, y: number): number {
  // 해시값으로 4방향(또는 대각) 그래디언트를 선택해 내적
  switch (hash & 3) {
    case 0:
      return x + y
    case 1:
      return -x + y
    case 2:
      return x - y
    default:
      return -x - y
  }
}

export class Perlin {
  private perm: Uint8Array

  constructor(random: () => number = Math.random) {
    // 0..255 순열을 Fisher-Yates로 섞고, 512 길이로 복제해 인덱싱 단순화
    const p = new Uint8Array(256)
    for (let i = 0; i < 256; i++) p[i] = i
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(random() * (i + 1))
      ;[p[i], p[j]] = [p[j], p[i]]
    }
    this.perm = new Uint8Array(512)
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255]
  }

  // 대략 [-1, 1] 범위의 노이즈 값을 반환
  noise(x: number, y: number): number {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255
    const xf = x - Math.floor(x)
    const yf = y - Math.floor(y)

    const u = fade(xf)
    const v = fade(yf)

    const perm = this.perm
    const aa = perm[perm[X] + Y]
    const ab = perm[perm[X] + Y + 1]
    const ba = perm[perm[X + 1] + Y]
    const bb = perm[perm[X + 1] + Y + 1]

    const x1 = lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u)
    const x2 = lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u)

    return lerp(x1, x2, v)
  }
}
