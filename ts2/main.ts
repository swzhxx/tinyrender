import { normalize } from 'gl-matrix/vec3'

import image, { RGB, TGAColor, TGAImage } from "./utils/TGAImage"
import vec3, { Vec3 } from "./utils/vec3"
import { lookat, triangle, viewport, projection, IShader, projectionM, modelViewM, viewportM } from './gl'
// import { parseRead } from '3d-model-manger'
import head from './assets/head.obj'
import { OBJ } from 'webgl-obj-loader'
import vec4, { Vec4 } from "./utils/vec4"
import Model from './model'
import { Matrix, inverse } from 'ml-matrix'
import vec2 from "./utils/vec2"

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
let lightDir = vec3(1, 1, 1).normalize()

let model: Model

class GouraudShader implements IShader {
  varyingIntensity: Array<number>
  constructor() {
    this.varyingIntensity = []
  }
  vertex(iface: number, nthvert: number): Vec4 {
    let vertex = model.getVertFace(iface, nthvert)
    this.varyingIntensity[nthvert] = Math.max(0, Vec3.dot(model.normalVector(iface, nthvert), lightDir))
    // this.varyingIntensity = Vec3.cross(v, lightDir)
    let _v = viewportM.mmul(projectionM.mmul(modelViewM.mmul(vertex.toVec4().vector)))
    return vec4(_v.get(0, 0), _v.get(1, 0), _v.get(2, 0), _v.get(3, 0))
  }
  fragment(bar: Vec3, color: TGAColor): boolean {
    let varying = vec3(this.varyingIntensity[0], this.varyingIntensity[1], this.varyingIntensity[2])
    let intensity = Vec3.dot(varying, bar)

    let ci = vec3(255, 255, 255).mul(intensity)
    color[0] = ci.x
    color[1] = ci.y
    color[2] = ci.z
    return false
  }

}
class Shader implements IShader {
  public varyingIntensity: Array<number>


  public varyingUV
  public varyingTRI // triangle coordinates (clip coordinates), written by VS, read by FS
  public varyingNRM // normal per vertex to be interpolated by FS
  public ndcTRI // triangle in normalized device coordinates

  public uniform_M
  public uniform_MIT

  constructor() {
    this.varyingUV = Matrix.zeros(2, 3)
    this.varyingNRM = Matrix.zeros(3, 3)
    this.varyingTRI = Matrix.zeros(4, 3)
    this.ndcTRI = Matrix.zeros(3, 3)

    this.varyingIntensity = []
  }

  vertex(iface: number, nthvert: number): Vec4 {
    let vertex = model.getVertFace(iface, nthvert)
    let _v = viewportM.mmul(projectionM.mmul(modelViewM.mmul(vertex.toVec4().vector)))


    let uv = model.getUv(iface, nthvert)
    // this.varyingUV.set(0, nthvert, uv.x)
    // this.varyingUV.set(1, nthvert, uv.y)
    this.varyingUV.setColumn(nthvert, uv.vector.to1DArray())

    let tempVertex = this.uniform_MIT.mmul(model.normal(uv).toVec4().vector)

    this.varyingNRM.setColumn(nthvert, tempVertex.removeRow(3).to1DArray())
    // this.varyingNRM.set(0, nthvert, tempVertex.get(0, 0))
    // this.varyingNRM.set(1, nthvert, tempVertex.get(1, 0))
    // this.varyingNRM.set(2, nthvert, tempVertex.get(2, 0))

    this.varyingTRI.setColumn(nthvert, _v.to1DArray())
    // this.varyingTRI.set(0, nthvert, _v.get(0, 0))
    // this.varyingTRI.set(1, nthvert, _v.get(1, 0))
    // this.varyingTRI.set(2, nthvert, _v.get(2, 0))


    this.ndcTRI.setColumn(nthvert, _v.clone().removeRow(3).to1DArray())
    // this.ndcTRI.set(0, nthvert, _v.get(0, 0))
    // this.ndcTRI.set(1, nthvert, _v.get(1, 0))
    // this.ndcTRI.set(2, nthvert, _v.get(2, 0))



    this.varyingIntensity[nthvert] = Vec3.dot(model.normalVector(iface, nthvert), lightDir)

    return vec4(_v.get(0, 0), _v.get(1, 0), _v.get(2, 0), _v.get(3, 0))
  }
  fragment(bar: Vec3, color: TGAColor) {
    // let varying = vec3(this.varyingIntensity[0], this.varyingIntensity[1], this.varyingIntensity[2])

    let barMatrix = Matrix.columnVector([bar.x, bar.y, bar.z])

    let _bn = this.varyingNRM.mmul(barMatrix)
    // let bn = vec3(_bn.get(0, 0), _bn.get(1, 0), _bn.get(2, 0)).normalize()

    let _uv = this.varyingUV.mmul(barMatrix)
    let uv = vec2(_uv.get(0, 0), _uv.get(1, 0))

    // let A = Matrix.zeros(3, 3)
    // A.setRow(0, Matrix.columnVector(this.ndcTRI.getColumn(1)).sub(Matrix.columnVector(this.ndcTRI.getColumn(0))).to1DArray())
    // A.setRow(1, Matrix.columnVector(this.ndcTRI.getColumn(2)).sub(Matrix.columnVector(this.ndcTRI.getColumn(0))).to1DArray())
    // A.setRow(2, _bn.to1DArray())

    // let AI = inverse(A)

    // let i = AI.mmul(Matrix.columnVector([this.varyingUV.get(0, 1) - this.varyingUV.get(0, 0), this.varyingUV.get(0, 2) - this.varyingUV.get(0, 0), 0]))
    // let j = AI.mmul(Matrix.columnVector([this.varyingUV.get(1, 1) - this.varyingUV.get(1, 0), this.varyingUV.get(1, 2) - this.varyingUV.get(1, 0), 0]))
    // b.setColumn(0, i.to1DArray())
    // b.setColumn(1, j.to1DArray())
    // b.setColumn(2, _bn.to1DArray())

    let E = Matrix.zeros(2, 3)
    E.setRow(0, Matrix.columnVector(this.ndcTRI.getColumn(1)).sub(Matrix.columnVector(this.ndcTRI.getColumn(0))).to1DArray())
    E.setRow(1, Matrix.columnVector(this.ndcTRI.getColumn(2)).sub(Matrix.columnVector(this.ndcTRI.getColumn(0))).to1DArray())


    let UV = Matrix.zeros(2, 2)

    UV.setColumn(0, Matrix.columnVector([this.varyingUV.get(0, 1) - this.varyingUV.get(0, 0), this.varyingUV.get(0, 2) - this.varyingUV.get(0, 0)]))
    UV.setColumn(1, Matrix.columnVector([this.varyingUV.get(1, 1) - this.varyingUV.get(1, 0), this.varyingUV.get(1, 2) - this.varyingUV.get(1, 0)]))


    let UVI = inverse(UV)
    //let BIE = BI.mmul(E)



    let TBN = Matrix.zeros(3, 3)

    let T = Matrix.add(Matrix.columnVector(E.getRow(0)).mul(UVI.get(0, 0)), Matrix.columnVector(E.getRow(1)).mul(UVI.get(0, 1))).to1DArray()
    let B = Matrix.add(Matrix.columnVector(E.getRow(0)).mul(UVI.get(1, 0)), Matrix.columnVector(E.getRow(1)).mul(UVI.get(1, 1))).to1DArray()

    let _T = vec3(T[0], T[1], T[2]).normalize()
    let _B = vec3(B[0], B[1], B[2]).normalize()
    TBN.setColumn(0, _T.vector)
    TBN.setColumn(1, _B.vector)
    TBN.setColumn(2, _bn)



    let _n = TBN.mmul(model.normal(uv).normalize().vector)
    let n = vec3(_n.get(0, 0), _n.get(1, 0), _n.get(2, 0))

    let tempL = this.uniform_M.mmul(lightDir.toVec4().vector)
    let l = vec3(tempL.get(0, 0), tempL.get(1, 0), tempL.get(2, 0)).normalize()

    let r = n.mul(Vec3.dot(n, l) * 2).sub(l).normalize()

    let diff = Math.max(0, Vec3.dot(n, l))

    let spec = Math.pow(Math.max(r.z, 0), model.specular(uv))

    let _c = model.diffuse(uv)

    for (let i = 0; i < 3; i++) {
      // color[i] = Math.min(5 + _c[i] * (diff + spec * 0.5), 255)
      color[i] = _c[i] * diff
    }

    return false
  }

}




function main() {
  // const model = parseRead({ modelData: head })
  model = new Model(head)
  console.log(model)
  const context: CanvasRenderingContext2D = getContext()
  let image1: TGAImage = image(width, height, RGB)
  lookat(eye, center, up)
  viewport(width / 8, height / 8, width * 3 / 4, height * 3 / 4)
  projection(0)
  let shader = new Shader()

  shader.uniform_M = projectionM.mmul(modelViewM)
  shader.uniform_MIT = inverse(projectionM.mmul(modelViewM)).transpose()

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


// const mesh = new OBJ.Mesh(head)
// console.log(mesh)
main()