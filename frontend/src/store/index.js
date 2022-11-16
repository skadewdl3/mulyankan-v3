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
      },
      marks: {
        calculated: 0,
        total: ''
      },
      menu: {
        show: false,
        coords: { x: 0, y: 0 }
      }
    }
  },
  mutations,
  actions,
  getters
})
