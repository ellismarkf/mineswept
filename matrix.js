const buildBoard = (tile, rows = 9, cols = 9, random = true) =>
  [ ...Array(rows) ].map( (row, y) =>
    [ ...Array(cols) ].map( (col, x) =>
      tile(x, y, random)
    )
  )

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
    const perimeter = newGetPerimeter(index, tiles, cols)
    return Object.assign(tile, {
      threatCount: getThreatCount(perimeter)
    })
  })

const newTile = (hasMine = false, threatCount = 0) =>
  Object.assign({}, {
    hasMine,
    swept: false,
    flagged: false,
    threatCount
  })

const tile = (x, y, random = true) =>
  Object.assign({}, {
    hasMine: random ? Math.random() > .5 : false,
    swept: false,
    flagged: false,
    x,
    y
  })

const directions = [ 'N', 'NW', 'W', 'SW', 'S', 'SE', 'E', 'NE' ]

const perimeterCoords = tile => {
  const { x, y } = tile
  return Object.assign({}, {
    'N' : { x       , y: y - 1 },
    'NW': { x: x - 1, y: y - 1 },
    'W' : { x: x - 1, y        },
    'SW': { x: x - 1, y: y + 1 },
    'S' : { x       , y: y + 1 },
    'SE': { x: x + 1, y: y + 1 },
    'E' : { x: x + 1, y        },
    'NE': { x: x + 1, y: y - 1 } 
  })
}

const newPerimeterCoords = (tileIndex, cols) =>
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

const newGetPerimeter = (tileIndex, tiles, cols) => {
  const perimeter = newPerimeterCoords(tileIndex, cols)
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

checkEastPerimeter = (t, c, pI) =>
  (t + 1) % c === 0 && (pI === (t + 1) || pI === (t - (c - 1)) || pI === (t + (c + 1)))

const getPerimeter = (tile, board) => {
  const perimeter = perimeterCoords(tile)
  return directions
    .map( direction => {
      const { x, y } = perimeter[direction]
      const invalidX = x < 0 || x > board[0].length - 1
      const invalidY = y < 0 || y > board.length
      return invalidX || invalidY ? undefined : board[x][y]
    })
    .filter( tile => tile !== undefined )
}

const getThreatCount = perimeter =>
  perimeter.reduce((threats, tile) => {
    return tile.hasMine ? threats += 1 : threats
  }, 0)

const sweep = (tile, board) => {
  /* end game if tile.hasMine */
  /* set tile.swept = true  */
  const perimeter = getPerimeter(tile, board);
  const threats = getThreatCount(perimeter);
  perimeter.forEach( tile => {
    if (!tile.swept && !tile.hasMine) {
      sweep(tile, board)
    }
  })
}

module.exports = {
  buildBoard: buildBoard,
  generateTiles: generateTiles,
  newTile: newTile,
  newGetPerimeter: newGetPerimeter,
  newPerimeterCoords: newPerimeterCoords,
  tile: tile,
  perimeterCoords: perimeterCoords,
  getPerimeter: getPerimeter,
  getThreatCount: getThreatCount,
  sweep: sweep,
  directions: directions
}