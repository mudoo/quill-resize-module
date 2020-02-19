import 'quill/dist/quill.snow.css';
import '../src/assets/resize.css';

import _Quill from 'quill';
const Quill = window.Quill || _Quill;

import Resize from '../src/index';
import PlaceholderRegister, { EmbedPlaceholder } from '../src/formats/placeholder'

Quill.register('modules/resize', Resize);

class TagPlaceholder extends EmbedPlaceholder { }
// default to ['iframe', 'video']
TagPlaceholder.tagName = ['iframe', 'video', 'embed']
// important!!! must be null or don't set it
// TagPlaceholder.className = null

class ClassPlaceholder extends EmbedPlaceholder { }
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
});

document.querySelector('.btn-save').addEventListener('click', function () {
    const result = demoEditor.getText();
    document.querySelector('#result').value = result
})
