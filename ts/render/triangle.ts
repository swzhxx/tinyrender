import vertex, { Vertex } from "./vertex"
import { TGAColor, TGAImage } from './TGAImage'
import line from './line'

/**
 * 
 * @param v0 
 * @param v1 
 * @param v2 
 * @param image 
 * @param color 
 * @description 
 * step1: 按照顶点的y值进行排序 升序排列
 */
function triangle(v0: Vertex, v1: Vertex, v2: Vertex, image: TGAImage, color: TGAColor): void {
  if (v0.y == v1.y && v0.y == v2.y) return
  if (v0.y > v1.y) {
    let temp = v0
    v0 = v1
    v1 = temp
  }
  if (v0.y > v2.y) {
    let temp = v0
    v0 = v2
    v2 = temp
  }
  if (v1.y > v2.y) {
    let temp = v1
    v1 = v2
    v2 = temp
  }

  let totalHeight: number = v2.y - v0.y
  for (let i = 0; i < totalHeight; i++) {
    let second_half = (i > v1.y - v0.y) || v1.y == v0.y
    let segmentHeight = second_half ? v2.y - v1.y : v1.y - v0.y
    let alpha = i / totalHeight
    let beta = (i - (second_half ? v1.y - v0.y : 0)) / segmentHeight

    let a: Vertex = v0.add(v2.sub(v0).mul(alpha))
    let b: Vertex = second_half ? v1.add(v2.sub(v1).mul(beta)) : v0.add(v1.sub(v0).mul(beta))
    if (a.x > b.x) {
      let temp = a
      a = b
      b = temp
    }
    for (let j = a.x; j < b.x; j++) {
      image.set(j, v0.y + i, color)
    }
  }


  // line(v0, v1, image, color)
  // line(v1, v2, image, color)
  // line(v2, v0, image, color)
}
export default triangle