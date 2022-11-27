const { readFileSync } = require('fs')
const { resolve } = require('path')
const getPath = symbol => {
  return resolve(__dirname, '..', 'images', `${symbol}.png`)
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
    acc[symbol] = readFileSync(getPath(symbol))
    return acc
  }, {})

  return symbolsObj
}

module.exports = { getSymbols }
