import './index.css'

import * as sudokuUtils from '../utils/sudoku'

import { useCallback, useEffect, useState } from 'react'

const SudokuGrid = () => {
  const [sudokuGrid, setSudokuGrid] = useState([])
  const [sudokuString, setSudokuString] = useState('')
  const [solvedGrid, setSolvedGrid] = useState([])
  const [prevNumpadCell, setPrevNumpadCell] = useState()
  const [wrongCellPosition, setWrongCellPosition] = useState([])
  const [selectedNumber, setSelectedNumber] = useState(null)
  const numpad = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
  ]

  const renderRow = (row, rowIndex) => {
    return (
      <tbody key={rowIndex}>
        <tr>
          {row.map((cell, colIndex) => {
            return (
              <td
                data-position-x={rowIndex}
                data-position-y={colIndex}
                key={colIndex}
                onClick={handleClickSudokuGridCell}
              >
                {cell === '.' ? undefined : cell}
              </td>
            )
          })}
        </tr>
      </tbody>
    )
  }

  const handleChangeDifficult = (e) => {
    // TODO: generate Sudoku
    const selectedDifficult = e.target.value
    const stringSudoku = sudokuUtils.sudoku.generate(selectedDifficult)
    const arrSudoku = sudokuUtils.sudoku.board_string_to_grid(stringSudoku)
    setSudokuGrid(arrSudoku)
    setSudokuString(stringSudoku)

    const stringSolved = sudokuUtils.sudoku.solve(stringSudoku)
    const arrSolved = sudokuUtils.sudoku.board_string_to_grid(stringSolved)
    setSolvedGrid(arrSolved)
  }

  const handleClickNumpadCell = (e) => {
    if (prevNumpadCell) {
      if (prevNumpadCell === e.target) {
        e.target.classList.toggle('selected-cell')
      } else {
        prevNumpadCell.classList.remove('selected-cell')
        e.target.classList.add('selected-cell')
      }
    } else {
      e.target.classList.add('selected-cell')
    }
    setPrevNumpadCell(e.target)
    setSelectedNumber(e.target.innerText)
  }

  const handleClickSudokuGridCell = (e) => {
    if (selectedNumber) {
      const positionX = e.target.dataset.positionX
      const positionY = e.target.dataset.positionY
      const updateSudokuGrid = [...sudokuGrid]
      updateSudokuGrid[positionX][positionY] = selectedNumber

      setSudokuGrid(updateSudokuGrid)
      setSudokuString(sudokuUtils.sudoku.board_grid_to_string(updateSudokuGrid))
    }
  }

  const compareResult = useCallback(() => {
    const flatSudokuGrid = sudokuGrid.flat(Infinity)
    const flatSolvedGrid = solvedGrid.flat(Infinity)
    const positions = []
    for (let i = 0; i < 81; i++) {
      if (flatSudokuGrid[i] !== flatSolvedGrid[i]) {
        positions.push(i)
      }
    }

    setWrongCellPosition(positions)
  }, [sudokuGrid, solvedGrid])

  const checkCompletedSudoku = () => {
    const tdTags = document.querySelectorAll('.sudoku-table td')

    wrongCellPosition.forEach((position) => {
      tdTags[position].classList.add('wrong-cell')
    })
  }

  const stopCheckCompletedSudoku = () => {
    const tdTags = document.querySelectorAll('.sudoku-table td')
    wrongCellPosition.forEach((position) => {
      tdTags[position].classList.remove('wrong-cell')
    })
  }

  useEffect(() => {
    const stringSudoku = sudokuUtils.sudoku.generate('easy')
    const arrSudoku = sudokuUtils.sudoku.board_string_to_grid(stringSudoku)
    setSudokuGrid(arrSudoku)
    setSudokuString(stringSudoku)

    const stringSolved = sudokuUtils.sudoku.solve(stringSudoku)
    const arrSolved = sudokuUtils.sudoku.board_string_to_grid(stringSolved)
    setSolvedGrid(arrSolved)
  }, [])

  useEffect(() => {
    compareResult()
  }, [compareResult])

  return (
    <div className="sudoku-container">
      <div className="sudoku-grid">
        <select className="difficult" defaultValue="easy" onChange={handleChangeDifficult}>
          <option className="difficult-option" value="easy">
            Easy
          </option>
          <option className="difficult-option" value="normal">
            Normal
          </option>
          <option className="difficult-option" value="hard">
            Hard
          </option>
        </select>
        <table className="sudoku-table">
          {sudokuGrid.map((row, rowIndex) => {
            return renderRow(row, rowIndex)
          })}
        </table>
      </div>
      <div className="option-container">
        <div className="option-button">
          <button type="button" onMouseDown={checkCompletedSudoku} onMouseUp={stopCheckCompletedSudoku}>
            Check
          </button>
        </div>
        <div className="numpad-container">
          <table className="numpad">
            {numpad.map((row, rowIndex) => {
              return (
                <tbody key={'numpad' + rowIndex}>
                  <tr>
                    {row.map((cell, colIndex) => {
                      return (
                        <td key={'numpad' + colIndex} onClick={handleClickNumpadCell}>
                          {cell === '.' ? undefined : cell}
                        </td>
                      )
                    })}
                  </tr>
                </tbody>
              )
            })}
          </table>
        </div>
      </div>
    </div>
  )
}

export default SudokuGrid
