import _Quill from 'quill'
import './assets/resize.css'

import BaseModule from './modules/BaseModule.js'
import Resize from './QuillResize'
import { Image } from './formats/image'
import PlaceholderRegister, {
  EmbedPlaceholder,
  TagPlaceholder,
  ClassNamePlaceholder,
  convertPlaceholderHTML
} from './formats/placeholder'

const Quill = window.Quill || _Quill
Quill.register(Image, true)

export default Resize
export {
  BaseModule,
  Resize,
  Image,
  PlaceholderRegister,
  EmbedPlaceholder,
  TagPlaceholder,
  ClassNamePlaceholder,
  convertPlaceholderHTML
}
