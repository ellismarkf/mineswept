import React from 'react'
import { connect } from 'react-redux'
import { reveal, revealMines } from '../state'
import { sweep, safe, hasMine, swept } from '../minesweeper'
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
const Board = ({tiles, threats, cols}) => (
  <div style={{ width: `${cols * 20}px`, margin: `0 auto`, overflow: 'hidden' }}>
    {tiles.reduce(
      (children, tile, index, tiles) =>
        children.concat(
          <ConnectedTile
            tile={tile}
            threats={threats[index]}
            pos={index}
            key={`tile-${index}`}/>
        )
      , [])
    }
  </div>
)

const mapBoardStateToProps = (state) => ({
  tiles: state.minesweeper.tiles,
  threats: state.minesweeper.threats,
  cols: state.minesweeper.cols
})

const ConnectedBoard = connect(mapBoardStateToProps)(Board)


/* TILE */
const calculateStyle = (state) => {
  console.log(state)
  if (!(state & swept)) return tileStyle
  if (state & swept && !(state & hasMine)) return sweptTileStyle
  if (state & swept && state & hasMine) return hasMineStyle
}

const Tile = ({ tile, threats, pos, reveal }) => {
  return (
  <div
    style={calculateStyle(tile)}
    onClick={() => reveal(pos)}>
    {!(tile & swept) && ''}
    {tile & swept && tile & hasMine ? '💣' : ''}
    {tile & swept && !(tile & hasMine) && threats > 0 ? threats : ''}
  </div>
)
}


// const mapTileStateToProps

const mapDispatchToProps = (dispatch) => ({
  reveal: (pos) => dispatch(reveal(pos))
})

const ConnectedTile = connect(undefined, mapDispatchToProps)(Tile)
