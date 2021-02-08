import image, { TGAColor, RGB, TGAImage } from './TGAImage'
import line from './line'
import head from './../../assets/head.obj'
import vec2, { Vec2 } from '../utils/vec2'
import vec3, { Vec3 } from '../utils/vec3'
import triangle from './triangle'
import { parseRead } from '3d-model-manger'

import { Matrix } from 'ml-matrix'


const depth = 255

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

  return minv.mmul(tr)
}

const viewport = (x: number, y: number, w: number, h: number): any => {
  let m = Matrix.eye(4)
  m.set(0, 3, x + w / 2)
  m.set(1, 3, y + h / 2)
  m.set(2, 3, depth / 2)

  m.set(0, 0, w / 2)
  m.set(1, 1, h / 2)
  m.set(2, 2, depth / 2)
  return m
}

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


  let light_dir = vec3(1, -1, 1).normalize()
  let eye = vec3(1, 1, 3)
  let center = vec3(0, 0, 0)

  let modelViewM = lookat(eye, center, vec3(0, 1, 0))
  let projectionM = Matrix.eye(4, 4)
  projectionM.set(3, 2, -1 / eye.sub(center).norm())
  let viewportM = viewport(width / 8, height / 8, width * 3 / 4, height * 3 / 4)


  let zbuffer: Array<number> = new Array(width * height).fill(-10)


  for (let i = 0; i < model.Faces.length; i++) {
    let face = model.Faces[i]
    let vertices = face.vertices
    let screenCoords = []
    let intensity = [255, 255, 255, 255]
    for (let j = 0; j < 3; j++) {
      let x = parseFloat(vertices[j].x)
      let y = parseFloat(vertices[j].y)
      let z = parseFloat(vertices[j].z)
      let m = viewportM.mmul(projectionM.mmul(modelViewM.mmul(Matrix.columnVector([x, y, z, 1]))))
      let _v = vec3(m.get(0, 0), m.get(1, 0), m.get(2, 0))
      screenCoords.push(_v)
      // screenCoords.push(vec3(x, y, z))


    }
    triangle(screenCoords[0], screenCoords[1], screenCoords[2], image1, intensity as TGAColor, zbuffer)

  }
  image1.flipVertically()
  let imageData = image1.toImageData()
  context.putImageData(imageData, 0, 0)
  console.log(model)
}