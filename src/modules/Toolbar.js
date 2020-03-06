import BaseModule from './BaseModule'

import IconAlignLeft from 'quill/assets/icons/float-left.svg'
import IconAlignCenter from 'quill/assets/icons/float-center.svg'
import IconAlignRight from 'quill/assets/icons/float-right.svg'
import IconFloatFull from 'quill/assets/icons/float-full.svg'
import IconPencil from '../assets/pencil.svg'

import _Quill from 'quill'
const Quill = window.Quill || _Quill

const Parchment = Quill.import('parchment')

// Quill.js 2.x support
const ClassAttributor = Parchment.ClassAttributor
  ? Parchment.ClassAttributor
  : Parchment.Attributor.Class
const ImageFormatClass = new ClassAttributor('imagestyle', 'ql-resize-style')

export default class Toolbar extends BaseModule {
  onCreate () {
    // Setup Toolbar
    this.toolbar = document.createElement('div')
    Object.assign(this.toolbar.style, this.options.styles.toolbar)
    this.overlay.appendChild(this.toolbar)

    // Setup Buttons
    this._defineAlignments()
    this._addToolbarButtons()
  }

  _defineAlignments () {
    this.alignments = [
      {
        icon: IconAlignLeft,
        apply: () => {
          ImageFormatClass.add(this.activeEle, 'left')
        },
        isApplied: () => ImageFormatClass.value(this.activeEle) === 'left'
      },
      {
        icon: IconAlignCenter,
        apply: () => {
          ImageFormatClass.add(this.activeEle, 'center')
        },
        isApplied: () => ImageFormatClass.value(this.activeEle) === 'center'
      },
      {
        icon: IconAlignRight,
        apply: () => {
          ImageFormatClass.add(this.activeEle, 'right')
        },
        isApplied: () => ImageFormatClass.value(this.activeEle) === 'right'
      },
      {
        icon: IconFloatFull,
        apply: () => {
          ImageFormatClass.add(this.activeEle, 'full')
        },
        isApplied: () => ImageFormatClass.value(this.activeEle) === 'full'
      }
    ]
  }

  _addToolbarButtons () {
    const buttons = []
    this.alignments.forEach((alignment, idx) => {
      const button = document.createElement('span')
      buttons.push(button)
      button.innerHTML = alignment.icon
      button.addEventListener('click', () => {
        // deselect all buttons
        buttons.forEach(button => (button.style.filter = ''))
        if (alignment.isApplied()) {
          // If applied, unapply
          ImageFormatClass.remove(this.activeEle)
        } else {
          // otherwise, select button and apply
          this._selectButton(button)
          alignment.apply()
        }
        // image may change position; redraw drag handles
        this.requestUpdate()
      })
      Object.assign(button.style, this.options.styles.toolbarButton)
      if (idx > 0) {
        button.style.borderLeftWidth = '0'
      }
      Object.assign(
        button.children[0].style,
        this.options.styles.toolbarButtonSvg
      )
      if (alignment.isApplied()) {
        // select button if previously applied
        this._selectButton(button)
      }
      this.toolbar.appendChild(button)
    })

    // Edit button
    const button = document.createElement('span')
    button.innerHTML = IconPencil
    Object.assign(button.style, this.options.styles.toolbarButton)
    button.style.borderLeftWidth = '0'
    button.addEventListener('click', () => {
      this.quill.emitter.emit('resize-edit', this.activeEle, this.blot)
    })
    this.toolbar.appendChild(button)
  }

  _selectButton (button) {
    button.style.filter = 'invert(20%)'
  }
}
