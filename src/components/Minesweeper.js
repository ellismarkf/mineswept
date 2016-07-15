import React from 'react'
import { connect } from 'react-redux'
import { reveal, revealMines } from '../state'
import { generateTiles, sweep, isSafe } from '../minesweeper'
import { tileStyle, sweptTileStyle, hasMineStyle } from '../styles'

/* GAME */
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
export default Minesweeper


/* BOARD */
const Board = ({tiles, cols, safe, revealMines}) => {
  // if (!safe) revealMines()
  return (
    <div style={{ width: `${cols * 20}px`, margin: `0 auto`, overflow: 'hidden' }}>
      {tiles.map( (tile, index, tiles) => (
        <ConnectedTile {...tile} key={index} pos={index}/>
      ))}
    </div>
  )
}

const mapBoardStateToProps = (state) => ({
  tiles: state.minesweeper.tiles,
  cols: state.minesweeper.cols,
  safe: isSafe(state.minesweeper.tiles)
})

const mapBoardDispatchToProps = (dispatch) => ({
  revealMines: () => dispatch(revealMines()),
  endGame: () => dispatch()
})

const ConnectedBoard = connect(
  mapBoardStateToProps,
  mapBoardDispatchToProps
)(Board)


/* TILE */
const calculateStyle = (swept, hasMine) => {
  if (!swept) return tileStyle
  if (swept && !hasMine) return sweptTileStyle
  if (swept && hasMine) return hasMineStyle
}

const Tile = ({ hasMine, swept, threatCount, pos, reveal, tiles, cols }) => (
  <div
    style={calculateStyle(swept, hasMine)}
    onClick={() => reveal(pos)}>
    {!swept && ''}
    {swept && hasMine ? '💣' : ''}
    {swept && !hasMine && threatCount > 0 ? threatCount : ''}
  </div>
)


// const mapTileStateToProps

const mapDispatchToProps = (dispatch) => ({
  reveal: (pos) => dispatch(reveal(pos))
})

const ConnectedTile = connect(undefined, mapDispatchToProps)(Tile)
