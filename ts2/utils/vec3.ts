import { Matrix } from 'ml-matrix'
import { create, clone, dot, cross, normalize } from 'gl-matrix/vec3'
import vec2, { Vec2 } from './vec2'
import vec4, { Vec4 } from './vec4'
class Vec3 {
  vector: any
  constructor(x: number, y: number, z: number) {
    this.vector = Matrix.columnVector([x, y, z])
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
  set x(val) {
    this.vector.data[0][0] = val
  }
  set y(val) {
    this.vector.data[1][0] = val
  }
  set z(val) {
    this.vector.data[2][0] = val
  }
  set 0(val) {
    this.x = val
  }
  get 0() {
    return this.x
  }
  set 1(val) {
    this.y = val
  }
  get 1() {
    return this.y
  }
  set 2(val) {
    this.z = val
  }
  get 2() {
    return this.z
  }

  add(b: Vec3): Vec3 {
    let matrix: any = Matrix.add(this.vector, b.vector)
    return vec3(matrix.data[0][0], matrix.data[1][0], matrix.data[2][0])
  }

  sub(b: Vec3): Vec3 {
    let matrix: any = Matrix.sub(this.vector, b.vector)
    return vec3(matrix.data[0][0], matrix.data[1][0], matrix.data[2][0])
  }

  mul(n: number): Vec3 {
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

  toVec2(): Vec2 {
    return vec2(this.x, this.y)
  }
  toVec4(): Vec4 {
    return vec4(this.x, this.y, this.z, 1)
  }

  static dot(a: Vec3, b: Vec3): number {
    let _a = clone([a.x, a.y, a.z])
    let _b = clone([b.x, b.y, b.z])
    return dot(_a, _b)
  }
  static cross(a: Vec3, b: Vec3): Vec3 {
    let out = create()
    let _a = clone([a.x, a.y, a.z])
    let _b = clone([b.x, b.y, b.z])
    cross(out, _a, _b)
    return vec3(out[0], out[1], out[2])
  }
}

function vec3(x: number, y: number, z: number): Vec3 {
  return new Vec3(x, y, z)
}



export default vec3
export { Vec3 }