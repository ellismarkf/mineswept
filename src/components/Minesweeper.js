import React from 'react'
import { connect } from 'react-redux'
import { reveal, revealMines, setToPlayMode } from '../state'
import { hasMine, swept, flagged,
         playing, editing, active, won, lost } from '../minesweeper'
// import { tileStyle, sweptTileStyle, hasMineStyle } from '../styles'

/* GAME */
class Minesweeper extends React.Component {
  componentDidMount() {
    this.props.setMode()
  }
  render() {
    return (
      <div>
        <h1>Minesweeper</h1>
        <ConnectedBoard />
      </div>
    )
  }
}

const mapDispatchToRoot = (dispatch) => ({
  setMode: () => dispatch(setToPlayMode())
})

const ConnectedRoot = connect(undefined, mapDispatchToRoot)(Minesweeper)
export default ConnectedRoot


/* BOARD */
const Board = ({tiles, threats, cols}) => (
  <div style={{ width: `${cols * 20}px`}} className='board'>
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
  remainingMines: state.minesweeper.remainingMines,
  cols: state.minesweeper.cols,
  game: state.minesweeper.game
})

const ConnectedBoard = connect(mapBoardStateToProps)(Board)


/* TILE */
const tileContent = {
  0: '',
  1: '',
  2: '',
  3: '💣',
  4: '🚩'
}

const tileStyle = {
  0: 'tile',
  1: 'tile',
  2: 'swept-tile',
  3: 'swept-mine'
}

const content = (tile, threats) =>
  tile === 2 && threats > 0 ? threats : tileContent[tile]

const Tile = ({ tile, threats, pos, reveal }) => (
  <div
    className={tileStyle[tile]}
    onClick={() => reveal(pos)}>
    <span>{content(tile, threats)}</span>
  </div>
)

const mapDispatchToProps = (dispatch) => ({
  reveal: (pos) => dispatch(reveal(pos))
})

const ConnectedTile = connect(undefined, mapDispatchToProps)(Tile)
