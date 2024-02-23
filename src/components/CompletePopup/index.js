import './index.css'

import React from 'react'

const CompletePopup = ({ setIsPopup, newGame }) => {
  const handleClosePopup = () => {
    setIsPopup(false)
  }

  const handleNewGame = () => {
    newGame()
    setIsPopup(false)
  }

  return (
    <div className="popup-container">
      <div className="popup">
        <button className="close-button" type="button" onClick={handleClosePopup}>
          x
        </button>
        <div className="popup-body">
          <p>Sudoku complete!</p>
          <button className="new-game-button" type="button" onClick={handleNewGame}>
            New game
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompletePopup
