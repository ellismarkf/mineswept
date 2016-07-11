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
    return Object.assign({}, tile, {
      threatCount: getThreatCount(perimeter, tiles)
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
      
      return invalidW || invalidE || invalidY ? -1 : pIndex
    })
    .filter( pos => pos > -1 )
}

const checkWestPerimeter = (t, c, pI) =>
  t % c === 0 &&
    (pI === (t - 1) || pI === (t + (c - 1)) || pI === (t - (c + 1)))

const checkEastPerimeter = (t, c, pI) =>
  (t + 1) % c === 0 &&
    (pI === (t + 1) || pI === (t - (c - 1)) || pI === (t + (c + 1)))

const getThreatCount = (perimeter, tiles) =>
  perimeter.reduce((threats, pos) => {
    const tile = tiles[pos]
    return tile.hasMine ? threats += 1 : threats
  }, 0)

const sweep = (tileIndex, tiles, cols) => {
  const currentTile = tiles[tileIndex]
  const sweptTile = Object.assign({}, currentTile, { swept: true })
  const updatedBoard = tiles.map( (tile, index) =>
    index === tileIndex ? sweptTile : tile
  )
  if (currentTile.hasMine || currentTile.threatCount > 0) return updatedBoard;
  const perimeter = getPerimeter(tileIndex, updatedBoard, cols);
  const sweptBoard = perimeter.reduce( (board, pos) => {
    const tile = board[pos]
    return !tile.swept ?
      sweep(pos, board, cols) :
      board
    }, updatedBoard)

  return sweptBoard
}

const isSafe = tiles =>
  tiles.reduce( (safe, tile) => {
    return safe && (!tile.swept  || tile.swept && !tile.hasMine)
  }, true)

module.exports = {
  newBoard,
  generateTiles,
  buildTile,
  getPerimeter,
  perimeterCoords,
  getThreatCount,
  sweep,
  isSafe,
  directions
}