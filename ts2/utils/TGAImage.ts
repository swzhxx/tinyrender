
export declare type TGAColor = [number, number, number, number]

const RGB: TGAColor = [0, 0, 0, 255]

class TGAImage {
  width: number
  height: number
  color: TGAColor
  data: Array<number>
  constructor(width: number, height: number, color: TGAColor) {
    this.width = width
    this.height = height
    this.color = color

    this.data = this.initData()
  }
  private initData(): Array<number> {
    let data = []
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        data.push(this.color[0])
        data.push(this.color[1])
        data.push(this.color[2])
        data.push(this.color[3])
      }
    }
    return data
  }

  getIndex(row: number, col: number): number {
    if (row >= this.height || col >= this.width || row < 0 || col < 0) {
      return
    }
    return (row * this.height + col) * 4
  }

  set(x: number, y: number, color: TGAColor) {
    try {
      let index: number = this.getIndex(parseInt(y.toString()), parseInt(x.toString()))
      if (index == undefined) return
      this.data[index] = color[0]
      this.data[index + 1] = color[1]
      this.data[index + 2] = color[2]
      this.data[index + 3] = color[3]
    } catch (e) {
      return console.error(`row ${x} col ${y}`, e)
    }
  }

  get(x: number, y: number): TGAColor {

    let index: number = this.getIndex(parseInt(y.toString()), parseInt(x.toString()))
    if (index == undefined) return
    let color = [this.data[index], this.data[index + 1], this.data[index + 2], this.data[index + 3]] as TGAColor
    return color

  }

  toImageData(): ImageData {
    return new ImageData(Uint8ClampedArray.from(this.data), this.width, this.height)
  }

  flipVertically() {
    if (!this.data.length) return
    let half = this.height >> 1
    for (let j = 0; j < half; j++) {
      let l1start = j * this.width * 4
      let l1end = l1start + this.width * 4
      let l2start = (this.height - 1 - j) * this.width * 4
      let l2end = l2start + this.width * 4
      let l1 = this.data.slice(l1start, l1end)
      let l2 = this.data.slice(l2start, l2end)
      let i = 0
      while (true) {
        let index = l1start + i
        if (index >= l1end) {
          break
        }
        this.data[index] = l2[i]
        i++
      }
      i = 0
      while (true) {
        let index = l2start + i
        if (index >= l2end) {
          break
        }
        this.data[index] = l1[i]
        i++
      }

    }
  }
}

const image = (width: number, height: number, color: TGAColor = RGB): TGAImage => {
  return new TGAImage(width, height, color)
}
export default image
export { RGB, TGAImage }