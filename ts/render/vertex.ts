import { Matrix } from 'ml-matrix'

class Vertex {
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

  add(b: Vertex): Vertex {
    let matrix: any = Matrix.add(this.vector, b.vector)
    return vertex(matrix.data[0][0], matrix.data[1][0])
  }

  sub(b: Vertex): Vertex {
    let matrix: any = Matrix.sub(this.vector, b.vector)
    return vertex(matrix.data[0][0], matrix.data[1][0])
  }

  mul(n: number): Vertex {
    this.vector.mul(n)
    return this
  }
}

function vertex(x: number, y: number): Vertex {
  return new Vertex(x, y)
}



export default vertex
export { Vertex }