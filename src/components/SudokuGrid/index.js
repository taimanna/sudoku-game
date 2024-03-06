import './index.css'

import * as sudokuUtils from '../../utils/sudoku'

import { useCallback, useEffect, useState } from 'react'

import CompletePopup from '../CompletePopup'
import NewGamePopup from '../NewGamePopup'

const SudokuGrid = () => {
  const [originalGrid, setOriginalGrid] = useState([])
  const [sudokuGrid, setSudokuGrid] = useState([])
  const [solvedGrid, setSolvedGrid] = useState([])
  const [difficult, setDifficult] = useState('easy')
  const [prevNumpadCell, setPrevNumpadCell] = useState()
  const [wrongCellPosition, setWrongCellPosition] = useState([])
  const [selectedNumber, setSelectedNumber] = useState(null)
  const [isCompletePopup, setIsCompletePopup] = useState(false)
  const [isNewGamePopup, setIsNewGamePopup] = useState(false)
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
                {cell === '.' ? (
                  <div className="candidate-container">
                    {numpad.map((row, rowIndex) => {
                      return (
                        <div className="candidate" key={rowIndex}>
                          {row.map((cell, colIndex) => {
                            return (
                              <div
                                className="candidate-cell opacity-none"
                                key={colIndex}
                                data-candidate={cell}
                                onClick={handleChangeCandidate}
                              >
                                {cell}
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  cell
                )}
              </td>
            )
          })}
        </tr>
      </tbody>
    )
  }

  const handleChangeCandidate = (e) => {
    e.target.classList.toggle('opacity-full')
  }

  const handleChangeDifficult = (e) => {
    const selectedDifficult = e.target.value
    setDifficult(selectedDifficult)
  }

  const resetCandidates = () => {
    // reset old candidate
    const candidateTag = document.querySelectorAll('div[data-candidate]')
    candidateTag.forEach((tag) => {
      tag.classList.remove('opacity-full')
    })
  }

  const getCandidates = () => {
    const candidateCheckbox = document.getElementById('candidate')

    if (candidateCheckbox.checked) {
      const stringGrid = sudokuUtils.sudoku.board_grid_to_string(sudokuGrid)
      const candidatesFromUtils = sudokuUtils.sudoku.get_candidates(stringGrid)
      const tdTags = document.querySelectorAll('.sudoku-table td:not(.original-cell) .candidate-container')

      if (candidatesFromUtils) {
        const flatSudokuGrid = sudokuGrid.flat(Infinity)
        const flatCandidates = candidatesFromUtils.flat(Infinity)
        const candidates = flatCandidates.filter((value, i) => value !== flatSudokuGrid[i])

        // reset candidate
        resetCandidates()

        // auto fill candidate to sudoku grid
        candidates.forEach((candidateString, i) => {
          const candidateArr = candidateString.split('')
          candidateArr.forEach((candidate) => {
            tdTags[i].querySelector(`div[data-candidate="${candidate}"]`).classList.add('opacity-full')
          })
        })
      }
    } else {
      // reset candidate
      resetCandidates()
    }
  }

  const handleClickNumpadCell = (e) => {
    const target = e.target ? e.target : e

    if (prevNumpadCell) {
      if (prevNumpadCell === target) {
        target.classList.toggle('selected-cell')
      } else {
        prevNumpadCell.classList.remove('selected-cell')
        target.classList.add('selected-cell')
      }
    } else {
      target.classList.add('selected-cell')
    }
    setPrevNumpadCell(target)

    if (target.classList.contains('selected-cell')) {
      if (target.innerText === 'X') {
        setSelectedNumber('.')
      } else {
        setSelectedNumber(target.innerText)
      }
    } else {
      setSelectedNumber('')
    }
  }

  const handleClickSudokuGridCell = (e) => {
    const currentTarget = e.target.nodeName === 'TD' ? e.target : e.target.parentNode.parentNode.parentNode
    const isOriginalCell = currentTarget.classList.contains('original-cell')
    if (selectedNumber && !isOriginalCell) {
      const positionX = currentTarget.dataset.positionX
      const positionY = currentTarget.dataset.positionY
      const updateSudokuGrid = [...sudokuGrid]
      updateSudokuGrid[positionX][positionY] = selectedNumber

      setSudokuGrid(updateSudokuGrid)
    }
  }

  const compareResult = useCallback(() => {
    const flatSudokuGrid = sudokuGrid.flat(Infinity)
    const flatSolvedGrid = solvedGrid.flat(Infinity)

    if (flatSudokuGrid.length !== 0) {
      const positions = []
      for (let i = 0; i < 81; i++) {
        if (flatSudokuGrid[i] !== flatSolvedGrid[i]) {
          positions.push(i)
        }
      }

      if (positions.length === 0) {
        setIsCompletePopup(true)
      }
      setWrongCellPosition(positions)
    }
  }, [sudokuGrid, solvedGrid])

  const checkCompletedSudoku = () => {
    if (wrongCellPosition.length) {
      const tdTags = document.querySelectorAll('.sudoku-table td')

      wrongCellPosition.forEach((position) => {
        tdTags[position].classList.add('wrong-cell')
      })
    } else {
      setIsCompletePopup(true)
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

    // reset candidate
    resetCandidates()

    const originalGridPosition = []
    arrSudoku.flat(Infinity).forEach((value, i) => {
      if (value !== '.') {
        originalGridPosition.push(i)
      }
    })
    setOriginalGrid(originalGridPosition)

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

  useEffect(() => {
    const tdTags = document.querySelectorAll('.sudoku-table td')

    tdTags.forEach((tag) => {
      tag.classList.remove('original-cell')
    })

    originalGrid.forEach((index) => {
      tdTags[index].classList.add('original-cell')
    })
  }, [originalGrid])

  return (
    <div className="sudoku-container">
      <div className="sudoku-grid">
        <label>Select difficult:</label>
        <select className="difficult" title="Difficult" defaultValue="easy" onChange={handleChangeDifficult}>
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
          <div className="numpad-container">
            <table className="numpad">
              <tbody>
                <tr>
                  <td colSpan={3} onClick={handleClickNumpadCell}>
                    x
                  </td>
                </tr>
                {numpad.map((row, rowIndex) => {
                  return (
                    <tr key={rowIndex}>
                      {row.map((cell, colIndex) => {
                        return (
                          <td key={colIndex} onClick={handleClickNumpadCell}>
                            {cell}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="option">
            <button
              className="template-button"
              type="button"
              onMouseDown={checkCompletedSudoku}
              onMouseUp={stopCheckCompletedSudoku}
            >
              Check
            </button>
            <button
              className="template-button"
              type="button"
              onClick={() => {
                setIsNewGamePopup(true)
              }}
            >
              New game
            </button>
          </div>

          <div className="candidate-button">
            <input
              className="candidate-checkbox"
              type="checkbox"
              name="candidate"
              id="candidate"
              onChange={getCandidates}
            />
            <label htmlFor="candidate">Auto Candidate Mode</label>
          </div>
        </div>
      </div>
      {isCompletePopup && <CompletePopup setIsCompletePopup={setIsCompletePopup} newGame={newGame} />}
      {isNewGamePopup && <NewGamePopup setIsNewGamePopup={setIsNewGamePopup} newGame={newGame} />}
    </div>
  )
}

export default SudokuGrid
