
import draw from './render'

function main() {
  const canvas: HTMLCanvasElement = document.querySelector("#rustCanvas")
  let context = canvas.getContext("2d")
  draw(context, 800, 800)

}

main()