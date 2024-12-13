import DefaultOptions from './DefaultOptions'
import Base from './modules/BaseModule.js'
import DisplaySize from './modules/DisplaySize'
import Toolbar from './modules/Toolbar'
import Resize from './modules/Resize'
import Keyboard from './modules/Keyboard'

import _Quill from 'quill'
import { randomString } from './Util.js'
const Quill = window.Quill || _Quill
const Parchment = Quill.import('parchment')

/**
 * Custom module for quilljs to allow user to resize elements
 * (Works on Chrome, Edge, Safari and replaces Firefox's native resize behavior)
 * @see https://quilljs.com/blog/building-a-custom-module/
 */
export default class QuillResize {
  static Modules = { Base, DisplaySize, Toolbar, Resize, Keyboard }
  constructor (quill, options = {}) {
    quill.resizer = this
    // save the quill reference and options
    this.quill = quill

    // Apply the options to our defaults, and stash them for later
    // defaultsDeep doesn't do arrays as you'd expect, so we'll need to apply the classes array from options separately
    let moduleClasses = false
    if (options.modules) {
      moduleClasses = options.modules.slice()
    }

    // Apply options to default options
    this.options = Object.assign({}, DefaultOptions, options)

    // (see above about moduleClasses)
    if (moduleClasses !== false) {
      this.options.modules = moduleClasses
    }

    // disable native image resizing on firefox
    document.execCommand('enableObjectResizing', false, 'false')

    // respond to clicks inside the editor
    this.quill.root.addEventListener(
      'mousedown',
      this.handleClick.bind(this),
      false
    )

    this.quill.on('text-change', this.handleChange.bind(this))

    this.quill.emitter.on('resize-edit', this.handleEdit.bind(this))

    this.quill.container.style.position = this.quill.container.style.position || 'relative'

    // add class to selected parchment
    this.selectedBlots = []
    if (this.options.selectedClass) {
      this.quill.on('selection-change', this.addBlotsSelectedClass.bind(this))
    }

    // setup modules
    this.moduleClasses = this.options.modules

    this.modules = []

    // inject keyboard event
    if (this.options.keyboardSelect) {
      Keyboard.injectInit(this.quill)
    }

    // create embed elements style
    if (this.options.embedTags) {
      this.initializeEmbed()
    }
  }

  initializeModules () {
    this.removeModules()

    this.modules = this.moduleClasses.map(
      ModuleClass => new (this.constructor.Modules[ModuleClass] || ModuleClass)(this)
    )

    this.modules.forEach(module => {
      module.onCreate(this)
    })

    this.onUpdate()
  }

  initializeEmbed () {
    if (!this.options.embedTags.length) return
    this.embedClassName = `ql-${randomString()}`
    let cssText = [''].concat(this.options.embedTags).join(`, .${this.embedClassName} `).slice(2)
    cssText += '{pointer-events: none;}'

    const style = document.createElement('style')
    style.textContent = cssText
    this.quill.container.appendChild(style)
    this.quill.root.classList.add(this.embedClassName)
  }

  onUpdate (fromModule) {
    this.updateFromModule = fromModule
    this.repositionElements()
    this.modules.forEach(module => {
      module.onUpdate()
    })
  }

  removeModules () {
    this.modules.forEach(module => {
      module.onDestroy()
    })

    this.modules = []
  }

  handleEdit () {
    if (!this.blot) return
    const index = this.blot.offset(this.quill.scroll)
    this.hide()
    this.quill.focus()
    this.quill.setSelection(index, 1)
  }

  handleClick (evt) {
    let show = false
    let blot
    let target = evt.target

    // 如果是根元素，意味着可能是embed元素事件穿透，需要根据光标位置获取元素
    const embedTags = this.options.embedTags?.join()
    if (embedTags) {
      const root = this.quill.root
      if (target === root || target.querySelectorAll(embedTags).length) {
        root.classList.remove(this.embedClassName)
        target = document.elementFromPoint(evt.clientX, evt.clientY)
        root.classList.add(this.embedClassName)
      }
    }
    if (target && target.tagName) {
      blot = this.quill.constructor.find(target)
      if (blot) {
        show = this.judgeShow(blot, target)
      }
    }
    if (show) {
      evt.preventDefault()
      // evt.stopPropagation()
      return
    }
    if (this.activeEle) {
      // clicked on a non image
      this.hide()
    }
  }

  judgeShow (blot, target) {
    let res = false
    if (!blot) return res

    if (!target && blot.domNode) target = blot.domNode
    const options = this.options.parchment[blot.statics.blotName]
    if (!options) return res
    if (this.activeEle === target) return true

    const limit = options.limit || {}
    if (
      !limit.minWidth ||
      (limit.minWidth && target.offsetWidth >= limit.minWidth)
    ) {
      res = true

      if (this.activeEle) {
        // we were just focused on another image
        this.hide()
      }
      // keep track of this img element
      this.activeEle = target
      this.blot = blot
      // clicked on an image inside the editor
      this.show(target)
    }

    return res
  }

  handleChange (delta, oldDelta, source) {
    if (this.updateFromModule) {
      this.updateFromModule = false
      return
    }

    if (source !== 'user' || !this.overlay || !this.activeEle) return
    this.onUpdate()
  }

  show () {
    this.showOverlay()
    this.initializeModules()
    if (this.options.activeClass) this.activeEle.classList.add(this.options.activeClass)
  }

  showOverlay () {
    if (this.overlay) {
      this.hideOverlay()
    }

    this.quill.setSelection(null)

    // prevent spurious text selection
    this.setUserSelect('none')

    // Create and add the overlay
    this.overlay = document.createElement('div')
    this.overlay.className = 'ql-resize-overlay'
    // this.overlay.setAttribute('title', "Double-click to select image");
    this.overlay.addEventListener('dblclick', this.handleEdit.bind(this), false)

    this.quill.container.appendChild(this.overlay)

    this.hideProxy = evt => {
      if (!this.activeEle) return
      this.hide()
    }
    // listen for the image being deleted or moved
    this.quill.root.addEventListener('input', this.hideProxy, true)

    this.updateOverlayPositionProxy = this.updateOverlayPosition.bind(this)
    this.quill.root.addEventListener('scroll', this.updateOverlayPositionProxy)

    this.repositionElements()
  }

  hideOverlay () {
    if (!this.overlay) {
      return
    }

    // Remove the overlay
    this.quill.container.removeChild(this.overlay)
    this.overlay = undefined

    // stop listening for image deletion or movement
    this.quill.root.removeEventListener('input', this.hideProxy, true)
    this.quill.root.removeEventListener('scroll', this.updateOverlayPositionProxy)

    // reset user-select
    this.setUserSelect('')
  }

  repositionElements () {
    if (!this.overlay || !this.activeEle) {
      return
    }

    // position the overlay over the image
    const parent = this.quill.container
    const eleRect = this.activeEle.getBoundingClientRect()
    const containerRect = parent.getBoundingClientRect()

    Object.assign(this.overlay.style, {
      left: `${eleRect.left - containerRect.left - 1 + parent.scrollLeft}px`,
      top: `${eleRect.top - containerRect.top + this.quill.root.scrollTop}px`,
      width: `${eleRect.width}px`,
      height: `${eleRect.height}px`,
      marginTop: -1 * this.quill.root.scrollTop + 'px'
    })
  }

  updateOverlayPosition () {
    this.overlay.style.marginTop = -1 * this.quill.root.scrollTop + 'px'
  }

  addBlotsSelectedClass (range, oldRange) {
    if (!range) {
      this.removeBlotsSelectedClass()
      this.selectedBlots = []
      return
    }
    const leaves = this.quill.scroll.descendants(Parchment.Leaf || Parchment.LeafBlot, range.index, range.length)
    const blots = leaves.filter(blot => {
      const canBeHandle = !!this.options.parchment[blot.statics.blotName]
      if (canBeHandle) blot.domNode.classList.add(this.options.selectedClass)
      return canBeHandle
    })
    this.removeBlotsSelectedClass(blots)
    this.selectedBlots = blots
  }

  removeBlotsSelectedClass (ignoreBlots = []) {
    if (!Array.isArray(ignoreBlots)) ignoreBlots = [ignoreBlots]

    this.selectedBlots.forEach(blot => {
      if (ignoreBlots.indexOf(blot) === -1) {
        blot.domNode.classList.remove(this.options.selectedClass)
      }
    })
  }

  hide () {
    this.hideOverlay()
    this.removeModules()
    if (this.activeEle && this.options.activeClass) this.activeEle.classList.remove(this.options.activeClass)
    this.activeEle = undefined
    this.blot = undefined
  }

  setUserSelect (value) {
    [
      'userSelect',
      'mozUserSelect',
      'webkitUserSelect',
      'msUserSelect'
    ].forEach(prop => {
      // set on contenteditable element and <html>
      this.quill.root.style[prop] = value
      document.documentElement.style[prop] = value
    })
  }
}

if (window.Quill) {
  window.Quill.register('modules/resize', QuillResize)
}
