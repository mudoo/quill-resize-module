import BaseModule from './BaseModule'
import { ParchmentConfig, SizeLimit } from '../DefaultOptions'

interface SizeResult {
  width?: number | string;
  height?: number | string;
}

interface NaturalSize {
  width: number;
  height: number;
}

export default class Resize extends BaseModule {
  blotOptions!: ParchmentConfig
  boxes: HTMLElement[] = []
  dragBox!: HTMLElement
  dragStartX!: number
  dragStartY!: number
  preDragSize!: { width: number; height: number }
  naturalSize!: NaturalSize
  handleDragProxy!: (evt: MouseEvent) => void
  handleMouseupProxy!: (evt: MouseEvent) => void

  onCreate (): void {
    this.blotOptions = this.options.parchment![this.blot.statics.blotName]
    // track resize handles
    this.boxes = []

    // add 4 resize handles
    this.addBox('tl') // top left
    this.addBox('tr') // top right
    this.addBox('br') // bottom right
    this.addBox('bl') // bottom left
  }

  onDestroy (): void {
    // reset drag handle cursors
    this.setCursor('')
  }

  addBox (place: string): void {
    // create div element for resize handle
    const box = document.createElement('div')
    box.className = `ql-resize-handle ${place}`

    // listen for mousedown on each box
    box.addEventListener('mousedown', this.handleMousedown.bind(this), false)
    box.addEventListener('touchstart', this.handleMousedown.bind(this), { passive: false })
    // add drag handle to document
    this.overlay.appendChild(box)
    // keep track of drag handle
    this.boxes.push(box)
  }

  handleMousedown (evt: MouseEvent | TouchEvent): void {
    // note which box
    this.dragBox = evt.target as HTMLElement
    // note starting mousedown position
    if (evt instanceof TouchEvent) {
      this.dragStartX = evt.changedTouches[0].clientX
      this.dragStartY = evt.changedTouches[0].clientY
    } else {
      this.dragStartX = evt.clientX
      this.dragStartY = evt.clientY
    }
    // store the width before the drag
    this.preDragSize = {
      width: this.activeEle.offsetWidth,
      height: this.activeEle.offsetHeight,
    }
    // store the natural size
    this.naturalSize = this.getNaturalSize()
    // set the proper cursor everywhere
    const cursor = window.getComputedStyle(this.dragBox).cursor
    this.setCursor(cursor)

    this.handleDragProxy = (evt: MouseEvent | TouchEvent) => this.handleDrag(evt)
    this.handleMouseupProxy = (evt: MouseEvent | TouchEvent) => this.handleMouseup(evt)
    // listen for movement and mouseup
    document.addEventListener('mousemove', this.handleDragProxy)
    document.addEventListener('touchmove', this.handleDragProxy, { passive: false })
    document.addEventListener('mouseup', this.handleMouseupProxy, true)
    document.addEventListener('touchend', this.handleMouseupProxy, true)
    document.addEventListener('touchcancel', this.handleMouseupProxy, true)
  }

  handleMouseup (evt: MouseEvent | TouchEvent): void {
    evt.stopPropagation()

    // save size, clear style
    const calcSize = this.calcSize(evt, this.blotOptions.limit)
    Object.assign(this.activeEle, calcSize)
    Object.assign(this.activeEle.style, { width: null, height: null })
    this.options.onChangeSize?.call(this, this.blot, this.activeEle, calcSize)

    // reset cursor everywhere
    this.setCursor('')
    // stop listening for movement and mouseup
    document.removeEventListener('mousemove', this.handleDragProxy)
    document.removeEventListener('touchmove', this.handleDragProxy)
    document.removeEventListener('mouseup', this.handleMouseupProxy, true)
    document.removeEventListener('touchend', this.handleMouseupProxy, true)
    document.removeEventListener('touchcancel', this.handleMouseupProxy, true)
  }

  handleDrag (evt: MouseEvent | TouchEvent): void {
    if (!this.activeEle || !this.blot) {
      // activeEle not set yet
      return
    }

    if (evt instanceof TouchEvent && evt.cancelable) {
      evt.preventDefault()
    }

    const limit: SizeLimit & { unit?: boolean } = {
      ...this.blotOptions.limit,
      unit: true,
    }
    Object.assign(this.activeEle.style, this.calcSize(evt, limit))

    this.requestUpdate()
  }

  calcSize (evt: MouseEvent | TouchEvent, limit: SizeLimit & { unit?: boolean } = {}): SizeResult {
    let clientX: number, clientY: number

    if (evt instanceof TouchEvent) {
      clientX = evt.changedTouches[0].clientX
      clientY = evt.changedTouches[0].clientY
    } else {
      clientX = evt.clientX
      clientY = evt.clientY
    }

    const deltaX = clientX - this.dragStartX
    const deltaY = clientY - this.dragStartY

    const size: any = {}
    let direction = 1

    ;(this.blotOptions.attribute || ['width']).forEach(key => {
      size[key] = this.preDragSize[key]
    })

    // left-side
    if (this.dragBox === this.boxes[0] || this.dragBox === this.boxes[3]) {
      direction = -1
    }

    if (size.width !== undefined) {
      size.width = Math.round(this.preDragSize.width + deltaX * direction)
    }
    if (size.height !== undefined) {
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
      if (size.width !== undefined) {
        if (limit.minWidth) width = Math.max(limit.minWidth, width)
        if (limit.maxWidth) width = Math.min(limit.maxWidth, width)
      }
      if (size.height !== undefined) {
        if (limit.minHeight) height = Math.max(limit.minHeight, height)
        if (limit.maxHeight) height = Math.min(limit.maxHeight, height)
      }
    }

    if (limit.unit) {
      if (width) width = width + 'px'
      if (height) height = height + 'px'
    }

    const res: SizeResult = {}
    if (width) res.width = width
    if (height) res.height = height
    return res
  }

  getNaturalSize (): NaturalSize {
    const ele = this.activeEle
    let size: [number, number] = [0, 0]
    if (!ele.getAttribute('data-size')) {
      size = [
        (ele as HTMLImageElement).naturalWidth || ele.offsetWidth,
        (ele as HTMLImageElement).naturalHeight || ele.offsetHeight,
      ]
      ele.setAttribute('data-size', size[0] + ',' + size[1])
    } else {
      const sizeStr = ele.getAttribute('data-size')!.split(',')
      size = [parseInt(sizeStr[0]), parseInt(sizeStr[1])]
    }
    return {
      width: size[0],
      height: size[1],
    }
  }

  setCursor (value: string): void {
    [document.body, this.activeEle].forEach(el => {
      el.style.cursor = `${value} !important` // eslint-disable-line no-param-reassign
    })
  }
}
