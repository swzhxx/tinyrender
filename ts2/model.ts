import { OBJ } from 'webgl-obj-loader'
import { TGAColor, TGAImage } from './utils/TGAImage'
import vec2, { Vec2 } from './utils/vec2'
import vec3, { Vec3 } from './utils/vec3'

import diffucsetga from './assets/african_head_diffuse.tga'
import nmtga from './assets/african_head_nm.tga'
import spectga from './assets/african_head_spec.tga'
import TgaLoader from 'tga-js'
import { Buffer } from 'buffer'



function _base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64)
  var len = binary_string.length
  var bytes = new Uint8Array(len)
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i)
  }
  return Buffer.from(bytes)
}

class Model {
  public verts: Array<Vec3>
  public faces: Array<Array<Vec3>>
  public uv: Array<Vec2>
  public normals: Array<Vec3>
  public diffusemap: TGAImage
  public normalmap: TGAImage
  public specularmap: TGAImage
  public mesh: any
  public facesIndex: Array<any>
  constructor(objstr: string) {
    this.verts = []
    this.faces = []
    const mesh = new OBJ.Mesh(objstr)
    this.mesh = mesh
    this.uv = mesh.textures.reduce((prev, ver, index) => {
      let temp
      if (index % 2 === 0) {
        temp = []
        prev.push(temp)
      } else {
        temp = prev[prev.length - 1]
      }
      temp.push(ver)

      return prev
    }, []).reduce((prev, vers) => {
      let vertex = vec2(vers[0], vers[1])
      prev.push(vertex)
      return prev
    }, [])
    this.verts = mesh.vertices.reduce((prev, ver, index) => {
      let temp
      if (index % 3 === 0) {
        temp = []
        prev.push(temp)
      } else {
        temp = prev[prev.length - 1]
      }
      temp.push(ver)
      return prev
    }, []).reduce((prev, vers, index) => {
      let vertex = vec3(vers[0], vers[1], vers[2])

      prev.push(vertex)
      return prev
    }, [])
    let i = 0

    let temp = []
    while (i < mesh.indices.length) {
      let index = mesh.indices[i]
      let vert = this.verts[index]
      temp.push(vert)
      if (temp.length == 3) {
        this.faces.push(temp)
        temp = []
      }
      i++
    }


    let _tga = this.loadTexture(diffucsetga)
    this.diffusemap = new TGAImage(_tga.width, _tga.height, [255, 255, 255, 255])
    this.diffusemap.data = [..._tga.pixels]
    this.diffusemap.flipVertically()

    _tga = this.loadTexture(nmtga)
    this.normalmap = new TGAImage(_tga.width, _tga.height, [255, 255, 255, 255])
    this.normalmap.data = [..._tga.pixels]
    this.normalmap.flipVertically()


    _tga = this.loadTexture(spectga)
    this.specularmap = new TGAImage(_tga.width, _tga.height, [255, 255, 255, 255])
    this.specularmap.data = [..._tga.pixels]
    this.specularmap.flipVertically()
  }


  nverts(): number {
    return this.verts.length
  }

  nfaces(): number {
    return this.faces.length
  }

  getVert(i: number): Vec3 {
    return this.verts[i]
  }

  getVertFace(iface: number, ivert: number): Vec3 {
    return this.faces[iface][ivert]
  }

  loadTexture(str: string) {
    const tgaloader = new TgaLoader()
    tgaloader.load(_base64ToArrayBuffer(str.split(",")[1]))

    return {
      width: tgaloader.header.width,
      height: tgaloader.header.height,
      pixels: tgaloader.getImageData().data
    }
  }

  diffuse(uvf: Vec2): TGAColor {
    let uv = vec2(uvf.x * this.diffusemap.width, uvf.y * this.diffusemap.height)
    return this.diffusemap.get(uv.x, uv.y)
  }

  normal(uvf: Vec2): Vec3 {
    let uv: Vec2 = vec2(uvf.x * this.normalmap.width, uvf.y * this.normalmap.height)
    let c: TGAColor = this.normalmap.get(uv.x, uv.y)
    let temp = []
    temp[0] = c[0] / 255 * 2 - 1
    temp[1] = c[1] / 255 * 2 - 1
    temp[2] = c[2] / 255 * 2 - 1
    return vec3(temp[0], temp[1], temp[2])
  }

  specular(uvf: Vec2): number {
    let uv = vec2(uvf.x * this.specularmap.width, uvf.y * this.specularmap.height)
    return this.specularmap.get(uv.x, uv.y)[0] / 1
  }

  normalVector(iface: number, ivert: number) {

  }

  getUv(iface: number, ivert: number): Vec2 {
    return this.uv[this.mesh.indices[iface * 3 + ivert]]
  }


}

export default Model