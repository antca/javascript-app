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
  const model = modelText.split('\n').reduce((m, line) => {
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
    if (type === 'vn') {
      m.normals.push(data.map(Number))
    }
    return m
  }, { vertices: [], uvs: [], faces: [], normals: [] })
  return model.faces.map((faceData) => {
    return faceData.map(([v, uv, n]) => {
      return [model.vertices[v - 1], model.uvs[uv - 1], model.normals[n - 1]]
    })
  })
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
  const imageData = ctx.getImageData(0, 0, width, height)
  for (let i = 0; i < points.length; ++i) {
    const d = points[i]
    const pixelIndex = (((d[0] - 0) * 4 + (d[1] - 0) * width * 4))
    imageData.data[pixelIndex] = d[2]
    imageData.data[pixelIndex + 1] = d[3]
    imageData.data[pixelIndex + 2] = d[4]
    imageData.data[pixelIndex + 3] = d[5]
  }
  ctx.putImageData(imageData, 0, 0)
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

function triangle(zbuffer, shader, face) {
  const va = face[0].map(v => v | 0)
  const vb = face[1].map(v => v | 0)
  const vc = face[2].map(v => v | 0)
  const points = []
  const [bbmin, bbmax] = computeBB([va, vb, vc])
  for (let x = bbmin[0]; x <= bbmax[0]; x++) {
    for (let y = bbmin[1]; y <= bbmax[1]; y++) {
      const bar = barycentric(va, vb, vc, [x, y])
      const [bca, bcb, bcc] = bar
      if (bca >= 0 && bcb >= 0 && bcc >= 0) {
        const z = va[2] * bca + vb[2] * bcb + vc[2] * bcc
        const zBufferValue = zbuffer[x + y * width]
        if (zBufferValue === void 0 || zBufferValue < z) {
          zbuffer[x + y * width] = z
          const color = shader(bar)
          if(color) {
            points.push([x, y, ...color])
          }
        }
      }
    }
  }
  return points
}

function getPixel(texture, uv) {
  const tc = mul(uv, [texture.width, texture.height]).map((v) => v | 0)
  const bi = (tc[0] * 4 + tc[1] * 4 * texture.width)
  return [
    texture.data[bi],
    texture.data[bi + 1],
    texture.data[bi + 2],
    texture.data[bi + 3],
  ]
}

function gouraudShader(matrix, texture, light) {
  let varying_intensity = [0, 0, 0]
  let varying_uv = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]
  return {
    vertex([v, uv, n], i) {
      varying_uv[0][i] = uv[0]
      varying_uv[1][i] = uv[1]
      varying_intensity[i] = Math.max(0, mul(n, light).reduce((sum, x) => sum + x))
      return applyMatrix([...v, 1], matrix)
    },
    fragment(bc) {
      const intensity = mul(varying_intensity, bc).reduce((sum, x) => sum + x)
      const uv = applyMatrix([...bc, 1], varying_uv)
      const color = getPixel(texture, uv)
      return [...scale(color, intensity), 255]
    }
  }
}

function cheapWireframeShader(matrix) {
  return {
    vertex([v, uv, n], i) {
      return applyMatrix([...v, 1], matrix)
    },
    fragment(bc) {
      if(bc[0] < 0.03 || bc[1] < 0.03 || bc[2] < 0.03) {
        return [255, 255, 255, 255]
      }
      return null
    }
  }
}

function render(model, shader) {
  const zbuffer = new Array(width * height)
  const points = []
  model.forEach((f) => {
    return points.push(...triangle(zbuffer, shader.fragment, f.map(shader.vertex).map(toCart)))
  }, [])
  plot(points)
}

async function main() {
  const model = await loadModel('https://raw.githubusercontent.com/ssloy/tinyrenderer/master/obj/african_head/african_head.obj')
  const texture = await loadTexture('http://i.imgur.com/jGAm5aP.jpg')
  const light = [0.5, 0.5, 1.0]
  const viewportMatrix = viewport(0, 0, width, height)
  const lookAtMatrix = lookAt(
    [0.6, 0.2, 1],
    [0, 0, 0],
    [0, 1, 0],
  )
  const projectionMatrix = [
    [0.6, 0.0, 0.0, 0.1],
    [0.0, 0.6, 0.0, 0.1],
    [0.0, 0.0, 0.6, 0.1],
    [0.0, 0.0, -0.2, 1.0],
  ]
  const matrix = mulM(viewportMatrix, mulM(lookAtMatrix, projectionMatrix))
  const gouraud = gouraudShader(matrix, texture, light)
  const wireframe = cheapWireframeShader(matrix)
  ctx.fillRect(0, 0, width, height)
  render(model, gouraud)
  //render(model, wireframe)
}

main()
