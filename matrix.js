const newBoard = (tile, rows = 9, cols = 9, mines = 10) =>
  Object.assign({}, {
    rows,
    cols,
    mines,
    tiles: generateTiles(tile, rows, cols, mines)
  })

const generateTiles = (tile, rows = 9, cols = 9, mines = 10) =>
  [...Array(mines)].map( t => tile(true) )
  .concat([...Array(rows * cols - mines)].map( t => tile()))
  .sort(() => Math.random() - 0.5)
  .map( (tile, index, tiles) => {
    const perimeter = getPerimeter(index, tiles, cols)
    return Object.assign(tile, {
      threatCount: getThreatCount(perimeter)
    })
  })

const buildTile = (hasMine = false, threatCount = 0) =>
  Object.assign({}, {
    hasMine,
    swept: false,
    flagged: false,
    threatCount
  })

const directions = [ 'N', 'NW', 'W', 'SW', 'S', 'SE', 'E', 'NE' ]

const perimeterCoords = (tileIndex, cols) =>
  Object.assign({}, {
    'N' : tileIndex - cols,
    'NW': tileIndex - (cols + 1),
    'W' : tileIndex - 1,
    'SW': tileIndex + (cols - 1),
    'S' : tileIndex + cols,
    'SE': tileIndex + (cols + 1),
    'E' : tileIndex + 1,
    'NE': tileIndex - (cols - 1)  
  })

const getPerimeter = (tileIndex, tiles, cols) => {
  const perimeter = perimeterCoords(tileIndex, cols)
  return directions
    .map( direction => {
      const pIndex = perimeter[direction]
      const invalidW = checkWestPerimeter(tileIndex, cols, pIndex)
      const invalidE = checkEastPerimeter(tileIndex, cols, pIndex)
      const invalidY = pIndex < 0 || pIndex >= tiles.length
      return invalidW || invalidE || invalidY ? null : tiles[pIndex]
    })
    .filter( tile => tile !== null )
}

const checkWestPerimeter = (t, c, pI) =>
  t % c === 0 && ((pI === (t - 1)) || (pI === (t + (c - 1))) || (pI === (t - (c + 1))))

const checkEastPerimeter = (t, c, pI) =>
  (t + 1) % c === 0 && (pI === (t + 1) || pI === (t - (c - 1)) || pI === (t + (c + 1)))


const getThreatCount = perimeter =>
  perimeter.reduce((threats, tile) => {
    return tile.hasMine ? threats += 1 : threats
  }, 0)

const sweep = (tile, tiles, cols) => {
  /* set tile.swept = true  */
  /* end game if tile.hasMine */
  const perimeter = getPerimeter(tile, tiles, cols);
  perimeter.forEach( tile => {
    if (!tile.swept && tile.threatCount > 0) {
      sweep(tile, tiles, cols)
    }
  })
}

module.exports = {
  generateTiles: generateTiles,
  buildTile: buildTile,
  getPerimeter: getPerimeter,
  perimeterCoords: perimeterCoords,
  getThreatCount: getThreatCount,
  sweep: sweep,
  directions: directions
}