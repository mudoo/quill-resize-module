import BaseModule from './BaseModule'

import _Quill from 'quill'
const Quill = window.Quill || _Quill

const Parchment = Quill.import('parchment')

const keyCodes = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  DELETE: 46
}

export default class Keyboard extends BaseModule {
  static injectInit (quill) {
    // left/right
    const bindings = quill.keyboard.bindings
    bindings[this.keys.LEFT].unshift(
      this.makeArrowHandler(this.keys.LEFT, false)
    )
    bindings[this.keys.RIGHT].unshift(
      this.makeArrowHandler(this.keys.RIGHT, false)
    )
  }

  static makeArrowHandler (key, shiftKey) {
    const where = key === Keyboard.keys.LEFT ? 'prefix' : 'suffix'
    return {
      key,
      shiftKey,
      altKey: null,
      [where]: /^$/,
      handler: function (range) {
        if (!this.quill.resizer) return true

        let index = range.index
        const isLeft = key === Keyboard.keys.LEFT
        const isRight = key === Keyboard.keys.RIGHT

        // check end of line
        const [line] = this.quill.getLine(index + (isLeft ? -1 : 0))
        if (this.quill.resizer.judgeShow(line)) return false
        const lineIndex = this.quill.getIndex(line)

        if (isRight && lineIndex + line.length() - 1 === index) return true

        // get leaf/offset
        if (isRight) {
          index += (range.length + 1)
        }
        let [leaf] = this.quill.getLeaf(index)
        const offset = leaf.offset(leaf.parent)
        const isBlock = leaf.constructor.scope === Parchment.Scope.BLOCK_BLOT

        // check start of line
        if (isLeft && ((isBlock && index === offset) || (index === 0 || index === lineIndex))) return true

        // get previous leaf
        if (isLeft) {
          if (offset === 0) {
            index -= 1
            leaf = this.quill.getLeaf(index)[0]
          }
        }

        return !this.quill.resizer.judgeShow(leaf)
      }
    }
  }

  onCreate (e) {
    this.keyboardProxy = evt => this.keyboardHandle(evt)
    document.addEventListener('keydown', this.keyboardProxy, true)
  }

  onDestroy () {
    document.removeEventListener('keydown', this.keyboardProxy, true)
  }

  keyboardHandle (evt) {
    if (evt.defaultPrevented) return
    if (evt.shiftKey || evt.ctrlKey || evt.altKey) {
      return
    }
    if (!this.activeEle || evt.fromResize || evt.ctrlKey) return

    const code = evt.keyCode
    let index = this.blot.offset(this.quill.scroll)
    let nextBlot
    let handled = false

    // delete
    if (code === keyCodes.BACKSPACE || code === keyCodes.DELETE) {
      this.blot.deleteAt(0)
      this.blot.parent.optimize()
      handled = true

    // direction key
    } else if (code >= keyCodes.LEFT && code <= keyCodes.DOWN) {
      if (code === keyCodes.RIGHT) {
        index += this.blot.length() || 1
      } else if (code === keyCodes.UP) {
        index = this.getOtherLineIndex(-1)
        nextBlot = this.quill.getLeaf(index)[0]
      } else if (code === keyCodes.DOWN) {
        index = this.getOtherLineIndex(1)
        nextBlot = this.quill.getLeaf(index)[0]
      }
      handled = true
    }

    if (handled) {
      evt.stopPropagation()
      evt.preventDefault()
    }

    if (nextBlot && this.resizer.judgeShow(nextBlot, nextBlot.domNode)) return

    this.quill.setSelection(index)
    this.resizer.hide()
  }

  getOtherLineIndex (dir) {
    let index = this.blot.offset(this.quill.scroll)
    const [line] = this.quill.getLine(index)
    const lineIndex = this.blot.offset(line) + 1

    const otherLine = dir > 0 ? line.next : line.prev

    if (otherLine) {
      let len = otherLine.length()
      if (otherLine.statics.blotName === 'block') len--
      index = otherLine.offset(this.quill.scroll) + Math.min(len, lineIndex)
    }

    return index
  }

  // 转发event到quill
  dispatchEvent (evt) {
    const event = new evt.constructor(evt)
    event.fromResize = true
    this.quill.root.dispatchEvent(event)
  }
}

if (/^2\./.test(Quill.version)) {
  Keyboard.keys = {
    BACKSPACE: 'Backspace',
    TAB: 'Tab',
    ENTER: 'Enter',
    ESCAPE: 'Escape',
    LEFT: 'ArrowLeft',
    UP: 'ArrowUp',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    DELETE: 'Delete'
  }
} else {
  Keyboard.keys = keyCodes
}
