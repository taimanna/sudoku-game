import './index.css'

import * as sudokuUtils from '../utils/sudoku'

import { useEffect, useState } from 'react'

const SudokuGrid = () => {
  const [sudokuGrid, setSudokuGrid] = useState([])
  const [solvedGrid, setSolvedGrid] = useState([])

  const renderCell = (cell) => {
    return cell === '.' ? '' : cell
  }

  const renderRow = (row, rowIndex) => {
    return (
      <tbody key={rowIndex}>
        <tr>
          {row.map((cell, colIndex) => {
            return <td key={colIndex}>{renderCell(cell)}</td>
          })}
        </tr>
      </tbody>
    )
  }

  const handleChangeDiff = (e) => {
    // TODO: generate Sudoku
    const selectedDiff = e.target.value
    const stringSudoku = sudokuUtils.sudoku.generate(selectedDiff)
    const arrSudoku = sudokuUtils.sudoku.board_string_to_grid(stringSudoku)

    setSudokuGrid(arrSudoku)
  }

  useEffect(() => {
    const stringSudoku = sudokuUtils.sudoku.generate('easy')
    const arrSudoku = sudokuUtils.sudoku.board_string_to_grid(stringSudoku)
    const stringSolved = sudokuUtils.sudoku.solve(stringSudoku)
    const arrSolved = sudokuUtils.sudoku.board_string_to_grid(stringSolved)
    setSudokuGrid(arrSudoku)
    setSolvedGrid(arrSolved)
  }, [])

  return (
    <>
      <select name="difficult" defaultValue="easy" id="difficult" onChange={handleChangeDiff}>
        <option value="easy">Easy</option>
        <option value="normal">Normal</option>
        <option value="hard">Hard</option>
      </select>
      <table id="sudoku-table">
        {sudokuGrid.map((row, rowIndex) => {
          return renderRow(row, rowIndex)
        })}
      </table>

      <table id="sudoku-table">
        {solvedGrid.map((row, rowIndex) => {
          return renderRow(row, rowIndex)
        })}
      </table>
    </>
  )
}

export default SudokuGrid
