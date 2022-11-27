const { readFileSync } = require('fs')
const { resolve } = require('path')
const getImagePath = symbol => {
  return resolve(__dirname, '..', 'images', `${symbol}.png`)
}
const getFontPath = font => {
  return resolve(__dirname, '..', 'fonts', `${font}.ttf`)
}

const getFonts = () => {
  const fonts = ['Poppins', 'Source Serif Pro', 'Dancing Script', 'Caveat']
  let fontsObj = fonts.reduce((acc, font) => {
    acc[font] = readFileSync(getFontPath(font))
    return acc
  }, {})

  return fontsObj
}

const getSymbols = () => {
  const symbols = [
    'check',
    'cross',
    'underline',
    'double-underline',
    'arrow',
    'circle'
  ]

  let symbolsObj = symbols.reduce((acc, symbol) => {
    acc[symbol] = readFileSync(getImagePath(symbol))
    return acc
  }, {})

  return symbolsObj
}

module.exports = { getSymbols, getFonts }
