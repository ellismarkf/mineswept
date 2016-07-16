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
    /**
     * Coordinates of tile in terms of index
     * index => (row, col)
     *
     * col = index % cols
     * row = Math.floor((index - col) / rows)
     */
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

const checkWestPerimeter = (t, c, pI) =>
  t % c === 0 &&
    (pI === (t - 1) || pI === (t + (c - 1)) || pI === (t - (c + 1)))

const checkEastPerimeter = (t, c, pI) =>
  (t + 1) % c === 0 &&
    (pI === (t + 1) || pI === (t - (c - 1)) || pI === (t + (c + 1)))

const directions = [ 'N', 'NW', 'W', 'SW', 'S', 'SE', 'E', 'NE' ]
const perimeterCoords = (tileIndex, cols) => ({
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

const revealMinePositions = tiles =>
  tiles.map( tile =>
    tile.hasMine ? Object.assign({}, tile, { swept: true }) : tile
  )

const partition = (size) =>
  new ArrayBuffer(size);

const tiles = (rows = 9, cols = 9) =>
  new Uint8ClampedArray(partition(rows * cols))

const addMines = (tiles, mines) =>
  new Uint8ClampedArray(partition(tiles.length))
  .fill(1, 0, mines)
  .sort(() => Math.random() - 0.5)

const markThreatCounts = (tiles, cols) =>
  tiles.map( (tile, index, tiles ) => {
    const perimeter = getP(index, tiles.length, cols)
    return getTC(perimeter, tiles)
  })

const hasMine = 1 << 0,
      swept   = 1 << 1,
      flagged = 1 << 2

const playing = 1 << 0,
      editing = 1 << 1,
      active  = 1 << 2,
      won     = 1 << 3,
      lost    = 1 << 4

const perimeter = (tileIndex, cols) => new Set([
  tileIndex - cols,
  tileIndex - (cols + 1),
  tileIndex - 1,
  tileIndex + (cols - 1),
  tileIndex + cols,
  tileIndex + (cols + 1),
  tileIndex + 1,
  tileIndex - (cols - 1),
])

const getP = (tileIndex, tileCount, cols) =>
  new Int8Array([...perimeter(tileIndex, cols)])
  .filter( pos => {
    const invalidW = checkWest(tileIndex, cols, pos)
    const invalidE = checkEast(tileIndex, cols, pos)
    const invalidY = pos < 0 || pos >= tileCount

    return !invalidW && !invalidE && !invalidY
  })

const getTC = (perimeter, tiles) =>
  perimeter.reduce((threats, pos) =>
    tiles[pos] & hasMine ? threats += 1 : threats
  , 0)

const checkWest = (t, c, pI) =>
  t % c === 0 &&
    (pI === (t - 1) || pI === (t + (c - 1)) || pI === (t - (c + 1)))

const checkEast = (t, c, pI) =>
  (t + 1) % c === 0 &&
    (pI === (t + 1) || pI === (t - (c - 1)) || pI === (t + (c + 1)))


const s = (pos, tiles, threats, cols) => {
  const currentTile = tiles[pos]
  const threatCount = threats[pos]
  const sweptTile = currentTile | swept
  const updatedBoard = tiles.map((tile, i) =>
    i === pos ? sweptTile : tile
  )
  if (currentTile & hasMine || threatCount > 0) return updatedBoard
  const perimeter = getP(pos, updatedBoard, cols)
  const sweptBoard = perimeter.reduce((board, pPos) =>
    !(board[pPos] & swept) ? s(pPos, board, threats, cols) : board
  , updatedBoard)

  return sweptBoard
}

const safe = tiles =>
  tiles.reduce( (safe, tile) =>
    safe && (!(tile & swept)  || tile & swept && !(tile & hasMine))
  , true)

const revealMines = tiles =>
  tiles.map( tile =>
    tile & hasMine ? tile | swept : tile
  )


module.exports = {
  newBoard,
  generateTiles,
  buildTile,
  getPerimeter,
  perimeterCoords,
  getThreatCount,
  sweep,
  isSafe,
  revealMinePositions,
  directions
}