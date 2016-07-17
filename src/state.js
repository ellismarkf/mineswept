import { combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import {
  board,
  sweep,
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

// export const revealMines = () => ({
//   type: 'REVEAL_MINES'
// })

export const endGame = () => ({
  type: 'LOSE_GAME'
})

/* REDUCERS */

const initialState = board()

const minesweeper = (state = initialState, action) => {
  const { rows, cols, mines, tiles, threats, mode } = state
  switch (action.type) {
    case 'TILE_REVEALED':
      const sweptBoard = sweep(action.tile, tiles, threats, cols)
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
        mode: mode | active
      })
    default:
      return state
  }
}

const reducers = combineReducers({ minesweeper })


/* STORE */

export const configureStore = initialState =>
  createStore(reducers, initialState)