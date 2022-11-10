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

export default {
  setImageSources,
  setImages,
  setControls
}
