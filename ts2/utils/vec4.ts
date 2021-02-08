import { Matrix } from 'ml-matrix'
import { create, clone, dot, cross, normalize } from 'gl-matrix/vec3'
import vec3, { Vec3 } from './vec3'
class Vec4 {
  vector: any
  constructor(x: number, y: number, z: number, w: number) {
    this.vector = Matrix.columnVector([x, y, z, w])
  }
  get x() {
    return this.vector.data[0][0]
  }
  get y() {
    return this.vector.data[1][0]
  }
  get z() {
    return this.vector.data[2][0]
  }
  get w() {
    return this.vector.data[3][0]
  }
  set x(val) {
    this.vector.data[0][0] = val
  }
  set y(val) {
    this.vector.data[1][0] = val
  }
  set z(val) {
    this.vector.data[2][0] = val
  }
  set w(val) {
    this.vector.data[3][0] = val
  }


  add(b: Vec4): Vec4 {
    let matrix: any = Matrix.add(this.vector, b.vector)
    return vec4(matrix.data[0][0], matrix.data[1][0], matrix.data[2][0], matrix.data[3][0])
  }

  sub(b: Vec4): Vec4 {
    let matrix: any = Matrix.sub(this.vector, b.vector)
    return vec4(matrix.data[0][0], matrix.data[1][0], matrix.data[2][0], matrix.data[3][0])
  }

  mul(n: number): Vec4 {
    this.vector.mul(n)
    return this
  }
  normalize() {
    let out = create()
    normalize(out, [this.x, this.y, this.z])
    return vec3(out[0], out[1], out[2])
  }

  norm() {
    return this.vector.norm()
  }

  toVec3(): Vec3 {
    return vec3(this.x, this.y, this.z)
  }

  static dot(a: Vec4, b: Vec4): number {
    let _a = clone([a.x, a.y, a.z, a.w])
    let _b = clone([b.x, b.y, b.z, a.w])
    return dot(_a, _b)
  }
  static cross(a: Vec4, b: Vec4): Vec4 {
    let out = create()
    let _a = clone([a.x, a.y, a.z, a.w])
    let _b = clone([b.x, b.y, b.z, b.w])
    cross(out, _a, _b)
    return vec4(out[0], out[1], out[2], out[3])
  }
}

function vec4(x: number, y: number, z: number, w: number): Vec4 {
  return new Vec4(x, y, z, w)
}



export default vec4
export { Vec4 }