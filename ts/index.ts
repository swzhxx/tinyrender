
import { draw, draw3dModel } from './render'

function main() {
  const canvas: HTMLCanvasElement = document.querySelector("#rustCanvas")
  let context = canvas.getContext("2d")
  // draw(context, 200, 200)
  draw3dModel(context, 600, 600)

}



main()