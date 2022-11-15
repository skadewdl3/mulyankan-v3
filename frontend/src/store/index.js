import { createStore } from 'vuex'
import mutations from '@/store/mutations'
import actions from '@/store/actions'

export const store = createStore({
  state() {
    return {
      imageSources: [],
      images: [],
      showControls: false,
      controlMode: 'preprocess',
      zoom: 1,
      prevZoom: null,
      font: 'Poppins',
      color: '#ff0000'
    }
  },
  mutations,
  actions
})
