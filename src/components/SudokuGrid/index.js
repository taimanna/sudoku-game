import './index.css'

import * as sudokuUtils from '../../utils/sudoku'

import { useCallback, useEffect, useState } from 'react'

import CompletePopup from '../CompletePopup'

const SudokuGrid = () => {
  const [sudokuGrid, setSudokuGrid] = useState([])
  const [solvedGrid, setSolvedGrid] = useState([])
  const [difficult, setDifficult] = useState('easy')
  const [prevNumpadCell, setPrevNumpadCell] = useState()
  const [wrongCellPosition, setWrongCellPosition] = useState([])
  const [selectedNumber, setSelectedNumber] = useState(null)
  const [isPopup, setIsPopup] = useState(false)
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
    const selectedDifficult = e.target.value
    setDifficult(selectedDifficult)
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
    if (wrongCellPosition.length) {
      const tdTags = document.querySelectorAll('.sudoku-table td')

      wrongCellPosition.forEach((position) => {
        tdTags[position].classList.add('wrong-cell')
      })
    } else {
      setIsPopup(true)
    }
  }

  const stopCheckCompletedSudoku = () => {
    if (wrongCellPosition.length) {
      const tdTags = document.querySelectorAll('.sudoku-table td')
      wrongCellPosition.forEach((position) => {
        tdTags[position].classList.remove('wrong-cell')
      })
    }
  }

  const newGame = useCallback(() => {
    const stringSudoku = sudokuUtils.sudoku.generate(difficult)
    const arrSudoku = sudokuUtils.sudoku.board_string_to_grid(stringSudoku)
    setSudokuGrid(arrSudoku)

    const stringSolved = sudokuUtils.sudoku.solve(stringSudoku)
    const arrSolved = sudokuUtils.sudoku.board_string_to_grid(stringSolved)
    setSolvedGrid(arrSolved)
  }, [difficult])

  useEffect(() => {
    newGame()
  }, [newGame])

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
      {isPopup && <CompletePopup setIsPopup={setIsPopup} newGame={newGame} />}
    </div>
  )
}

export default SudokuGrid
