const getStyle = state => state.style

const getMenu = state => state.menu

const getActiveCanvas = state => state.images.filter(c => c.active)[0]

export default {
  getStyle,
  getMenu,
  getActiveCanvas
}
