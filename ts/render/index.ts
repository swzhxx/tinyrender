import image, { TGAColor, RGB, TGAImage } from './TGAImage'
import line from './line'
import head from './../../assets/head.obj'
import vec2, { Vec2 } from '../utils/vec2'
import vec3, { Vec3 } from '../utils/vec3'
import triangle from './triangle'
import { parseRead } from '3d-model-manger'

// export function draw(context: CanvasRenderingContext2D, width: number, height: number) {
//   let image1: TGAImage = image(width, height, RGB)
//   // image1.set(0, 0, [255, 0, 0, 255])
//   // line(vec2(13, 20), vec2(80, 40), image1, [255, 255, 255, 255] as TGAColor)
//   // line(vec2(20, 13), vec2(40, 80), image1, [255, 0, 0, 255] as TGAColor)
//   // line(vec2(80, 40), vec2(13, 20), image1, [255, 0, 255, 255] as TGAColor)

//   let t0: Array<Vec2> = [vec2(10, 70), vec2(50, 160), vec2(70, 80)]

//   let t1: Array<Vec2> = [vec2(180, 50), vec2(150, 1), vec2(70, 180)]
//   let t2: Array<Vec2> = [vec2(180, 150), vec2(120, 160), vec2(130, 180)]

//   triangle(t0[0], t0[1], t0[2], image1, [255, 0, 0, 255])
//   triangle(t1[0], t1[1], t1[2], image1, [255, 255, 255, 255])
//   triangle(t2[0], t2[1], t2[2], image1, [0, 255, 0, 255])

//   image1.flipVertically()
//   let imageData = image1.toImageData()
//   context.putImageData(imageData, 0, 0)
// }


export function draw3dModel(context: CanvasRenderingContext2D, width: number, height: number) {
  const model = parseRead({ modelData: head })
  let image1: TGAImage = image(width, height, RGB)


  let zbuffer: Array<number> = new Array(width * height).fill(-10)


  for (let i = 0; i < model.Faces.length; i++) {
    let face = model.Faces[i]
    let vertices = face.vertices
    let _v = []
    let word = []
    for (let j = 0; j < 3; j++) {
      let x = (parseFloat(vertices[j].x) + 1) * width / 2 + 0.5
      let y = (parseFloat(vertices[j].y) + 1) * height / 2 + 0.5
      let z = (parseFloat(vertices[j].z) )
      _v.push(vec3(x, y, z))
      word.push(vec3(x, y, z))

    }
    let n = Vec3.cross(word[2].sub(word[0]), word[1].sub(word[0])).normalize()

    // if (intensity > 0) {
    triangle(_v[0], _v[1], _v[2], image1, [parseInt(255 + ''), parseInt(255 + ''), parseInt(255 + ''), 255], zbuffer)
    // }
  }
  image1.flipVertically()
  let imageData = image1.toImageData()
  context.putImageData(imageData, 0, 0)
  console.log(model)
}