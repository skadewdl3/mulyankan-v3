import { toRaw } from 'vue'
import { store } from '@/store/index'
import { downloadURI } from '@/helpers/miscellaneous'
// import addSymbols from './addSymbols'

export const executeEditing = async (doc, updateProgress) => {
  let fcanvases = toRaw(store.state.images)
  let pages = fcanvases.reduce((acc, fcanvas) => {
    let objects = fcanvas._objects.map(obj =>
      obj.toJSON(['imgColor', 'textType', 'id', 'zoom'])
    )
    let id = fcanvas.id
    acc = [...acc, { id, objects }]
    return acc
  }, [])
  let backgroundImages = fcanvases.reduce((acc, fcanvas) => {
    acc = [...acc, fcanvas._objects[0]]
    return acc
  }, [])
  let objects = pages.reduce((acc, page) => {
    let objs = page.objects
    if (!acc.images) acc.images = []
    if (!acc.textboxes) acc.textboxes = []
    let images = objs.filter((obj, i) => obj.type === 'image' && i !== 0)

    acc.images = [...acc.images, images]
    let textboxes = objs.filter(obj => obj.type === 'textbox')

    acc.textboxes = [...acc.textboxes, textboxes]
    return acc
  }, {})
  import('./addSymbols')
    .then(async ({ default: addSymbols }) => {
      let newDoc = await addSymbols(objects, backgroundImages, doc)
      import('./addText').then(async ({ default: addText }) => {
        newDoc = await addText(objects, backgroundImages, newDoc)
        let dataurl = await newDoc.saveAsBase64({ dataUri: true })
        downloadURI(dataurl, 'test.pdf')
        return doc
      })
    })
    .catch('couldnt import addSymbols')
}
