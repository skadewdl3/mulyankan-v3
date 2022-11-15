import { createStore } from 'vuex'
import mutations from '@/store/mutations'
import actions from '@/store/actions'
import getters from '@/store/getters'

export const store = createStore({
  state() {
    return {
      imageSources: [],
      images: [],
      showControls: false,
      controlMode: 'preprocess',
      zoom: 1,
      prevZoom: null,
      forceRefreshKey: 0,
      style: {
        font: 'Poppins',
        fontSize: 40,
        color: '#ff0000'
      }
    }
  },
  mutations,
  actions,
  getters
})
