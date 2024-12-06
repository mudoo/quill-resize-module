import 'quill/dist/quill.snow.css'
import '../src/assets/resize.css'

import Resize from '../src/index'

import _Quill from 'quill'
const Quill = window.Quill || _Quill

Quill.register('modules/resize', Resize)

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
    resize: {
      // set embed tags to capture resize
      embedTags: ['VIDEO', 'IFRAME']
    }
  }
})

const $result = document.querySelector('#result')
$result.value = `Quill V${Quill.version}`
document.querySelector('.btn-html').addEventListener('click', function () {
  $result.value = demoEditor.root.innerHTML
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
