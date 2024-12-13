export default {
  modules: ['DisplaySize', 'Toolbar', 'Resize', 'Keyboard'],
  keyboardSelect: true,
  selectedClass: 'selected',
  activeClass: 'active',
  embedTags: ['VIDEO', 'IFRAME'],
  tools: ['left', 'center', 'right', 'full', 'edit'],

  parchment: {
    image: {
      attribute: ['width'],
      limit: {
        minWidth: 100
      }
    },
    video: {
      attribute: ['width', 'height'],
      limit: {
        minWidth: 200,
        ratio: 0.5625
      }
    }
  }
}
