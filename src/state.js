import { combineReducers, createStore } from 'redux'
import { newBoard, buildTile, sweep, isSafe, generateTiles } from './minesweeper'

/* ACTIONS */

export const update = (tiles) => ({
  type: 'UPDATE',
  tiles
})


/* REDUCERS */

const initialState = newBoard(buildTile)

const minesweeper = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state
  }
}

const reducers = combineReducers({ minesweeper })


/* STORE */

export const configureStore = initialState =>
  createStore(reducers, initialState)