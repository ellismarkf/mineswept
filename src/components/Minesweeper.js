import React from 'react'
import { connect } from 'react-redux'
import { update } from '../state'
import { generateTiles, sweep, isSafe } from '../minesweeper'

class Minesweeper extends React.Component {
  render() {
    return (
      <div>
        <h1>welcome to Minesweeper</h1>
        <ConnectedBoard />
      </div>
    )
  }
}

const Board = ({tiles, cols}) => (
  <div style={{ width: `${cols * 20}px`, margin: `0 auto` }}>
    {tiles.map( (tile, index) => (
      <Tile {...tile} key={index} pos={index}/>
    ))}
  </div>
)

const mapBoardStateToProps = (state) => ({
  tiles: state.minesweeper.tiles,
  cols: state.minesweeper.cols
})

const ConnectedBoard = connect(mapBoardStateToProps)(Board)

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