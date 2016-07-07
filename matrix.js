export const buildBoard = (tile, size = 9, random = true) =>
  [ ...Array(size) ].map( (row, y) =>
    [ ...Array(size) ].map( (col, x) =>
      tile(x, y, random)
    )
  )

export const tile = (x, y, random = true) =>
  Object.assign({}, {
    hasMine: random ? Math.random() > .5 : false,
    swept: false,
    flagged: false,
    x,
    y
  })

const directions = [ 'N', 'NW', 'W', 'SW', 'S', 'SE', 'E', 'NE' ]

export const perimeterCoords = tile => {
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

export const getPerimeter = (tile, board) => {
  const perimeter = perimeterCoords(tile)
  return directions
    .map( direction => {
      const { x, y } = perimeter[direction]
      const invalidX = x < 0 || x > board[0].length
      const invalidY = y < 0 || y > board.length
      return invalidX || invalidY ? undefined : board[x][y]
    })
    .filter( tile => tile !== undefined )
}

export const getThreatCount = perimeter =>
  perimeter.reduce((threats, tile) => {
    tile.hasMine ? threats += 1 : threats
  }, 0)

export const sweep = tile => {

}