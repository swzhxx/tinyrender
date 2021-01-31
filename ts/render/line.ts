import { TGAImage, TGAColor } from './TGAImage'
/**
 * Bresenham’s Line Drawing Algorithm
 * @param x0 
 * @param y0 
 * @param x1 
 * @param y1 
 * @param image 
 * @param color 
 * @description Bresenham’s Line Drawing Algorithm
 * step1 :判断线段的斜率。 如果斜率大于1则交换x,y的值并将steep设置为true
 * step2 :判断线段起始点与终止点，始终保持X低 -> X高
 * step3 :初始化delta值
 * step4 :累计error 判断是否超过斜率，对y值进行补正。这里通过乘以2的方式避免了除法预算
 * error = dy / dx  判断error 是否大于0.5 
 *  ↓
 *  error - dy/dx > 0.5?  -> error2 - (dy/dx) * 2 > 1? -> error2 - dy > dx?
 *  最终判断式 error2 - dy  > dx?
 *  https://zh.wikipedia.org/wiki/%E5%B8%83%E9%9B%B7%E6%A3%AE%E6%BC%A2%E5%A7%86%E7%9B%B4%E7%B7%9A%E6%BC%94%E7%AE%97%E6%B3%95
 */
const line = (x0: number, y0: number, x1: number, y1: number, image: TGAImage, color: TGAColor) => {
  let steep: boolean = false
  if (Math.abs(x0 - x1) < Math.abs(y0 - y1)) {
    let temp = x0
    x0 = y0
    y0 = x0

    temp = x1
    x1 = y1
    y1 = x1
    steep = true
  }
  if (x0 > x1) {
    let tempX = x0
    let tempY = y0
    x0 = x1
    y0 = y1
    x1 = tempX
    y1 = tempY
  }

  let dx = x1 - x0
  let dy = y1 - y0
  let derror2 = Math.abs(dy) * 2
  let error2 = 0
  let y = y0

  for (let x = x0; x <= x1; x++) {
    if (steep) {
      image.set(y, x, color)
    } else {
      image.set(x, y, color)
    }
    error2 += derror2
    if (error2 > dx) {
      y += y1 > y0 ? 1 : -1
      error2 -= dx * 2
    }
  }
}

export default line