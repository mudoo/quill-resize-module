import 'quill/dist/quill.snow.css'
import '../src/assets/resize.scss'

import Resize from '../src/index'
import type { QuillResizeOptions } from '../src/DefaultOptions'

import _Quill from 'quill'
const Quill = window.Quill || _Quill

Quill.register('modules/resize', Resize)

// 配置 resize 模块，使用类型注释确保类型安全
const resizeConfig: QuillResizeOptions = {
  // set embed tags to capture resize
  embedTags: ['VIDEO', 'IFRAME'],
  // custom toolbar
  tools: [
    'left', 'center', 'right', 'full', 'edit',
    {
      text: 'Alt',
      attrs: {
        title: 'Set image alt',
        class: 'btn-alt',
      },
      verify (activeEle) {
        return (activeEle && activeEle.tagName === 'IMG')
      },
      handler (evt, button, activeEle) {
        const imgEle = activeEle as HTMLImageElement
        const alt = imgEle.alt || ''
        const newAlt = window.prompt('Alt for image', alt)
        if (newAlt == null) return
        imgEle.setAttribute('alt', newAlt)
      },
    },
  ],

  // Triggered when an element is activated (selected)
  onActive: function (blot, target) {
    console.log('Element activated:', this.quill, blot, target)
  },

  // Triggered when an element loses active state
  onInactive: function (blot, target) {
    console.log('Element deactivated:', this.quill, blot, target)
  },

  // Triggered when element size changed
  onChangeSize: function (blot, target, size) {
    console.log('Size changed:', this.quill, blot, target, size)
  },
}

const demoEditor = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', { align: [] }, { color: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
    resize: resizeConfig,
  },
})

const $result = document.querySelector('#result') as HTMLTextAreaElement
$result.value = `Quill V${Quill.version}\nResize Module V${Resize.version}\n`
document.querySelector('.btn-html')!.addEventListener('click', function () {
  $result.value = demoEditor.root.innerHTML
})
document.querySelector('.btn-content')!.addEventListener('click', function () {
  const result = demoEditor.getContents()
  $result.value = JSON.stringify(result)
})
document.querySelector('.btn-text')!.addEventListener('click', function () {
  $result.value = demoEditor.getText()
})
document.querySelector('.btn-set-html')!.addEventListener('click', function () {
  const contents = demoEditor.clipboard.convert({
    html: `${$result.value}<p><br></p>`,
    text: '\n',
  })
  demoEditor.setContents(contents)
})
document.querySelector('.btn-set-content')!.addEventListener('click', function () {
  demoEditor.setContents(JSON.parse($result.value))
})
document.querySelector('.btn-undo')!.addEventListener('click', function () {
  demoEditor.history.undo()
})
document.querySelector('.btn-redo')!.addEventListener('click', function () {
  demoEditor.history.redo()
})
