import image, { TGAColor, RGB, TGAImage } from './TGAImage'
import line from './line'
import head from './../../assets/head.obj'
import vertex, { Vertex } from './vertex'
import triangle from './triangle'

export default function draw(context: CanvasRenderingContext2D, width: number, height: number) {
  let image1: TGAImage = image(width, height, RGB)
  // image1.set(0, 0, [255, 0, 0, 255])
  // line(vertex(13, 20), vertex(80, 40), image1, [255, 255, 255, 255] as TGAColor)
  // line(vertex(20, 13), vertex(40, 80), image1, [255, 0, 0, 255] as TGAColor)
  // line(vertex(80, 40), vertex(13, 20), image1, [255, 0, 255, 255] as TGAColor)

  let t0: Array<Vertex> = [vertex(10, 70), vertex(50, 160), vertex(70, 80)]

  let t1: Array<Vertex> = [vertex(180, 50), vertex(150, 1), vertex(70, 180)]
  let t2: Array<Vertex> = [vertex(180, 150), vertex(120, 160), vertex(130, 180)]

  triangle(t0[0], t0[1], t0[2], image1, [255, 0, 0, 255])
  triangle(t1[0], t1[1], t1[2], image1, [255, 255, 255, 255])
  triangle(t2[0], t2[1], t2[2], image1, [0, 255, 0, 255])

  image1.flipVertically()
  let imageData = image1.toImageData()
  context.putImageData(imageData, 0, 0)
}