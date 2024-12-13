import BaseModule from './BaseModule'

export default class Resize extends BaseModule {
  onCreate () {
    this.blotOptions = this.options.parchment[this.blot.statics.blotName]
    // track resize handles
    this.boxes = []

    // add 4 resize handles
    this.addBox('tl') // top left
    this.addBox('tr') // top right
    this.addBox('br') // bottom right
    this.addBox('bl') // bottom left
  }

  onDestroy () {
    // reset drag handle cursors
    this.setCursor('')
  }

  addBox (place) {
    // create div element for resize handle
    const box = document.createElement('div')
    box.className = `ql-resize-handle ${place}`

    // listen for mousedown on each box
    box.addEventListener('mousedown', this.handleMousedown.bind(this), false)
    // add drag handle to document
    this.overlay.appendChild(box)
    // keep track of drag handle
    this.boxes.push(box)
  }

  handleMousedown (evt) {
    this.blot.handling && this.blot.handling(true)
    // note which box
    this.dragBox = evt.target
    // note starting mousedown position
    this.dragStartX = evt.clientX
    this.dragStartY = evt.clientY
    // store the width before the drag
    this.preDragSize = {
      width: this.activeEle.offsetWidth,
      height: this.activeEle.offsetHeight
    }
    // store the natural size
    this.naturalSize = this.getNaturalSize()
    // set the proper cursor everywhere
    const cursor = window.getComputedStyle(this.dragBox).cursor
    this.setCursor(cursor)

    this.handleDragProxy = evt => this.handleDrag(evt)
    this.handleMouseupProxy = evt => this.handleMouseup(evt)
    // listen for movement and mouseup
    document.addEventListener('mousemove', this.handleDragProxy, false)
    document.addEventListener('mouseup', this.handleMouseupProxy, false)
  }

  handleMouseup (evt) {
    // save size, clear style
    const calcSize = this.calcSize(evt, this.blotOptions.limit)
    Object.assign(this.activeEle, calcSize)
    Object.assign(this.activeEle.style, { width: null, height: null })

    // reset cursor everywhere
    this.setCursor('')
    this.blot.handling && this.blot.handling(false)
    // stop listening for movement and mouseup
    document.removeEventListener('mousemove', this.handleDragProxy)
    document.removeEventListener('mouseup', this.handleMouseupProxy)
  }

  handleDrag (evt) {
    if (!this.activeEle || !this.blot) {
      // activeEle not set yet
      return
    }

    const limit = {
      ...this.blotOptions.limit,
      unit: true
    }
    Object.assign(this.activeEle.style, this.calcSize(evt, limit))

    this.requestUpdate()
  }

  calcSize (evt, limit = {}) {
    // update size
    const deltaX = evt.clientX - this.dragStartX
    const deltaY = evt.clientY - this.dragStartY

    const size = {}
    let direction = 1

    ;(this.blotOptions.attribute || ['width']).forEach(key => {
      size[key] = this.preDragSize[key]
    })

    // left-side
    if (this.dragBox === this.boxes[0] || this.dragBox === this.boxes[3]) {
      direction = -1
    }

    if (size.width) {
      size.width = Math.round(this.preDragSize.width + deltaX * direction)
    }
    if (size.height) {
      size.height = Math.round(this.preDragSize.height + deltaY * direction)
    }

    let { width, height } = size

    // keep ratio
    if (limit.ratio) {
      let limitHeight
      if (limit.minWidth) width = Math.max(limit.minWidth, width)
      if (limit.maxWidth) width = Math.min(limit.maxWidth, width)

      height = width * limit.ratio

      if (limit.minHeight && height < limit.minHeight) {
        limitHeight = true
        height = limit.minHeight
      }
      if (limit.maxHeight && height > limit.maxHeight) {
        limitHeight = true
        height = limit.maxHeight
      }

      if (limitHeight) {
        width = height / limit.ratio
      }
    } else {
      if (size.width) {
        if (limit.minWidth) width = Math.max(limit.minWidth, width)
        if (limit.maxWidth) width = Math.min(limit.maxWidth, width)
      }
      if (size.height) {
        if (limit.minHeight) height = Math.max(limit.minHeight, height)
        if (limit.maxHeight) height = Math.min(limit.maxHeight, height)
      }
    }

    if (limit.unit) {
      if (width) width = width + 'px'
      if (height) height = height + 'px'
    }

    const res = {}
    if (width) res.width = width
    if (height) res.height = height
    return res
  }

  getNaturalSize () {
    const ele = this.activeEle
    let size = [0, 0]
    if (!ele.getAttribute('data-size')) {
      size = [
        ele.naturalWidth || ele.offsetWidth,
        ele.naturalHeight || ele.offsetHeight
      ]
      ele.setAttribute('data-size', size[0] + ',' + size[1])
    } else {
      size = ele.getAttribute('data-size').split(',')
    }
    return {
      width: parseInt(size[0]),
      height: parseInt(size[1])
    }
  }

  setCursor (value) {
    [document.body, this.activeEle].forEach(el => {
      el.style.cursor = `${value} !important` // eslint-disable-line no-param-reassign
    })
  }
}
