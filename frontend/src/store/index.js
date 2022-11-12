import { createStore } from 'vuex'
import mutations from './mutations'

export const store = createStore({
  state() {
    return {
      imageSources: [],
      images: [],
      showControls: false,
      controlMode: 'preprocess',
      zoom: 1
    }
  },
  mutations
})
