import { combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import {
  newBoard,
  buildTile,
  sweep,
  isSafe,
  revealMinePositions } from './minesweeper'

/* ACTIONS */

export const reveal = (tile) => ({
  type: 'REVEAL_TILE',
  tile
})

export const revealMines = () => ({
  type: 'REVEAL_MINES'
})

export const endGame = () => ({
  type: 'END_GAME'
})

/* REDUCERS */

const initialState = Object.assign({}, newBoard(buildTile), {
  active: false
})

const minesweeper = (state = initialState, action) => {
  switch (action.type) {
    case 'REVEAL_TILE':
      return Object.assign({}, state, {
        tiles: sweep(action.tile, state.tiles, state.cols)
      })
    case 'REVEAL_MINES':
      return Object.assign({}, state, {
        tiles: revealMinePositions(state.tiles)
      })
    default:
      return state
  }
}

const reducers = combineReducers({ minesweeper })


/* STORE */

export const configureStore = initialState =>
  createStore(reducers, initialState)