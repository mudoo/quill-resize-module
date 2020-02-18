import extend from 'extend';
import DefaultOptions from './DefaultOptions';
import { DisplaySize } from './modules/DisplaySize';
import { Toolbar } from './modules/Toolbar';
import { Resize } from './modules/Resize';

import './assets/resize.css';

const knownModules = { DisplaySize, Toolbar, Resize };

/**
 * Custom module for quilljs to allow user to resize elements
 * (Works on Chrome, Edge, Safari and replaces Firefox's native resize behavior)
 * @see https://quilljs.com/blog/building-a-custom-module/
 */
export default class QuillResize {
    constructor(quill, options = {}) {
        // save the quill reference and options
        this.quill = quill;

        // Apply the options to our defaults, and stash them for later
        // defaultsDeep doesn't do arrays as you'd expect, so we'll need to apply the classes array from options separately
        let moduleClasses = false;
        if (options.modules) {
            moduleClasses = options.modules.slice();
        }

        // Apply options to default options
        this.options = extend({}, DefaultOptions, options);

        // (see above about moduleClasses)
        if (moduleClasses !== false) {
            this.options.modules = moduleClasses;
        }

        // disable native image resizing on firefox
        document.execCommand('enableObjectResizing', false, 'false');

        // respond to clicks inside the editor
        this.quill.root.addEventListener(
            'click',
            this.handleClick.bind(this),
            false
        );

        this.quill.emitter.on('resize-edit', this.handleEdit.bind(this));

        this.quill.root.parentNode.style.position =
            this.quill.root.parentNode.style.position || 'relative';

        // setup modules
        this.moduleClasses = this.options.modules;

        this.modules = [];
    }

    initializeModules() {
        this.removeModules();

        this.modules = this.moduleClasses.map(
            ModuleClass => new (knownModules[ModuleClass] || ModuleClass)(this)
        );

        this.modules.forEach(module => {
            module.onCreate();
        });

        this.onUpdate();
    }

    onUpdate() {
        this.repositionElements();
        this.modules.forEach(module => {
            module.onUpdate();
        });
    }

    removeModules() {
        this.modules.forEach(module => {
            module.onDestroy();
        });

        this.modules = [];
    }

    handleEdit() {
        if (!this.blot) return;
        const index = this.blot.offset(this.quill.scroll);
        this.hide();
        this.quill.focus();
        this.quill.setSelection(index - 1, 1);
    }

    handleClick(evt) {
        let show = false;
        let blot;
        const target = evt.target;

        if (target && target.tagName) {
            blot = this.quill.constructor.find(target);
            if (blot) {
                const options = this.options.parchment[blot.statics.blotName];
                if (options) {
                    const limit = options.limit || {};
                    if (
                        !limit.minWidth ||
                        (limit.minWidth && target.offsetWidth >= limit.minWidth)
                    )
                        show = true;
                }
            }
        }
        if (show) {
            if (target.closest('a')) {
                evt.preventDefault();
            }
            if (this.activeEle === target) {
                // we are already focused on this image
                return;
            }
            if (this.activeEle) {
                // we were just focused on another image
                this.hide();
            }
            // keep track of this img element
            this.activeEle = target;
            this.blot = blot;
            // clicked on an image inside the editor
            this.show(target);
        } else if (this.activeEle) {
            // clicked on a non image
            this.hide();
        }
    }

    show(ele) {
        if (!ele.getAttribute('data-size')) {
            ele.setAttribute(
                'data-size',
                ele.offsetWidth + ',' + ele.offsetHeight
            );
        }

        this.showOverlay();

        this.initializeModules();
    }

    showOverlay() {
        if (this.overlay) {
            this.hideOverlay();
        }

        this.quill.setSelection(null);

        // prevent spurious text selection
        this.setUserSelect('none');

        // Create and add the overlay
        this.overlay = document.createElement('div');
        // this.overlay.setAttribute('title', "Double-click to select image");
        Object.assign(this.overlay.style, this.options.overlayStyles);
        this.overlay.addEventListener(
            'dblclick',
            this.handleEdit.bind(this),
            false
        );

        this.quill.root.parentNode.appendChild(this.overlay);

        this.checkImageProxy = evt => this.checkImage(evt);
        // listen for the image being deleted or moved
        document.addEventListener('keyup', this.checkImageProxy, true);
        this.quill.root.addEventListener('input', this.checkImageProxy, true);

        this.updateOverlayPositionProxy = this.updateOverlayPosition.bind(this);
        this.quill.root.addEventListener(
            'scroll',
            this.updateOverlayPositionProxy
        );

        this.repositionElements();
    }

    hideOverlay() {
        if (!this.overlay) {
            return;
        }

        // Remove the overlay
        this.quill.root.parentNode.removeChild(this.overlay);
        this.overlay = undefined;

        // stop listening for image deletion or movement
        document.removeEventListener('keyup', this.checkImageProxy);
        this.quill.root.removeEventListener('input', this.checkImageProxy);
        this.quill.root.removeEventListener(
            'scroll',
            this.updateOverlayPositionProxy
        );

        // reset user-select
        this.setUserSelect('');
    }

    repositionElements() {
        if (!this.overlay || !this.activeEle) {
            return;
        }

        // position the overlay over the image
        const parent = this.quill.root.parentNode;
        const eleRect = this.activeEle.getBoundingClientRect();
        const containerRect = parent.getBoundingClientRect();

        Object.assign(this.overlay.style, {
            left: `${eleRect.left -
                containerRect.left -
                1 +
                parent.scrollLeft}px`,
            top: `${eleRect.top -
                containerRect.top +
                this.quill.root.scrollTop}px`,
            width: `${eleRect.width}px`,
            height: `${eleRect.height}px`,
            marginTop: -1 * this.quill.root.scrollTop + 'px'
        });
    }

    updateOverlayPosition() {
        this.overlay.style.marginTop = -1 * this.quill.root.scrollTop + 'px';
    }

    hide() {
        this.hideOverlay();
        this.removeModules();
        this.activeEle = undefined;
        this.blot = undefined;
    }

    setUserSelect(value) {
        [
            'userSelect',
            'mozUserSelect',
            'webkitUserSelect',
            'msUserSelect'
        ].forEach(prop => {
            // set on contenteditable element and <html>
            this.quill.root.style[prop] = value;
            document.documentElement.style[prop] = value;
        });
    }

    checkImage(evt) {
        if (this.activeEle) {
            if (evt.keyCode == 46 || evt.keyCode == 8) {
                this.quill.constructor.find(this.activeEle).deleteAt(0);
            }
            this.hide();
        }
    }
}

if (window.Quill) {
    window.Quill.register('modules/resize', QuillResize);
}

// Polyfill for IE and Element.closest
if (!Element.prototype.matches)
    Element.prototype.matches =
        Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;

if (!Element.prototype.closest)
    Element.prototype.closest = function(s) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
