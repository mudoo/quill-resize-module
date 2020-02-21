import 'quill/dist/quill.snow.css'
import '../src/assets/resize.css'

import Resize, {
  EmbedPlaceholder,
  PlaceholderRegister,
  convertPlaceholderHTML
} from '../src/index'

import _Quill from 'quill'
const Quill = window.Quill || _Quill

Quill.register('modules/resize', Resize)

class TagPlaceholder extends EmbedPlaceholder {}
// default to ['iframe', 'video']
TagPlaceholder.tagName = ['iframe', 'embed']
// important!!! must be null or don't set it
// TagPlaceholder.className = null

// replace default video blot
class VideoPlaceholder extends EmbedPlaceholder {
  static create (value) {
    let video = value
    if (typeof value === 'string') {
      video = {
        'data-embed-source': encodeURIComponent(
          `<video src="${value}" controls preload="auto"></video>`
        ),
        'data-type': 'video',
        'data-src': value
      }
    }
    return super.create(video)
  }
}
VideoPlaceholder.blotName = 'video'
VideoPlaceholder.tagName = 'video'

class ClassPlaceholder extends EmbedPlaceholder {}
ClassPlaceholder.className = 'ql-embed'

PlaceholderRegister([TagPlaceholder, VideoPlaceholder, ClassPlaceholder])

const demoEditor = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', { align: [] }, { color: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
    resize: {}
  }
})

const $result = document.querySelector('#result')
document.querySelector('.btn-html').addEventListener('click', function () {
  const html = convertPlaceholderHTML(demoEditor.root.innerHTML)
  $result.value = html
})
document.querySelector('.btn-content').addEventListener('click', function () {
  const result = demoEditor.getContents()
  $result.value = JSON.stringify(result)
})
document.querySelector('.btn-text').addEventListener('click', function () {
  $result.value = demoEditor.getText()
})
document.querySelector('.btn-undo').addEventListener('click', function () {
  demoEditor.history.undo()
})
document.querySelector('.btn-redo').addEventListener('click', function () {
  demoEditor.history.redo()
})
