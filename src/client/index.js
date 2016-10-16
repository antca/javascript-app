if(module.hot) {
  module.hot.status((status) => {
    if(status === 'dispose') {
      window.location.reload()
    }
  })
}

let calls = 0
function d(...vals) {
  if(++calls > 1000) {
    throw new Error('Looks like d has been called too much !')
  }
  console.debug(...vals)
  return vals[0]
}

const canvas = document.createElement('canvas')
canvas.width = 720
canvas.height = 720
canvas.style.transform = 'scaleY(-1)'
document.body.appendChild(canvas)

const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false

const { width, height } = canvas
const { abs } = Math

async function loadModel(url) {
  const response = await fetch(url)
  const modelText = await response.text()
  return modelText.split('\n').reduce((m, line) => {
    const [type, ...data] = line.split(/\s+/)
    if (type === 'v') {
      m.vertices.push(data.map(Number))
    }
    if (type === 'vt') {
      m.uvs.push(data.map(Number).map((v, i) => i === 1 ? 1 - v : v))
    }
    if (type === 'f') {
      m.faces.push(data.map((f) => f.split('/').map(Number)))
    }
    return m
  }, { vertices: [], uvs: [], faces: [] })
}

async function loadTexture(url) {
  return new Promise((resolve) => {
    const image = new Image()
    image.crossOrigin = 'Anonymous'
    image.src = url
    image.addEventListener('load', () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0)
      resolve(ctx.getImageData(0, 0, canvas.width, canvas.height))
    })
  })
}

function swap([x, y]) {
  return [y, x]
}

function line(a, b, ...color) {
  const points = []
  let steep = false
  if (abs(a[0] - b[0]) < abs(a[1] - b[1])) {
    a = swap(a)
    b = swap(b)
    steep = true
  }
  if (a[0] > b[0]) {
    const tmp = a
    a = b
    b = tmp
  }
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  let de = abs(dy) << 1
  let e = 0
  let y = a[1]
  for (let x = a[0]; x <= b[0]; x++) {
    if (steep) {
      points.push([y, x, ...color])
    }
    else {
      points.push([x, y, ...color])
    }
    e += de
    if (e > dx) {
      y += (b[1] > a[1] ? 1 : -1)
      e -= dx << 1
    }
  }
  return points
}

function computeBB(points) {
  if (points.length === 0) {
    return [[0, 0], [0, 0]]
  }
  let xMin = points[0][0]
  let yMin = points[0][1]
  let xMax = points[0][0]
  let yMax = points[0][1]
  for (let i = 1; i < points.length; ++i) {
    const d = points[i]
    if(d[0] < xMin) xMin = d[0]
    if(d[0] > xMax) xMax = d[0]
    if(d[1] < yMin) yMin = d[1]
    if(d[1] > yMax) yMax = d[1]
  }
  return [[xMin, yMin], [xMax, yMax]]
}

function plot(points) {
  const bb = computeBB(points)
  const width = abs(bb[1][0] - bb[0][0]) + 1
  const height = abs(bb[1][1] - bb[0][1]) + 1
  if (width === 0 || height === 0) {
    return
  }
  const imageData = ctx.getImageData(bb[0][0], bb[0][1], width, height)
  for (let i = 0; i < points.length; ++i) {
    const d = points[i]
    const pixelIndex = (((d[0] - bb[0][0]) * 4 + (d[1] - bb[0][1]) * width * 4))
    imageData.data[pixelIndex] = d[2]
    imageData.data[pixelIndex + 1] = d[3]
    imageData.data[pixelIndex + 2] = d[4]
    imageData.data[pixelIndex + 3] = d[5]
  }
  ctx.putImageData(imageData, bb[0][0], bb[0][1])
}

function triangle(a, b, c, ...color) {
  return [
    ...line(a, b, ...color),
    ...line(b, c, ...color),
    ...line(c, a, ...color)
  ]
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ]
}

function sub(a, b) {
  return [
    a[0] - b[0],
    a[1] - b[1],
    a[2] - b[2],
  ]
}

function length(a) {
  return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2])
}

function normalize(a) {
  const l = length(a)
  return [a[0] / l, a[1] / l, a[2] / l]
}

function scale(a, s) {
  return [a[0] * s, a[1] * s, a[2] * s]
}

function add(a, v) {
  return [a[0] + v, a[1] + v, a[2] + v]
}

function sum(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
}

function mul(a, b) {
  return [a[0] * b[0], a[1] * b[1], a[2] * b[2]]
}

function barycentric(a, b, c, p) {
  const u = cross(
    [c[0] - a[0], b[0] - a[0], a[0] - p[0]],
    [c[1] - a[1], b[1] - a[1], a[1] - p[1]],
  )
  if (abs(u[2]) < 1) {
    return [-1, 1, 1]
  }
  return [1 - (u[0] + u[1]) / u[2], u[1] / u[2], u[0] / u[2]]
}

function applyMatrix(v, m) {
  return [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2] + m[0][3] * v[3],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2] + m[1][3] * v[3],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2] + m[2][3] * v[3],
    m[3][0] * v[0] + m[3][1] * v[1] + m[3][2] * v[2] + m[3][3] * v[3],
  ]
}

function mulM(a, b) {
  return [
    [
      a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0] + a[0][3] * b[3][0],
      a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1] + a[0][3] * b[3][1],
      a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2] + a[0][3] * b[3][2],
      a[0][0] * b[0][3] + a[0][1] * b[1][3] + a[0][2] * b[2][3] + a[0][3] * b[3][3],
    ],
    [
      a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0] + a[1][3] * b[3][0],
      a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1] + a[1][3] * b[3][1],
      a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] * b[2][2] + a[1][3] * b[3][2],
      a[1][0] * b[0][3] + a[1][1] * b[1][3] + a[1][2] * b[2][3] + a[1][3] * b[3][3],
    ],
    [
      a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0] + a[2][3] * b[3][0],
      a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1] + a[2][3] * b[3][1],
      a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2] + a[2][3] * b[3][2],
      a[2][0] * b[0][3] + a[2][1] * b[1][3] + a[2][2] * b[2][3] + a[2][3] * b[3][3],
    ],
    [
      a[3][0] * b[0][0] + a[3][1] * b[1][0] + a[3][2] * b[2][0] + a[3][3] * b[3][0],
      a[3][0] * b[0][1] + a[3][1] * b[1][1] + a[3][2] * b[2][1] + a[3][3] * b[3][1],
      a[3][0] * b[0][2] + a[3][1] * b[1][2] + a[3][2] * b[2][2] + a[3][3] * b[3][2],
      a[3][0] * b[0][3] + a[3][1] * b[1][3] + a[3][2] * b[2][3] + a[3][3] * b[3][3],
    ],
  ]
}

function toCart(v) {
  const [x, y, z, w] = v
  return [x / w, y / w, z / w]
}

function createIdentityMatrix() {
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]
}

function lookAt(eye, center, up) {
  const z = normalize(sub(eye, center))
  const x = normalize(cross(up, z))
  const y = normalize(cross(z, x))
  const minV = [
    [...x, 0],
    [...y, 0],
    [...z, 0],
    [0, 0, 0, 1]
  ]
  const tR = createIdentityMatrix()
  tR[0][3] = -center[0]
  tR[1][3] = -center[1]
  tR[2][3] = -center[2]
  return mulM(minV, tR)
}

function viewport(x, y, w, h) {
  const depth = 255
  const m = createIdentityMatrix()
  m[0][3] = x + w / 2
  m[1][3] = y + h / 2
  m[2][3] = depth / 2

  m[0][0] = w / 2
  m[1][1] = h / 2
  m[2][2] = depth / 2

  return m
}

function fillTriangle(zbuffer, texture, intensity, a, b, c, uva, uvb, uvc) {
  const points = []
  const [bbmin, bbmax] = computeBB([a, b, c])
  for (let x = bbmin[0]; x <= bbmax[0]; x++) {
    for (let y = bbmin[1]; y <= bbmax[1]; y++) {
      const [bca, bcb, bcc] = barycentric(a, b, c, [x, y])
      if (bca >= 0 && bcb >= 0 && bcc >= 0) {
        const z = a[2] * bca + b[2] * bcb + c[2] * bcc
        const zBufferValue = zbuffer[x + y * width]
        if (zBufferValue === void 0 || zBufferValue < z) {
          const puv = [scale(uva, bca), scale(uvb, bcb), scale(uvc, bcc)].reduce(sum)
          const tc = mul(puv, [texture.width, texture.height]).map((v) => v | 0)
          const bi = (tc[0] * 4 + tc[1] * 4 * texture.width)
          zbuffer[x + y * width] = z
          points.push([
            x,
            y,
            texture.data[bi] * intensity,
            texture.data[bi + 1] * intensity,
            texture.data[bi + 2] * intensity,
            texture.data[bi + 3],
          ])
        }
      }
    }
  }
  return points
}

const viewportMatrix = viewport(0, 0, width, height)
const lookAtMatrix = lookAt(
  [0.5, 0, 1],
  [0, 0.2, 0],
  [0, 1, 0],
)
const projectionMatrix = [
  [0.5, 0.0, 0.0, 0.0],
  [0.0, 0.5, 0.0, 0.0],
  [0.0, 0.0, 0.5, 0.0],
  [0.0, 0.0, -0.2, 1.0],
]
const matrix = mulM(viewportMatrix, mulM(lookAtMatrix, projectionMatrix))

function renderWireframe(model) {
  model.faces.map((f) => {
    const [a, b, c] = f.map(([v]) => {
      return model.vertices[v - 1]
    })
    const ta = toCart(applyMatrix([...a, 1], matrix)).map((v) => v | 0)
    const tb = toCart(applyMatrix([...b, 1], matrix)).map((v) => v | 0)
    const tc = toCart(applyMatrix([...c, 1], matrix)).map((v) => v | 0)
    plot(triangle(ta, tb, tc, 255, 255, 255, 255))
  })
}

function renderWithLight(model, texture, light) {
  const zbuffer = new Array(width * height)
  model.faces.map((f) => {
    const [[a, uva], [b, uvb], [c, uvc]] = f.map(([v, uv]) => {
      return [model.vertices[v - 1], model.uvs[uv - 1]]
    })
    const normal = normalize(cross(sub(c, a), sub(b, a)))
    const intensity = mul(normal, light)[2]
    const ta = toCart(applyMatrix([...a, 1], matrix)).map((v) => v | 0)
    const tb = toCart(applyMatrix([...b, 1], matrix)).map((v) => v | 0)
    const tc = toCart(applyMatrix([...c, 1], matrix)).map((v) => v | 0)
    if(intensity > 0) {
      plot(fillTriangle(zbuffer, texture, intensity, ta, tb, tc, uva, uvb, uvc))
    }
  })
}

async function main() {
  const model = await loadModel('https://raw.githubusercontent.com/ssloy/tinyrenderer/master/obj/african_head/african_head.obj')
  const texture = await loadTexture('http://i.imgur.com/jGAm5aP.jpg')
  ctx.fillRect(0, 0, width, height)
  renderWithLight(model, texture, [0, 0, -1])
  renderWireframe(model)
}

main()
