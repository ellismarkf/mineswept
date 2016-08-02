import { combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import {
  board,
  sweep,
  s,
  safe,
  revealMines,
  playing,
  editing,
  active,
  won,
  lost } from './minesweeper'

/* ACTIONS */

export const reveal = (tile) => ({
  type: 'TILE_REVEALED',
  tile
})

export const setToPlayMode = () => ({
  type: 'MODE_SET_TO_PLAY'
})

export const activateGame = () => ({
  type: 'GAME_ACTIVATED'
})

// export const endGame = () => ({
//   type: 'LOSE_GAME'
// })

/* REDUCERS */

const initialState = board(50, 50, 40)

const minesweeper = (state = initialState, action) => {
  const { rows, cols, mines, tiles, threats, mode, game } = state
  switch (action.type) {
    case 'TILE_REVEALED':
      const sweptBoard = s(action.tile, tiles, threats, cols)
      const isSafe = safe(sweptBoard)
      const isActive = mode & (playing | active)
      return Object.assign({}, state, {
        tiles: sweptBoard,

      })
    case 'MODE_SET_TO_PLAY':
      return Object.assign({}, state, {
        mode: mode | playing
      })
    case 'GAME_ACTIVATED':
      return Object.assign({}, state, {
        game: game | active
      })
    default:
      return state
  }
}

const reducers = combineReducers({ minesweeper })


/* STORE */

export const configureStore = initialState =>
  createStore(reducers, initialState, window.devToolsExtension && window.devToolsExtension())