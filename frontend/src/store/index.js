import { createStore } from 'vuex'
import mutations from '@/store/mutations'
import actions from '@/store/actions'
import getters from '@/store/getters'

export const store = createStore({
  state() {
    return {
      imageSources: [],
      projectID: '',
      images: [],
      showControls: false,
      controlMode: 'preprocess',
      zoom: 1,
      prevZoom: 1,
      forceRefreshKey: 0,
      style: {
        font: 'Poppins',
        fontSize: 40,
        color: '#ff0000',
        changed: null
      },
      marks: {
        calculated: 0,
        total: ''
      },
      menu: {
        show: false,
        coords: { x: 0, y: 0 },
        pasteCoords: {
          x: 0,
          y: 0
        }
      },
      clipboard: [],
      preprocessInstructions: [],
      defaultLocale: 'en',
      translation: {},
      fallbackTranslation: {},
      numPages: null,
      defaultSettings: {
        locale: 'en',
        color: '#ff0000'
      }
    }
  },
  mutations,
  actions,
  getters
})
