import vec2, { Vec2 } from "../utils/vec2"
import vec3, { Vec3 } from '../utils/vec3'
import { TGAColor, TGAImage } from './TGAImage'
import line from './line'

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


function triangle(v0: Vec3, v1: Vec3, v2: Vec3, image: TGAImage, color: TGAColor, zBuffer: Array<number>): void {
  // line(v0.toVec2(), v1.toVec2(), image, color)
  // line(v1.toVec2(), v2.toVec2(), image, color)
  // line(v2.toVec2(), v0.toVec2(), image, color)
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
      // if (z > 0) continue
      let idx = parseInt(p.x + p.y * image.width)

      if (zBuffer[idx] < z) {
        zBuffer[idx] = z
        // let _c = (z + 1) * 123

        image.set(p.x, p.y, color)
      } else {

      }

    }
  }
}

// /**
//  * 
//  * @param v0 
//  * @param v1 
//  * @param v2 
//  * @param image 
//  * @param color 
//  * @description 
//  * step1: 按照顶点的y值进行排序 升序排列
//  */
// function triangle(v0: Vec2, v1: Vec2, v2: Vec2, image: TGAImage, color: TGAColor): void {
//   if (v0.y == v1.y && v0.y == v2.y) return
//   if (v0.y > v1.y) {
//     let temp = v0
//     v0 = v1
//     v1 = temp
//   }
//   if (v0.y > v2.y) {
//     let temp = v0
//     v0 = v2
//     v2 = temp
//   }
//   if (v1.y > v2.y) {
//     let temp = v1
//     v1 = v2
//     v2 = temp
//   }

//   let totalHeight: number = v2.y - v0.y
//   for (let i = 0; i < totalHeight; i++) {
//     let second_half = (i > v1.y - v0.y) || v1.y == v0.y
//     let segmentHeight = second_half ? v2.y - v1.y : v1.y - v0.y
//     let alpha = i / totalHeight
//     let beta = (i - (second_half ? v1.y - v0.y : 0)) / segmentHeight

//     let a: Vec2 = v0.add(v2.sub(v0).mul(alpha))
//     let b: Vec2 = second_half ? v1.add(v2.sub(v1).mul(beta)) : v0.add(v1.sub(v0).mul(beta))
//     if (a.x > b.x) {
//       let temp = a
//       a = b
//       b = temp
//     }
//     for (let j = a.x; j < b.x; j++) {
//       image.set(j, v0.y + i, color)
//     }
//   }


//   // line(v0, v1, image, color)
//   // line(v1, v2, image, color)
//   // line(v2, v0, image, color)
// }
export default triangle