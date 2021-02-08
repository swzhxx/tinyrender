
import image, { RGB, TGAColor, TGAImage } from "./utils/TGAImage"
import vec3, { Vec3 } from "./utils/vec3"
import { lookat, triangle, viewport, projection, IShader, projectionM, modelViewM, viewportM } from './gl'
// import { parseRead } from '3d-model-manger'
import head from './assets/head.obj'
import { OBJ } from 'webgl-obj-loader'
import vec4, { Vec4 } from "./utils/vec4"
import Model from './model'
import { Matrix } from 'ml-matrix'

const width = 800
const height = 800

const getContext = (): CanvasRenderingContext2D => {
  const canvas: HTMLCanvasElement = document.querySelector("#rustCanvas")
  let context = canvas.getContext("2d")
  return context
}



const eye = vec3(1, 1, 3)
const center = vec3(0, 0, 0)
const up = vec3(0, 1, 0)
let lightDir = vec3(1, 1, 1)

let model: Model

class GouraudShader implements IShader {
  varyingIntensity: Array<number>
  constructor() {
    this.varyingIntensity = []
  }
  vertex(iface: number, nthvert: number): Vec4 {
    let vertex = model.getVertFace(iface, nthvert)
    this.varyingIntensity[nthvert] = Vec3.dot(vertex, lightDir)

    // this.varyingIntensity = Vec3.cross(v, lightDir)
    let _v = viewportM.mmul(projectionM.mmul(modelViewM.mmul(vertex.toVec4().vector)))
    return vec4(_v.get(0, 0), _v.get(1, 0), _v.get(2, 0), _v.get(3, 0))
  }
  fragment(bar: Vec3, color: TGAColor): boolean {
    let varying = vec3(this.varyingIntensity[0], this.varyingIntensity[1], this.varyingIntensity[2])
    let intensity = Vec3.dot(varying, bar)
    let ci = vec3(255 * intensity, 255 * intensity, 255 * intensity)
    color[0] = ci.x
    color[1] = ci.y
    color[2] = ci.z
    return false
  }

}
class Shader implements IShader {
  public varyingIntensity: Vec3
  public varyingUV

  constructor() {
    this.varyingUV = Matrix.zeros(3, 2)
  }

  vertex(iface: number, nthvert: number): Vec4 {
    let uv = model.getUv(iface, nthvert)
    this.varyingUV.set(nthvert, 0, uv.x)
    this.varyingUV.set(nthvert, 0, uv.y)
    let vertex = model.getVertFace(iface, nthvert)
    let _v = viewportM.mmul(projectionM.mmul(modelViewM.mmul(vertex.toVec4().vector)))
    return vec4(_v.get(0, 0), _v.get(1, 0), _v.get(2, 0), _v.get(3, 0))
  }
  fragment(bar: Vec3, color: TGAColor) {
    let varying = vec3(this.varyingIntensity[0], this.varyingIntensity[1], this.varyingIntensity[2])
    let intensity = Vec3.dot(varying, bar)
    let c = model.diffuse(this.varyingUV)
    color[0] = c[0] * intensity
    color[1] = c[1] * intensity
    color[2] = c[2] * intensity
    return false
  }

}




function main() {
  // const model = parseRead({ modelData: head })
  model = new Model(head)
  const context: CanvasRenderingContext2D = getContext()
  let image1: TGAImage = image(width, height, RGB)
  lookat(eye, center, up)
  viewport(width / 8, height / 8, width * 3 / 4, height * 3 / 4)
  projection(-1 / eye.sub(center).norm())
  let shader = new Shader()
  let zbuffer: Array<number> = new Array(width * height).fill(-Infinity)
  for (let i = 0; i < model.faces.length; i++) {
    let screenCoords = []
    for (let j = 0; j < 3; j++) {
      screenCoords.push(shader.vertex(i, j))
    }
    triangle(screenCoords[0], screenCoords[1], screenCoords[2], image1, shader, zbuffer)
  }
  image1.flipVertically()
  let imageData = image1.toImageData()
  context.putImageData(imageData, 0, 0)
}

main()
const mesh = new OBJ.Mesh(head)
console.log(mesh)