import _Quill from 'quill';
const Quill = window.Quill || _Quill;

//BEGIN allow image alignment styles
const ATTRIBUTES = ['alt', 'height', 'width', 'style', 'data-size'];

var BaseImageFormat = Quill.import('formats/image');
class Image extends BaseImageFormat {
    static formats(domNode) {
        return ATTRIBUTES.reduce(function(formats, attribute) {
            if (domNode.hasAttribute(attribute)) {
                formats[attribute] = domNode.getAttribute(attribute);
            }
            return formats;
        }, {});
    }
    format(name, value) {
        if (ATTRIBUTES.indexOf(name) > -1) {
            if (value) {
                this.domNode.setAttribute(name, value);
            } else {
                this.domNode.removeAttribute(name);
            }
        } else {
            super.format(name, value);
        }
    }
}

export { Image, ATTRIBUTES }
