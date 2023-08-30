// class component for board,
// defines game logic

import React from 'react'
import tileData from '../data/tileData'
import Box from './Box'

// Props: setWinner, switchTurn, gameOn, player1, player2, playerTurn, winner


class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boxes: tileData,
    }
    this.updateGame = this.updateGame.bind(this);
    this.gameLogic = this.gameLogic.bind(this);
    this.checkForWin = this.checkForWin.bind(this);
    this.checkForTie = this.checkForTie.bind(this);
    this.resetBoxes = this.resetBoxes.bind(this);
  }




  updateGame(id) {
    // only allow setTiles to execute if 
    // game is on
    if (this.props.gameOn) {
      //console.log(id, this.state.boxes[id].value);
      //console.log(this.props.player1.name, this.props.playerTurn, this.props.player1.token)

      this.setState(
        // returns new mapped tiles state with
        // proper character added
        {
          boxes: this.state.boxes.map((tile) => {
            // only valid squares will have value of null in state
            if (tile.id === id && tile.value === null) {
              // player1
              if (this.props.playerTurn === this.props.player1.name) {
                this.props.switchTurn(); // run switch turn on valid move
                return { ...tile, value: this.props.player1.token }
              }
              // player2
              else if (this.props.playerTurn === this.props.player2.name) {
                this.props.switchTurn();
                return { ...tile, value: this.props.player2.token }
              }
            }
            return tile // don't change the tile if none of above applies
          })
        })
    }
  }

  /*
  game logic needs to:
  1) register win => set winner to name of winner
  2) register tie => set winner to false?
  */

  gameLogic() {
    const player1Tiles = this.state.boxes.filter(tile => tile.value === this.props.player1.token).map(tile => tile.id);
    const player2Tiles = this.state.boxes.filter(tile => tile.value === this.props.player2.token).map(tile => tile.id);
    // 
    const didPlayer1Win = this.checkForWin(player1Tiles, this.props.player1);
    const didPlayer2Win = this.checkForWin(player2Tiles, this.props.player2);
    // if a winner is not set, then check for 
    if (this.props.moveCount === 9 && (!didPlayer1Win && !didPlayer2Win)) { 
      this.checkForTie(this.state.boxes)
    }
  }

  checkForTie() {
    if (this.state.boxes.every(tile => tile.value !== null)) {
      this.props.endGameWithTie(); // winner set to false in case of tie
    }
  }

  checkForWin(playerTiles, player) {
    const winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

    for (let combo of winningCombos) {
      if (combo.every(id => playerTiles.includes(id))) {
        console.log('name: '+ player.name + ' won')
        this.props.endGameWithWin(player); // winner set to the player.name from props
        return true;
      }
    }
    return false;
  }

  resetBoxes() { // when called, will also call restartGame in App
    this.setState({ boxes: tileData })
    this.props.restartGame()
  }

  componentDidUpdate() { // runs after render (which happens after board state changes)
    if (this.props.gameOn && this.props.moveCount > 0) { // logic runs after first move
      this.gameLogic()
    }
  }

  render() {
    console.log('Tiles: ',this.state.boxes)
    const boxElements = this.state.boxes.map(currentTile => {
      return (
        <Box
          key={currentTile.id}
          value={currentTile.value}
          updateGame={() => { this.updateGame(currentTile.id) }}
        />
      )
    })

    // resetButton renders when the game is over, there's a winner,
    // and there's no session winner. 
    const resetButton = <button onClick={this.resetBoxes}>Reset</button>

    return (
      <div>
        {((this.props.gameOn === false && this.props.winner !== null) && !this.props.sessionWinner) && resetButton}
        <div className="board">
          {boxElements}
        </div>
      </div>
    )
  }
}

export default Board