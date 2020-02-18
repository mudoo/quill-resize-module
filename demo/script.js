import 'quill/dist/quill.snow.css';

import _Quill from 'quill';
const Quill = window.Quill || _Quill;

import Resize from '../src/index';
Quill.register('modules/resize', Resize);

const editorDemo = new Quill('#editor', {
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
