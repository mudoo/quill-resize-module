import 'quill/dist/quill.snow.css';
import '../src/assets/resize.css';

import _Quill from 'quill';
const Quill = window.Quill || _Quill;

import Resize from '../src/index';
import PlaceholderRegister from '../src/formats/placeholder'

Quill.register('modules/resize', Resize);
PlaceholderRegister();

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

document.querySelector('.btn-save').addEventListener('click', function (e) {
    const result = demoEditor.getText();
    document.querySelector('#result').value = result
})
