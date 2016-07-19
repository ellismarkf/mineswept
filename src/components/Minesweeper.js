import React from 'react'
import { connect } from 'react-redux'
import { reveal, revealMines, setToPlayMode } from '../state'
import { sweep, safe, hasMine, swept, playing,
         editing, active, won, lost } from '../minesweeper'
import { tileStyle, sweptTileStyle, hasMineStyle } from '../styles'

/* GAME */
class Minesweeper extends React.Component {
  componentDidMount() {
    this.props.setMode()
  }
  render() {
    return (
      <div>
        <h1>welcome to Minesweeper</h1>
        <ConnectedBoard />
      </div>
    )
  }
}

const mapDispatchToContainer = (dispatch) => ({
  setMode: () => dispatch(setToPlayMode())
})

const ConnectedContainer = connect(undefined, mapDispatchToContainer)(Minesweeper)
export default ConnectedContainer


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
  if (!(state & swept)) return tileStyle
  if (state & swept && !(state & hasMine)) return sweptTileStyle
  if (state & swept | hasMine) return hasMineStyle
}

const tileContent = {
  0: '',
  2: '',
  3: '💣'
}

const content = (tile, threats) =>
  tile === 2 && threats > 0 ? threats : tileContent[tile]

const Tile = ({ tile, threats, pos, reveal }) => {
  console.log(tile & ~swept & hasMine);
  return (
  <div
    style={calculateStyle(tile)}
    onClick={() => reveal(pos)}>
    {content(tile, threats)}
  </div>
)
}
    // {!(tile & swept) && ''}
    // {tile & ~swept & hasMine ? '💣' : ''}
    // {tile & swept & ~hasMine && threats > 0 ? threats : ''}


// const mapTileStateToProps

const mapDispatchToProps = (dispatch) => ({
  reveal: (pos) => dispatch(reveal(pos))
})

const ConnectedTile = connect(undefined, mapDispatchToProps)(Tile)
