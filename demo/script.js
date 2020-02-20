import 'quill/dist/quill.snow.css'
import '../src/assets/resize.css'

import _Quill from 'quill'
const Quill = window.Quill || _Quill

import Resize, {
    EmbedPlaceholder,
    PlaceholderRegister,
    convertPlaceholderHTML
} from '../src/index'

Quill.register('modules/resize', Resize)

class TagPlaceholder extends EmbedPlaceholder {}
// default to ['iframe', 'video']
TagPlaceholder.tagName = ['iframe', 'video', 'embed']
// important!!! must be null or don't set it
// TagPlaceholder.className = null

class ClassPlaceholder extends EmbedPlaceholder {}
ClassPlaceholder.className = 'ql-embed'

PlaceholderRegister([TagPlaceholder, ClassPlaceholder])

const demoEditor = new Quill('#editor', {
    theme: 'snow',
    modules: {
        toolbar: [
            [{ size: [] }],
            [
                'bold',
                'italic',
                'underline',
                'strike',
                { align: [] },
                { color: [] }
            ],
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
    debugger
    $result.value = html
})
document.querySelector('.btn-content').addEventListener('click', function () {
    const result = demoEditor.getContents()
    $result.value = JSON.stringify(result)
})
document.querySelector('.btn-text').addEventListener('click', function () {
    $result.value = demoEditor.getText()
})
