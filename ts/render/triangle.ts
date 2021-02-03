import vec2, { Vec2 } from "../utils/vec2"
import vec3, { Vec3 } from '../utils/vec3'
import { TGAColor, TGAImage } from './TGAImage'
import line from './line'


function barycentric(pts: Array<Vec2>, p: Vec2): Vec3 {
  let a = pts[0]
  let b = pts[1]
  let c = pts[2]
  const gama = ((a.y - b.y) * p.x + (b.x - a.x) * p.y + a.x * b.y - b.x * a.y) / ((a.y - b.y) * c.x + (b.x - a.x) * c.y + a.x * b.y - b.x * a.y)
  const beta = ((a.y - c.y) * p.x + (c.x - a.x) * p.y + a.x * c.y - c.x * a.y) / ((a.y - c.y) * b.x + (c.x - a.x) * b.y + a.x * c.y - c.x * a.y)
  const alpha = 1 - gama - beta
  return vec3(alpha, beta, gama)

}


function triangle(v0: Vec2, v1: Vec2, v2: Vec2, image: TGAImage, color: TGAColor): void {
  let bboxmin = vec2(0, 0)
  let bboxmax = vec2(image.width - 1, image.height - 1)
  let p: Vec2 = vec2(0, 0)



  bboxmin.x = Math.min(v0.x, v1.x, v2.x)
  bboxmin.y = Math.min(v0.y, v1.y, v2.y)
  bboxmax.x = Math.max(v0.x, v1.x, v2.x, 0)
  bboxmax.y = Math.max(v0.y, v1.y, v2.y, 0)




  for (p.x = bboxmin.x; p.x <= bboxmax.x; p.x++) {
    for (p.y = bboxmin.y; p.y <= bboxmax.y; p.y++) {
      let bcScreen: Vec3 = barycentric([v0, v1, v2], p)
      if (bcScreen.x < 0 || bcScreen.y < 0 || bcScreen.z < 0) continue
      image.set(p.x, p.y, color)
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