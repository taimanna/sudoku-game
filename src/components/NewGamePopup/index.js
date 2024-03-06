import './index.css'

import React from 'react'

const NewGamePopup = ({ setIsNewGamePopup, newGame }) => {
  const handleClosePopup = () => {
    setIsNewGamePopup(false)
  }

  const handleNewGame = () => {
    newGame()
    setIsNewGamePopup(false)
  }

  return (
    <div className="popup-container">
      <div className="popup">
        <button className="close-button" type="button" onClick={handleClosePopup}>
          x
        </button>
        <div className="popup-body">
          <p>Creat a new game?</p>
          <button className="new-game-button" type="button" onClick={handleNewGame}>
            Yes!
          </button>
          <button className="new-game-button" type="button" onClick={handleClosePopup}>
            No
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewGamePopup
