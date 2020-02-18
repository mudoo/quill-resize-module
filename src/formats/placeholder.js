import _Quill from 'quill';
const Quill = window.Quill || _Quill;

const Container = Quill.import('blots/container');
const Scroll = Quill.import('blots/scroll');

const ATTRIBUTES = ['data-embed-source', 'data-size', 'style'];
const Embed = Quill.import('blots/block/embed');

class EmbedPlaceholder extends Embed {
    static create(value) {
        let node = super.create();
        if (typeof value === 'string') {
            node.setAttribute(ATTRIBUTES[0], value);
        }
        node.setAttribute('contenteditable', false);
        node.setAttribute('unselectable', 'on');
        node.setAttribute('title', node.textContent);
        return node;
    }

    static formats(domNode) {
        return ATTRIBUTES.reduce(function(formats, attribute) {
            if (domNode.hasAttribute(attribute)) {
                formats[attribute] = domNode.getAttribute(attribute);
            }
            return formats;
        }, {});
    }

    static value(domNode) {
        if (domNode.hasAttribute(ATTRIBUTES[0])) {
            return domNode.getAttribute(ATTRIBUTES[0]);
        } else {
            return encodeURIComponent(domNode.outerHTML);
        }
    }

    format(name, value) {
        debugger
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
EmbedPlaceholder.blotName = 'embed-placeholder';
EmbedPlaceholder.tagName = 'div';

Container.allowedChildren.push(EmbedPlaceholder);
Scroll.allowedChildren.push(EmbedPlaceholder);

class TagPlaceholder extends EmbedPlaceholder { }
TagPlaceholder.tagName = ['video', 'iframe']

class ClassNamePlaceholder extends EmbedPlaceholder { }
ClassNamePlaceholder.className = 'ql-embed-placeholder'

export default function register () {
    Quill.register(TagPlaceholder, true)
    Quill.register(ClassNamePlaceholder, true)
}

export { EmbedPlaceholder, TagPlaceholder, ClassNamePlaceholder, ATTRIBUTES }
