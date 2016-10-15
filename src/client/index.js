if(module.hot) {
  module.hot.status((status) => {
    if(status === 'dispose') {
      window.location.reload()
    }
  })
}

function d(...vals) {
  console.debug(...vals)
  return vals[0]
}

const canvas = document.createElement('canvas')
canvas.width = 720
canvas.height = 720
document.body.appendChild(canvas)

const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false

const { width, height } = canvas
const { abs } = Math

async function loadModel(url) {
  const response = await fetch(url)
  const modelText = await response.text()
  return modelText.split('\n').reduce((m, line) => {
    const [type, ...data] = line.split(' ')
    if (type === 'v') {
      m.vertices.push(data.map(Number))
    }
    if (type === 'f') {
      m.faces.push(data.map((f) => f.split('/')[0]).map(Number))
    }
    return m
  }, { vertices: [], faces: [] })
}

function swap([x, y]) {
  return [y, x]
}

function line(a, b) {
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
      points.push([y, x])
    }
    else {
      points.push([x, y])
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

function plot(points, r = 0, g = 0, b = 0, a = 255) {
  const bb = computeBB(points)
  const width = abs(bb[1][0] - bb[0][0]) + 1
  const height = abs(bb[1][1] - bb[0][1]) + 1
  if (width === 0 || height === 0) {
    return
  }
  const imageData = ctx.getImageData(bb[0][0], bb[0][1], width, height)
  for (let i = 0; i < points.length; ++i) {
    const d = points[i]
    const pixelIndex = ((d[1] - bb[0][1]) * width * 4) + ((d[0] - bb[0][0]) * 4)
    imageData.data[pixelIndex] = r
    imageData.data[pixelIndex + 1] = g
    imageData.data[pixelIndex + 2] = b
    imageData.data[pixelIndex + 3] = a
  }
  ctx.putImageData(imageData, bb[0][0], bb[0][1])
}

function triangle(a, b, c) {
  return [...line(a, b), ...line(b, c), ...line(c, a)]
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

function add(a, s) {
  return [a[0] + s, a[1] + s, a[2] + s]
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

function fillTriangle(zbuffer, a, b, c) {
  const screenVec = [width / 2, height / 2, 1]
  const as = mul(add(a, 1), screenVec).map((v) => v | 0)
  const bs = mul(add(b, 1), screenVec).map((v) => v | 0)
  const cs = mul(add(c, 1), screenVec).map((v) => v | 0)
  const points = []
  const [bbmin, bbmax] = computeBB([as, bs, cs])
  for (let x = bbmin[0]; x <= bbmax[0]; x++) {
    for (let y = bbmin[1]; y <= bbmax[1]; y++) {
      const bcScreen = barycentric(as, bs, cs, [x, y])
      if (bcScreen[0] >= 0 && bcScreen[1] >= 0 && bcScreen[2] >= 0) {
        let z = 0
        z += a[2] * bcScreen[0]
        z += b[2] * bcScreen[1]
        z += c[2] * bcScreen[2]
        if (zbuffer[x + y * width] < z) {
          zbuffer[x + y * width] = z
          points.push([x, height - y])
        }
      }
    }
  }
  return points
}

function renderWireframe(model) {
  model.faces.map((f) => {
    const face = f.map((i) => {
      const [x, y] = model.vertices[i - 1]
      return [((x + 1) * width / 2) | 0, ((-y + 1) * height / 2) | 0]
    })
    plot(
     triangle(...face),
     255,
     255,
     255,
    )
  })
}

function renderClown(model) {
  const zbuffer = new Array(width * height).fill(Number.MIN_VALUE)
  model.faces.map((f) => {
    const face = f.map((i) => {
      return model.vertices[i - 1]
    })
    plot(
     fillTriangle(zbuffer, ...face),
     Math.random() * 255 | 0,
     Math.random() * 255 | 0,
     Math.random() * 255 | 0,
    )
  })
}

function renderWithLight(model, light) {
  const zbuffer = new Array(width * height).fill(Number.MIN_VALUE)
  model.faces.map((f) => {
    const face = f.map((i) => {
      return model.vertices[i - 1]
    })
    const [a, b, c] = face
    const normal = normalize(cross(sub(c, a), sub(b, a)))
    const intensity = mul(normal, light)[2]
    if (intensity > 0) {
      const screenCoords = [
        [((a[0] + 1) * width / 2) | 0, ((-a[1] + 1) * height / 2) | 0, a[2]],
        [((b[0] + 1) * width / 2) | 0, ((-b[1] + 1) * height / 2) | 0, b[2]],
        [((c[0] + 1) * width / 2) | 0, ((-c[1] + 1) * height / 2) | 0, c[2]],
      ]
      plot(
       fillTriangle(zbuffer, ...face),
        255 * intensity | 0,
        255 * intensity | 0,
        255 * intensity | 0,
      )
    }
  })
}

loadModel('https://raw.githubusercontent.com/ssloy/tinyrenderer/master/obj/african_head/african_head.obj')
.then((model) => {
  ctx.fillRect(0, 0, width, height)
  // renderClown(model)
  // renderWireframe(model)
  renderWithLight(model, [0, 0, -1])
})
