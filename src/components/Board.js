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
    this.updateTile = this.updateTile.bind(this);
    this.gameLogic = this.gameLogic.bind(this);
    this.checkForWin = this.checkForWin.bind(this);
    this.checkForTie = this.checkForTie.bind(this);
    this.checkForWinningPlays = this.checkForWinningPlays.bind(this);
    this.addBorders = this.addBorders.bind(this);
    this.resetBoxes = this.resetBoxes.bind(this);

    this.winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  }

  updateTile(id) {
    // only allow setTiles to execute if 
    // game is on
    if (this.props.gameOn) {

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
                return { ...tile, value: this.props.player1.token, color: this.props.player1.color, border: false, }
              }
              // player2
              else if (this.props.playerTurn === this.props.player2.name) {
                this.props.switchTurn();
                return { ...tile, value: this.props.player2.token, color: this.props.player2.color, border: false, }
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
    let emptyTiles = this.state.boxes.filter(tile => tile.value === null)
    // 
    const didPlayer1Win = this.checkForWin(player1Tiles, this.props.player1);
    const didPlayer2Win = this.checkForWin(player2Tiles, this.props.player2);
    // if a winner is not set, then check for 
    if (this.props.moveCount === 9 && (!didPlayer1Win && !didPlayer2Win)) {
      this.checkForTie(this.state.boxes)
    }
    if (!didPlayer1Win && !didPlayer2Win) {
    this.checkForWinningPlays(this.props.player1, player1Tiles, emptyTiles);
    this.checkForWinningPlays(this.props.player2, player2Tiles, emptyTiles);
    }
  }

  checkForTie() {
    if (this.state.boxes.every(tile => tile.value !== null)) {
      this.props.endGameWithTie(); // winner set to false in case of tie
    }
  }

  checkForWin(playerTiles, player) {
    //const winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

    for (let combo of this.winningCombos) {
      if (combo.every(id => playerTiles.includes(id))) {
        console.log('name: ' + player.name + ' won')
        this.props.endGameWithWin(player); // winner set to the player.name from props
        return true;
      }
    }
    return false;
  }

  // will look at board to see if any open plays will win game
  checkForWinningPlays(player, playerTiles, nullTiles) {
    // return an array of winning plays
    let winningPlays = [];

    // iterate over id's of null tiles
    for (let nullTile of nullTiles) {
      // assign array of a player's possible tiles given empty tile
      let possibleTiles = playerTiles.concat(nullTile.id)
      // iterate over id's of combos
      for (let combo of this.winningCombos) {
        // check if all members of combo are
        // included in possibleTiles
        if (combo.every((tile) => possibleTiles.includes(tile))) {
          // if so, push the nullTile we're on
          winningPlays.push(nullTile);
        }
      }
    }

    if (winningPlays.length > 0) {
      this.addBorders(player, winningPlays);
    }
  }

  // knowing what plays are winners for each player
  // add a border of player.color to winning tiles
  addBorders(player, winningPlays) {
    let winningIds = winningPlays.map(tile => tile.id)

    // check that some of the 
    // winning play tiles needs a border
    // !every true is the same as some false
    // this stops infinite update loop
    if (!winningPlays.every((tile) => tile.border === true) && this.props.gameOn) {

      this.setState({
        boxes: this.state.boxes.map((tile) => {
          if (winningIds.includes(tile.id)) {
            return { ...tile, border: true, color: player.color }
          }
          return tile;
        })
      })
    }
  }

  resetBoxes() { // when called, will also call restartGame in App
    //this.setState({ boxes: tileData })
    this.props.restartGame()
  }

  componentDidUpdate() { // runs after render (which happens after board state changes)
    if (this.props.gameOn && this.props.moveCount > 0) { // logic runs after first move
      this.gameLogic()
    }
  }

  render() {
    console.log('Board boxes: ', this.state.boxes)
    const boxElements = this.state.boxes.map(currentTile => {
      return (
        <Box
          key={currentTile.id}
          border={currentTile.border}
          color={currentTile.color}
          value={currentTile.value}
          updateTile={() => { this.updateTile(currentTile.id) }}
        />
      )
    })

    // resetButton renders when the game is over, there's a winner,
    // and there's no session winner. 
    const resetButton = <button className='resetButton' onClick={this.resetBoxes}>Reset</button>

    return (
      <div>
        <div className="board">
          {boxElements}
        </div>
        {((this.props.gameOn === false && this.props.winner !== null) && !this.props.sessionWinner) && resetButton}
      </div>
    )
  }
}

export default Board