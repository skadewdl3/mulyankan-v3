const roundOff = (num, scale) => {
  if (!('' + num).includes('e')) {
    return +(Math.round(num + 'e+' + scale) + 'e-' + scale)
  } else {
    var arr = ('' + num).split('e')
    var sig = ''
    if (+arr[1] + scale > 0) {
      sig = '+'
    }
    return +(Math.round(+arr[0] + 'e' + sig + (+arr[1] + scale)) + 'e-' + scale)
  }
}

const setImageSources = (state, imageSources) => {
  state.imageSources = imageSources
}

const setImages = (state, images) => {
  state.images = images
}

const setControls = (state, { show = true, mode = 'preprocess' }) => {
  state.showControls = show
  state.controlMode = mode
}

const zoomIn = state => {
  if (state.zoom >= 2) return
  state.zoom = roundOff(state.zoom + 0.1, 1)
}

const zoomOut = state => {
  if (state.zoom <= 0.2) return
  state.zoom = roundOff(state.zoom - 0.1, 1)
}

export default {
  setImageSources,
  setImages,
  setControls,
  zoomIn,
  zoomOut
}
