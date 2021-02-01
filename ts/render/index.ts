import image, { TGAColor, RGB, TGAImage } from './TGAImage'
import line from './line'
import head from './../../assets/head.obj'


export default function draw(context: CanvasRenderingContext2D, width: number, height: number) {
  let image1: TGAImage = image(width, height, RGB)
  image1.set(50, 50, [255, 0, 0, 255])
  line(13, 20, 80, 40, image1, [255, 255, 255, 255] as TGAColor)
  line(20, 13, 40, 80, image1, [255, 0, 0, 255] as TGAColor)
  line(80, 40, 13, 20, image1, [255, 0, 255, 255] as TGAColor)
  image1.flipVertically()
  let imageData = image1.toImageData()
  context.putImageData(imageData, 0, 0)
}