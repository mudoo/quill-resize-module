import _Quill from 'quill'
import './assets/resize.css'

import Resize from './QuillResize'
import { Image } from './formats/image'
import PlaceholderRegister from './formats/placeholder'

const Quill = window.Quill || _Quill
Quill.register(Image, true)

export {
  EmbedPlaceholder,
  TagPlaceholder,
  ClassNamePlaceholder,
  convertPlaceholderHTML
} from './formats/placeholder'

export default Resize
export { Resize, Image, PlaceholderRegister }

// Polyfill for IE and Element.closest
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this
    if (!document.documentElement.contains(el)) return null
    do {
      if (el.matches(s)) return el
      el = el.parentElement || el.parentNode
    } while (el !== null && el.nodeType === 1)
    return null
  }
}
