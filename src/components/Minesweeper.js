import React from 'react'
import { generateTiles, sweep, isSafe } from '../minesweeper'

// const Minesweeper = ({ game }) => (
//     <div>
//         <h1>welcome to Minesweeper</h1>
//         <Board {...game}/>
//     </div>
// )

class Minesweeper extends React.Component {
  render() {
    const { game } = this.props
    return (
      <div>
        <h1>welcome to Minesweeper</h1>
        <Board {...game}/>
      </div>
    )
  }
}

const Board = ({ tiles, cols, rows, mines }) => (
  <div style={{ width: `${cols * 20}px`, margin: `0 auto` }}>
    {tiles.map( (tile, index) => (
      <Tile {...tile} key={index} pos={index}/>
    ))}
  </div>
)

const tileStyle = {
  display: 'inline-block',
  width: `${20}px`,
  height: `${20}px`,
  marginBottom: `${-5}px`,
  boxSizing: 'border-box',
  border: `1px solid #BBB`,
  backgroundColor: '#CCC'
}

const hasMineStyle = Object.assign({}, tileStyle, {
  backgroundColor: 'red'
})

const Tile = ({ hasMine, swept, threatCount, pos }) => (
    <span style={hasMine ? hasMineStyle : tileStyle}></span>
)

export default Minesweeper