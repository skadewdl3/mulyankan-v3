import { store } from '@/store/index'
import axios from 'axios'

export const changeLanguage = async locale => {
  let { data } = await axios.post('%BASE_URL%/getlang', {
    data: {
      locale
    }
  })
  store.state.translation = data.translation
}

export const translate = key => {
  let keys = key.split('.')
  let tl = store.state.translation
  let fallbacktl = store.state.fallbackTranslation
  keys.forEach(k => {
    if (tl[k]) tl = tl[k]
    else tl = key
  })
  if (tl !== key) return tl
  else {
    keys.forEach(k => {
      if (fallbacktl[k]) fallbacktl = fallbacktl[k]
      else fallbacktl = key
    })
    return fallbacktl
  }
}
