const board = (rows = 9, cols = 9, mines = 10) => {
  const t = addMines(tiles(rows, cols), mines)
  return {
    rows,
    cols,
    mines,
    tiles: t,
    threats: markThreatCounts(t, cols),
    mode: 0
  }
}

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
    const perimeter = getPerimeter(index, tiles.length, cols)
    return getThreatCount(perimeter, tiles)
  })

const hasMine = 1 << 0,
      swept   = 1 << 1,
      flagged = 1 << 2

const active  = 1 << 0,
      editing = 1 << 1,
      playing = 1 << 2,
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

const getPerimeter = (tileIndex, tileCount, cols) =>
  new Int8Array([...perimeter(tileIndex, cols)])
  .filter( pos => {
    const invalidW = checkWest(tileIndex, cols, pos)
    const invalidE = checkEast(tileIndex, cols, pos)
    const invalidY = pos < 0 || pos >= tileCount

    return !invalidW && !invalidE && !invalidY
  })

const getThreatCount = (perimeter, tiles) =>
  perimeter.reduce((threats, pos) =>
    tiles[pos] & hasMine ? threats += 1 : threats
  , 0)

const checkWest = (t, c, pI) =>
  t % c === 0 &&
    (pI === (t - 1) || pI === (t + (c - 1)) || pI === (t - (c + 1)))

const checkEast = (t, c, pI) =>
  (t + 1) % c === 0 &&
    (pI === (t + 1) || pI === (t - (c - 1)) || pI === (t + (c + 1)))


const sweep = (pos, tiles, threats, cols) => {
  const currentTile = tiles[pos]
  const threatCount = threats[pos]
  const sweptTile = currentTile | swept
  const updatedBoard = tiles.map((tile, i) =>
    i === pos ? sweptTile : tile
  )
  if ((currentTile & hasMine) || (threatCount > 0)) return updatedBoard
  const perimeter = getPerimeter(pos, updatedBoard.length, cols)
  const sweptBoard = perimeter.reduce((board, pPos) =>
    !(board[pPos] & swept) ? sweep(pPos, board, threats, cols) : board
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
  board,
  partition,
  tiles,
  addMines,
  markThreatCounts,
  perimeter,
  getPerimeter,
  getThreatCount,
  checkWest,
  checkEast,
  sweep,
  safe,
  revealMines,
  hasMine,
  swept,
  flagged,
  playing,
  editing,
  active,
  won,
  lost  
}