import IconAlignLeft from 'quill/assets/icons/float-left.svg';
import IconAlignCenter from 'quill/assets/icons/float-center.svg';
import IconAlignRight from 'quill/assets/icons/float-right.svg';
import IconFloatFull from 'quill/assets/icons/float-full.svg';
import * as Quill from 'quill';
import { BaseModule } from './BaseModule';

const Parchment = window.Quill ? window.Quill.imports.parchment : Quill.imports.parchment;
const FloatStyle = new Parchment.Attributor.Style('float', 'float');
const MarginStyle = new Parchment.Attributor.Style('margin', 'margin');
const DisplayStyle = new Parchment.Attributor.Style('display', 'display');
const WidthStyle = new Parchment.Attributor.Style('width', 'width');

const FloatClass = new Parchment.Attributor.Class('float', 'float', {
    scope: Parchment.Scope.INLINE,
    className: 'float'
});

const FullWidth = new Parchment.Attributor.Class('fullwidth', 'full-width', {
    scope: Parchment.Scope.INLINE,
    className: 'full-width'
});

export class Toolbar extends BaseModule {
    onCreate = () => {
		// Setup Toolbar
        this.toolbar = document.createElement('div');
        Object.assign(this.toolbar.style, this.options.toolbarStyles);
        this.overlay.appendChild(this.toolbar);

        // Setup Buttons
        this._defineAlignments();
        this._addToolbarButtons();
    };

	// The toolbar and its children will be destroyed when the overlay is removed
    onDestroy = () => {};

	// Nothing to update on drag because we are are positioned relative to the overlay
    onUpdate = () => {};

    _defineAlignments = () => {
        this.alignments = [
            {
                icon: IconAlignLeft,
                apply: () => {
                    DisplayStyle.add(this.img, 'inline');
                    FloatStyle.add(this.img, 'left');
                    MarginStyle.add(this.img, '0 1em 1em 0');
                    FloatClass.add(this.img, 'left');
                },
                isApplied: () => FloatClass.value(this.img) == 'left',
            },
            {
                icon: IconAlignCenter,
                apply: () => {
                    DisplayStyle.add(this.img, 'block');
                    FloatStyle.remove(this.img);
                    MarginStyle.add(this.img, 'auto');
                    FloatClass.remove(this.img);
                },
                isApplied: () => MarginStyle.value(this.img) == 'auto',
            },
            {
                icon: IconAlignRight,
                apply: () => {
                    DisplayStyle.add(this.img, 'inline');
                    FloatStyle.add(this.img, 'right');
                    MarginStyle.add(this.img, '0 0 1em 1em');
                    FloatClass.add(this.img, 'right');
                },
                isApplied: () => FloatStyle.value(this.img) == 'right',
            },
            {
                icon: IconFloatFull,
                apply: () => {
                    FullWidth.add(this.img, 'on');
                },
                isApplied: () => FullWidth.value(this.img) == 'on',
            }
        ];
    };

    _addToolbarButtons = () => {
		const buttons = [];
		this.alignments.forEach((alignment, idx) => {
			const button = document.createElement('span');
			buttons.push(button);
			button.innerHTML = alignment.icon;
			button.addEventListener('click', () => {
					// deselect all buttons
				buttons.forEach(button => button.style.filter = '');
				if (alignment.isApplied()) {
						// If applied, unapply
					FloatStyle.remove(this.img);
					MarginStyle.remove(this.img);
					DisplayStyle.remove(this.img);
				}				else {
						// otherwise, select button and apply
					this._selectButton(button);
					alignment.apply();
				}
					// image may change position; redraw drag handles
				this.requestUpdate();
			});
			Object.assign(button.style, this.options.toolbarButtonStyles);
			if (idx > 0) {
				button.style.borderLeftWidth = '0';
			}
			Object.assign(button.children[0].style, this.options.toolbarButtonSvgStyles);
			if (alignment.isApplied()) {
					// select button if previously applied
				this._selectButton(button);
			}
			this.toolbar.appendChild(button);
		});
    };

    _selectButton = (button) => {
		button.style.filter = 'invert(20%)';
    };

}
