import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { configureStore } from './state'
import Minesweeper from './components/Minesweeper'
import { newBoard, buildTile, sweep, isSafe } from './minesweeper'
import './styles/minesweeper.less'
const store = configureStore()

render(
  <Provider store={store}>
    <Minesweeper />
  </Provider>,
  document.getElementById('root')
)