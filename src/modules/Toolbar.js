import IconAlignLeft from 'quill/assets/icons/float-left.svg';
import IconAlignCenter from 'quill/assets/icons/float-center.svg';
import IconAlignRight from 'quill/assets/icons/float-right.svg';
import IconFloatFull from 'quill/assets/icons/float-full.svg';
import * as Quill from 'quill';
import { BaseModule } from './BaseModule';

const Parchment = window.Quill ? window.Quill.imports.parchment : Quill.imports.parchment;

const MarginClass = new Parchment.Attributor.Class('margin', 'margin', {
    scope: Parchment.Scope.INLINE,
    className: 'margin'
});

const FloatClass = new Parchment.Attributor.Class('float', 'float', {
    scope: Parchment.Scope.INLINE,
    className: 'float'
});

const FullWidthClass = new Parchment.Attributor.Class('fullwidth', 'full', {
    scope: Parchment.Scope.INLINE,
    className: 'full'
});

const DisplayClass = new Parchment.Attributor.Class('display', 'display', {
    scope: Parchment.Scope.INLINE,
    className: 'display'
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
                    DisplayClass.add(this.img, 'inline');
                    FloatClass.add(this.img, 'left');
                },
                isApplied: () => FloatClass.value(this.img) == 'left',
            },
            {
                icon: IconAlignCenter,
                apply: () => {
                    DisplayClass.add(this.img, 'block');
                    MarginClass.add(this.img, 'auto');
                    FloatClass.remove(this.img);
                },
                isApplied: () => MarginClass.value(this.img) == 'auto',
            },
            {
                icon: IconAlignRight,
                apply: () => {
                    DisplayClass.add(this.img, 'inline');
                    FloatClass.add(this.img, 'right');
                },
                isApplied: () => FloatClass.value(this.img) == 'right',
            },
            {
                icon: IconFloatFull,
                apply: () => {
                    FullWidthClass.add(this.img, 'width');
                },
                isApplied: () => FullWidthClass.value(this.img) == 'width',
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
					MarginClass.remove(this.img);
                    DisplayClass.remove(this.img);
                    FullWidthClass.remove(this.img);
                    FloatClass.remove(this.img);
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
