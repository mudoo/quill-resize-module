import BaseModule from './BaseModule'

import IconAlignLeft from 'quill/assets/icons/float-left.svg?raw'
import IconAlignCenter from 'quill/assets/icons/float-center.svg?raw'
import IconAlignRight from 'quill/assets/icons/float-right.svg?raw'
import IconFloatFull from 'quill/assets/icons/float-full.svg?raw'
import IconPencil from '../assets/pencil.svg?raw'

import _Quill from 'quill'
const Quill = window.Quill || _Quill

const Parchment = Quill.import('parchment')

const ALIGNMENT_CLASSES = {
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center',
  FULL: 'full'
}

// Quill.js 2.x support
const ClassAttributor = Parchment.ClassAttributor
  ? Parchment.ClassAttributor
  : Parchment.Attributor.Class

const INLINE_FORMAT_ATTRIBUTOR = 'resize-inline'
const InlineFormatClass = new ClassAttributor(INLINE_FORMAT_ATTRIBUTOR, 'ql-resize-style', {
  scope: Parchment.Scope.INLINE,
  whitelist: Object.values(ALIGNMENT_CLASSES)
})

const BLOCK_FORMAT_ATTRIBUTOR = 'resize-block'
const BlockFormatClass = new ClassAttributor(BLOCK_FORMAT_ATTRIBUTOR, 'ql-resize-style', {
  scope: Parchment.Scope.BLOCK,
  whitelist: Object.values(ALIGNMENT_CLASSES)
})

Quill.register(InlineFormatClass, true)
Quill.register(BlockFormatClass, true)

export default class Toolbar extends BaseModule {
  static Icons = {
    left: IconAlignLeft,
    center: IconAlignCenter,
    right: IconAlignRight,
    full: IconFloatFull,
    edit: IconPencil
  }

  static Tools = {
    left: {
      toolClass: ALIGNMENT_CLASSES.LEFT,
      isApplied (activeEle, blot) {
        return this._getFormatValue(activeEle, blot) === ALIGNMENT_CLASSES.LEFT
      }
    },
    center: {
      toolClass: ALIGNMENT_CLASSES.CENTER,
      isApplied (activeEle, blot) {
        return this._getFormatValue(activeEle, blot) === ALIGNMENT_CLASSES.CENTER
      }
    },
    right: {
      toolClass: ALIGNMENT_CLASSES.RIGHT,
      isApplied (activeEle, blot) {
        return this._getFormatValue(activeEle, blot) === ALIGNMENT_CLASSES.RIGHT
      }
    },
    full: {
      toolClass: ALIGNMENT_CLASSES.FULL,
      isApplied (activeEle, blot) {
        return this._getFormatValue(activeEle, blot) === ALIGNMENT_CLASSES.FULL
      }
    },
    edit: {
      handler (evt, button, activeEle) {
        this.quill.emitter.emit('resize-edit', activeEle, this.blot)
      }
    }
  }

  onCreate () {
    // Setup Toolbar
    this.toolbar = document.createElement('div')
    this.toolbar.className = 'ql-resize-toolbar'
    this.overlay.appendChild(this.toolbar)

    // Setup Buttons
    this._addToolbarButtons()
  }

  _addToolbarButtons () {
    const Icons = this.constructor.Icons
    const Tools = this.constructor.Tools
    const buttons = []
    this.options.tools.forEach((t) => {
      const tool = Tools[t] || t
      if (tool.verify && tool.verify.call(this, this.activeEle, this.blot) === false) return

      const button = document.createElement('button')
      button.type = 'button'
      buttons.push(button)
      button.innerHTML = ((tool.icon || '') + (tool.text || '')) || Icons[t]
      if (typeof t === 'string') button.className = `ql-resize-toolbar-${t}`
      if (tool.attrs) {
        Object.keys(tool.attrs).forEach((key) => {
          button.setAttribute(key, tool.attrs[key])
        })
      }
      button.addEventListener('click', (evt) => {
        if (tool.handler && tool.handler.call(this, evt, button, this.activeEle, this.blot) !== true) return

        // deselect all buttons
        buttons.forEach(button => (button.classList.remove('active')))
        if (tool.isApplied && tool.isApplied.call(this, this.activeEle, this.blot)) {
          // If applied, unapply
          this._applyToolFormatting('')
        } else {
          // otherwise, select button and apply
          button.classList.add('active')

          if (tool.toolClass) {
            this._applyToolFormatting(tool.toolClass)
          }
        }

        // image may change position; redraw drag handles
        this.requestUpdate()
      })

      if (tool.isApplied && tool.isApplied.call(this, this.activeEle, this.blot)) {
        // select button if previously applied
        button.classList.add('active')
      }
      this.toolbar.appendChild(button)
    })
  }

  _getFormatValue (activeEle, blot) {
    if (blot.statics.scope === Parchment.Scope.INLINE_BLOT) {
      // return InlineFormatClass.value(activeEle)
      const blotIndex = this.quill.getIndex(blot)
      const formats = this.quill.getFormat(blotIndex, 1)
      return formats[INLINE_FORMAT_ATTRIBUTOR]
    } else if (blot.statics.scope === Parchment.Scope.BLOCK_BLOT) {
      return BlockFormatClass.value(activeEle)
    }
  }

  _applyToolFormatting (toolClass) {
    const blotIndex = this.quill.getIndex(this.blot)

    if (this.blot.statics.scope === Parchment.Scope.INLINE_BLOT) {
      // Format inline blot
      this.quill.formatText(blotIndex, 1, INLINE_FORMAT_ATTRIBUTOR, toolClass)
    } else if (this.blot.statics.scope === Parchment.Scope.BLOCK_BLOT) {
      // Format block blot
      this.quill.formatLine(blotIndex, 1, BLOCK_FORMAT_ATTRIBUTOR, toolClass)
    }
  }
}
