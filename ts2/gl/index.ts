import Matrix from "ml-matrix"
import { TGAColor, TGAImage } from "../utils/TGAImage"
import vec2 from "../utils/vec2"
import vec3, { Vec3 } from "../utils/vec3"
import { Vec4 } from "../utils/vec4"

const depth = 255

let modelViewM
let viewportM
let projectionM

const lookat = (eye: Vec3, center: Vec3, up: Vec3): any => {
  let z: Vec3 = eye.sub(center).normalize()
  let x = Vec3.cross(up, z).normalize()
  let y = Vec3.cross(z, x).normalize()
  let minv = Matrix.eye(4, 4)
  let tr = Matrix.eye(4, 4)

  minv.set(0, 0, x.x)
  minv.set(1, 0, y.x)
  minv.set(2, 0, z.x)

  minv.set(0, 1, x.y)
  minv.set(1, 1, y.y)
  minv.set(2, 1, z.y)

  minv.set(0, 2, x.z)
  minv.set(1, 2, y.z)
  minv.set(2, 2, z.z)

  tr.set(0, 3, -center.x)
  tr.set(1, 3, -center.y)
  tr.set(2, 3, -center.z)

  modelViewM = minv.mmul(tr)
}

const viewport = (x: number, y: number, w: number, h: number): any => {
  let m = Matrix.eye(4)
  m.set(0, 3, x + w / 2)
  m.set(1, 3, y + h / 2)
  m.set(2, 3, depth / 2)

  m.set(0, 0, w / 2)
  m.set(1, 1, h / 2)
  m.set(2, 2, depth / 2)
  viewportM = m
}

const projection = (coeff: number): any => {
  let projection = Matrix.eye(4, 4)
  projection.set(3, 2, coeff)
  projectionM = projection
}

/**
 * 
 * @param pts 
 * @param p 
 * https://zhuanlan.zhihu.com/p/65495373
 */
function barycentric(a: Vec3, b: Vec3, c: Vec3, p: Vec3): Vec3 {
  let xvector = vec3(b.x - a.x, c.x - a.x, a.x - p.x)
  let yvector = vec3(b.y - a.y, c.y - a.y, a.y - p.y)


  let u = Vec3.cross(xvector, yvector)

  if (Math.abs(u.z) > 0) {
    return vec3(1 - (u.x + u.y) / u.z, u.y / u.z, u.x / u.z)
  }
  return vec3(-1, 1, 1)
}


function triangle(v0: Vec3, v1: Vec3, v2: Vec3, image: TGAImage, shader: IShader, zBuffer: Array<number>): void {

  let bboxmin = vec2(0, 0)
  let bboxmax = vec2(image.width - 1, image.height - 1)
  let p: Vec3 = vec3(0, 0, 0)



  bboxmin.x = Math.min(parseInt(v0.x), parseInt(v1.x), parseInt(v2.x))
  bboxmin.y = Math.min(parseInt(v0.y), parseInt(v1.y), parseInt(v2.y))
  bboxmax.x = Math.max(parseInt(v0.x), parseInt(v1.x), parseInt(v2.x), 0)
  bboxmax.y = Math.max(parseInt(v0.y), parseInt(v1.y), parseInt(v2.y), 0)

  for (p.x = bboxmin.x; p.x <= bboxmax.x; p.x++) {
    for (p.y = bboxmin.y; p.y <= bboxmax.y; p.y++) {
      let bcScreen: Vec3 = barycentric(v0, v1, v2, p)
      if (bcScreen.x < 0 || bcScreen.y < 0 || bcScreen.z < 0) continue
      p.z = 0
      p.z += v0.z * bcScreen.x
      p.z += v1.z * bcScreen.y
      p.z += v2.z * bcScreen.z
      let z = p.z
      let idx = parseInt(p.x + p.y * image.width)
      if (zBuffer[idx] > z) {
        continue
      }
      let color: TGAColor = [0, 0, 0, 255]
      let discard: boolean = shader.fragment(bcScreen, color)
      if (discard) continue
      zBuffer[idx] = z
      image.set(p.x, p.y, color)


    }
  }
}

interface IShader {
  vertex(iface: number, nthvert: number): Vec4
  fragment(bar: Vec3, color: TGAColor)
}

export {
  IShader,
  viewport, projection, lookat,
  modelViewM,
  viewportM,
  projectionM,
  triangle
}