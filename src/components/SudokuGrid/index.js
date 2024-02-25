import './index.css'

import * as sudokuUtils from '../../utils/sudoku'

import { useCallback, useEffect, useState } from 'react'

import CompletePopup from '../CompletePopup'

const SudokuGrid = () => {
  const [originalGrid, setOriginalGrid] = useState([])
  const [sudokuGrid, setSudokuGrid] = useState([])
  const [solvedGrid, setSolvedGrid] = useState([])
  const [difficult, setDifficult] = useState('easy')
  const [prevNumpadCell, setPrevNumpadCell] = useState()
  const [wrongCellPosition, setWrongCellPosition] = useState([])
  const [selectedNumber, setSelectedNumber] = useState(null)
  const [isPopup, setIsPopup] = useState(false)
  const [isAutoCandidate, setIsAutoCandidate] = useState(false)
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

  const getCandidates = () => {
    const stringGrid = sudokuUtils.sudoku.board_grid_to_string(sudokuGrid)
    const candidatesFromUtils = sudokuUtils.sudoku.get_candidates(stringGrid)
    const tdTags = document.querySelectorAll('.sudoku-table td:not(.original-cell) .candidate-container')

    if (candidatesFromUtils) {
      const flatSudokuGrid = sudokuGrid.flat(Infinity)
      const flatCandidates = candidatesFromUtils.flat(Infinity)
      const candidates = flatCandidates.filter((value, i) => value !== flatSudokuGrid[i])

      // reset old candidate
      const candidateTag = document.querySelectorAll('div[data-candidate]')
      candidateTag.forEach((tag) => {
        tag.classList.remove('opacity-full')
      })

      // auto fill candidate to sudoku grid
      candidates.forEach((candidateString, i) => {
        const candidateArr = candidateString.split('')
        candidateArr.forEach((candidate) => {
          tdTags[i].querySelector(`div[data-candidate="${candidate}"]`).classList.add('opacity-full')
        })
      })
    }
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
    e.target.classList.contains('selected-cell') ? setSelectedNumber(e.target.innerText) : setSelectedNumber('')
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
        setIsPopup(true)
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
          <button type="button" onMouseDown={checkCompletedSudoku} onMouseUp={stopCheckCompletedSudoku}>
            Check
          </button>
          <button type="button" onClick={getCandidates}>
            Auto Candidate Mode
          </button>
          <button type="button" onClick={newGame}>
            New game
          </button>
        </div>
        <div className="numpad-container">
          <table className="numpad">
            {numpad.map((row, rowIndex) => {
              return (
                <tbody key={rowIndex}>
                  <tr>
                    {row.map((cell, colIndex) => {
                      return (
                        <td key={colIndex} onClick={handleClickNumpadCell}>
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
