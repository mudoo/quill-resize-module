import 'quill/dist/quill.snow.css'
import '../src/assets/resize.scss'

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
      embedTags: ['VIDEO', 'IFRAME'],
      // custom toolbar
      tools: [
        'left', 'center', 'right', 'full', 'edit',
        {
          text: 'Alt',
          attrs: {
            title: 'Set image alt',
            class: 'btn-alt'
          },
          verify (activeEle) {
            return (activeEle && activeEle.tagName === 'IMG')
          },
          handler (evt, button, activeEle) {
            let alt = activeEle.alt || ''
            alt = window.prompt('Alt for image', alt)
            if (alt == null) return
            activeEle.setAttribute('alt', alt)
          }
        }
      ]
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
document.querySelector('.btn-set-html').addEventListener('click', function () {
  const contents = demoEditor.clipboard.convert({
    html: `${$result.value}<p><br></p>`,
    text: '\n'
  })
  demoEditor.setContents(contents)
})
document.querySelector('.btn-set-content').addEventListener('click', function () {
  demoEditor.setContents(JSON.parse($result.value))
})
document.querySelector('.btn-undo').addEventListener('click', function () {
  demoEditor.history.undo()
})
document.querySelector('.btn-redo').addEventListener('click', function () {
  demoEditor.history.redo()
})
