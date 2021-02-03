import { Matrix } from 'ml-matrix'

class Vec2 {
  private vector: any
  constructor(x: number, y: number) {
    this.vector = Matrix.columnVector([x, y])
  }
  get x() {
    return this.vector.data[0][0]
  }
  get y() {
    return this.vector.data[1][0]
  }

  set x(val) {
    this.vector.data[0][0] = val
  }
  set y(val) {
    this.vector.data[1][0] = val
  }

  add(b: Vec2): Vec2 {
    let matrix: any = Matrix.add(this.vector, b.vector)
    return vec2(matrix.data[0][0], matrix.data[1][0])
  }

  sub(b: Vec2): Vec2 {
    let matrix: any = Matrix.sub(this.vector, b.vector)
    return vec2(matrix.data[0][0], matrix.data[1][0])
  }

  mul(n: number): Vec2 {
    this.vector.mul(n)
    return this
  }
  normalize() {
    let n = this.vector.norm()
    return new Vec2(n.x, n.y)
  }


}

function vec2(x: number, y: number): Vec2 {
  return new Vec2(x, y)
}



export default vec2
export { Vec2 }