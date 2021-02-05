
import { draw3dModel } from './render'

function main() {
  const canvas: HTMLCanvasElement = document.querySelector("#rustCanvas")
  let context = canvas.getContext("2d")
  // draw(context, 200, 200)
  draw3dModel(context, 800, 800)

}



main()