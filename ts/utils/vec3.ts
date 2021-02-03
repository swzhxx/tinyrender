import { Matrix } from 'ml-matrix'
import { create, clone, dot, cross, normalize } from 'gl-matrix/vec3'
class Vec3 {
  private vector: any
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