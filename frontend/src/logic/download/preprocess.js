import { toRaw } from 'vue'
import { store } from '@/store/index'

export const executePreprocessing = async (doc, updateProgress) => {
  let instructions = [...toRaw(store.state.preprocessInstructions)]

  let deletions = instructions.reduce((acc, instruction) => {
    if (instruction.type === 'delete') {
      let id = instruction.id
      let deleteIndex = parseInt(id.split('-').slice(-1)[0] - 1)
      acc.push(deleteIndex)
    }
    return acc
  }, [])
  let rotations = instructions.reduce((acc, instruction) => {
    if (instruction.type === 'rotate' && !deletions.includes(instruction.id)) {
      acc.push({
        angle: instruction.angle,
        rotateIndex: parseInt(instruction.id.split('-').slice(-1)[0] - 1)
      })
    }
    return acc
  }, [])
  let switches = instructions.reduce((acc, instruction) => {
    if (
      instruction.type === 'switch' &&
      instruction.switch.reduce((a, c) => {
        a = a && !deletions.includes(c.id)
        return a
      }, true)
    ) {
      let firstID = instruction.switch[0]
      let secondID = instruction.switch[1]

      let firstSwitchIndex = parseInt(firstID.split('-').slice(-1)[0] - 1)
      let secondSwitchIndex = parseInt(secondID.split('-').slice(-1)[0] - 1)
      acc.push([firstSwitchIndex, secondSwitchIndex])
    }
    return acc
  }, [])
  deletions.forEach((deleteIndex, i) => {
    doc.removePage(deleteIndex)
  })
  updateProgress(20)
  rotations.forEach(async ({ angle, rotateIndex }) => {
    updateProgress(20)
    let page = await doc.getPage(rotateIndex)
    page.setRotation(degrees(page.getRotation().angle + angle))
  })
  updateProgress(35)
  let pages = await doc.getPages()
  switches.forEach(async ([firstIndex, secondIndex], i) => {
    doc.removePage(firstIndex)
    doc.insertPage(firstIndex, pages[secondIndex])
    doc.removePage(secondIndex)
    doc.insertPage(secondIndex, pages[firstIndex])
  })
  updateProgress(50)
  return doc
}
