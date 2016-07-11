import React from 'react'
import { render } from 'react-dom'
import Minesweeper from './components/Minesweeper'
import { newBoard, buildTile, sweep, isSafe } from './minesweeper'

const game = newBoard(buildTile)

render(
  <Minesweeper game={game}/>,
  document.getElementById('root')
)