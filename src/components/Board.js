// class component for board,
// defines game logic

import React from 'react'
import tileData from '../data/tileData'
import Box from './Box'
import _ from 'underscore'

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boxes: tileData,
    }

    // game functionality
    this.updateTile = this.updateTile.bind(this);
    this.gameLogic = this.gameLogic.bind(this);
    this.checkForWin = this.checkForWin.bind(this);
    this.checkForWinningPlays = this.checkForWinningPlays.bind(this);
    this.resetBoxes = this.resetBoxes.bind(this);

    // board styling functions
    this.addBackgroundColorToStyles = this.addBackgroundColorToStyles.bind(this);
    this.addBackgroundImageToStyles = this.addBackgroundImageToStyles.bind(this);
    this.addColorToStyles = this.addColorToStyles.bind(this);
    this.updateBoardStyleForWin = this.updateBoardStyleForWin.bind(this);

    // constant(s)
    this.winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  }

  // This function is sent to each box as prop in 
  // reference to its box.id. It switches the value of 
  // the clicked box to a player token depending
  // on the playerTurn prop
  updateTile(id) {
    // only allow setTiles to execute if game is on
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
                // run switch turn on valid move only,
                // then return switched tile
                this.props.switchTurn();
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

  // Executes after each rerender from
  // componentDidUpdate to test for
  // wins/tie and add board styling after each 
  // play
  gameLogic() {
    // declare variables used to run game logic, style board
    const player1Tiles = this.state.boxes.filter(tile => tile.value === this.props.player1.token).map(tile => tile.id);
    const player2Tiles = this.state.boxes.filter(tile => tile.value === this.props.player2.token).map(tile => tile.id);
    const emptyTiles = this.state.boxes.filter(tile => tile.value === null).map(tile => tile.id);

    // WIN LOGIC:
    // check if either player won; if so, will endWithWin in app
    const didPlayer1Win = this.checkForWin(player1Tiles, this.props.player1);
    const didPlayer2Win = this.checkForWin(player2Tiles, this.props.player2);

    // TIE LOGIC:
    if (
      (this.props.moveCount === 9 && // if 1) we hit 9 moves
        (!didPlayer1Win && !didPlayer2Win)) && // and 2) a winner is not set,
      this.state.boxes.every(tile => tile.value !== null) // and 3) all boxes are non-null values
    ) {
      this.props.endGameWithTie() // then endWithTie executes in App.js
    }

    // STYLE BOARD
    // if no winner and no tie, update board with new style
    // to show winning plays and add text color to selected tiles
    if (!didPlayer1Win && !didPlayer2Win) {
      this.addStyleToBoard(player1Tiles, player2Tiles, emptyTiles);
    }
  }

  // Refers to winning combos, checks if
  // all numbers in single combo are present in
  // a player's selected tiles
  checkForWin(playerTiles, player) {
    for (let combo of this.winningCombos) {
      if (combo.every(id => playerTiles.includes(id))) {
        console.log('name: ' + player.name + ' won')
        this.updateBoardStyleForWin() // after win, erase backgrounds of potential winning boxes
        this.props.endGameWithWin(player); // winner set to the player.name from props
        return true;
      }
    }
    return false;
  }

  // Maps over previous boxes state
  // to erase backgrounds and add color
  // to the winning box.
  updateBoardStyleForWin() {
    this.setState(prevState => {
      return {
        boxes: prevState.boxes.map((box) => {
          if (box.styles === null || box.styles.color) {
            return box
          }
          // player1 winning placements
          if (box.styles.background) {
            if (box.value === this.props.player1.token) {
              return { ...box, styles: { color: this.props.player1.color } }
            }
            // player2 winning placements
            if (box.value === this.props.player2.token) {
              return { ...box, styles: { color: this.props.player2.color } }
            }
            // all other potential wins where value === null
            if (box.value === null) {
              return { ...box, styles: null, }
            }
          }
          else { return box }
        })
      }
    })

  }

  // Routing function that aggregates
  // which boxes are potential winners,
  // accounting for boxes that are winners
  // for both.
  addStyleToBoard(player1Tiles, player2Tiles, emptyTiles) {
    let player1Winners = this.checkForWinningPlays(player1Tiles, emptyTiles);
    let player2Winners = this.checkForWinningPlays(player2Tiles, emptyTiles);

    // THIS VARIABLE TRACKS WHICH BOXES ARE WINNERS
    // FOR BOTH PLAYERS; THESE GET A GRADIENT BACKGROUND
    let bothWinners = _.intersection(player1Winners, player2Winners);

    // these boxes get solid backgrounds
    let onlyPlayer1Winners = _.difference(player1Winners, bothWinners);
    let onlyPlayer2Winners = _.difference(player2Winners, bothWinners);

    // add color prop to give font color to selected tiles
    this.addColorToStyles(player1Tiles, player2Tiles);

    // add background color to winning tiles
    if (onlyPlayer1Winners || onlyPlayer2Winners)
      this.addBackgroundColorToStyles(onlyPlayer1Winners, onlyPlayer2Winners);

    // add background image (gradient) to bothWinners
    if (bothWinners.length > 0)
      this.addBackgroundImageToStyles(bothWinners);

  }

  // Maps over state's boxes to reassign color property in
  // style prop as needed
  addColorToStyles(player1Tiles, player2Tiles) {
    // all selected boxes will have a non-null
    // value property
    let selectedBoxes = this.state.boxes.filter((box) => {
      return box.value !== null;
    })

    // this boolean provides condition to stop
    // infinite looping; looks at every
    // box in selectedBoxes (ie, those that have
    // a non-null value) to check for proper styling
    let allSelectedBoxesHaveColorStyles = selectedBoxes.every((box) => {
      if (box.styles === null) {
        return false;
      }
      else if (box.styles.color === this.props.player2.color || box.styles.color === this.props.player1.color) {
        return true;
      }
    })

    // If not every selected box is properly
    // styled, set the state of the boxes
    if (!allSelectedBoxesHaveColorStyles) {
      this.setState({
        boxes: this.state.boxes.map((box) => {
          if (player1Tiles.includes(box.id)) {
            return { ...box, styles: { color: this.props.player1.color } }
          }
          else if (player2Tiles.includes(box.id)) {
            return { ...box, styles: { color: this.props.player2.color } }
          }
          else { return box }
        })
      })
    }
  };

  addBackgroundColorToStyles(onlyPlayer1Winners, onlyPlayer2Winners) {

    let winningBoxes = this.state.boxes.filter((box) => {
      return (onlyPlayer1Winners.includes(box.id) || onlyPlayer2Winners.includes(box.id))
    })

    let allWinningBoxesHaveSolidBackground = winningBoxes.every((box) => {
      if (box.styles === null) { // if there's no styles defined yet. winning boxes will have no value, so no styles
        return false;
      }
      else if (box.styles.background === this.props.player1.color || box.styles.background === this.props.player2.color) {
        return true;
      }
    })

    if (!allWinningBoxesHaveSolidBackground) {
      this.setState({
        boxes: this.state.boxes.map((box) => {
          if (onlyPlayer1Winners.includes(box.id)) {
            return { ...box, styles: { background: this.props.player1.color } }
          }
          else if (onlyPlayer2Winners.includes(box.id)) {
            return { ...box, styles: { background: this.props.player2.color } }
          } else { return box }


        })
      })
    }

  };

  addBackgroundImageToStyles(bothWinners) {
    const bothWinningBoxes = this.state.boxes.filter((box) => {
      return bothWinners.includes(box.id);
    })

    const allBothWinningBoxesHaveGradientBackground = bothWinningBoxes.every((box) => {
      console.log('here', box.styles.background)
      if (box.styles.background === this.props.player2.color || box.styles.background === this.props.player1.color) {
        return false;
      }
      else if (box.styles.background === `linear-gradient(${this.props.player1.color},${this.props.player2.color})`) {
        return true;
      }
    })


    console.log('bothWinningBoxes', bothWinningBoxes, 'allBoth', allBothWinningBoxesHaveGradientBackground,)
    if (!allBothWinningBoxesHaveGradientBackground) {
      console.log('where set State should happen', bothWinners, 'boxes', this.state.boxes)
      this.setState({
        boxes: this.state.boxes.map((box) => {
          if (bothWinners.includes(box.id)) {
            return { ...box, styles: { background: `linear-gradient(${this.props.player1.color},${this.props.player2.color})` } }
          } else { return box }
        })
      })
    }


  };

  // will look at board to see if any open plays will win game
  checkForWinningPlays(playerTiles, emptyTiles) {
    // return an object of winning plays
    let winningPlays = [];

    // iterate over id's of null tiles
    for (let emptyTile of emptyTiles) {
      // assign array of a player's possible tiles given empty tile
      let possibleTiles = playerTiles.concat(emptyTile)
      // iterate over id's of combos
      for (let combo of this.winningCombos) {
        // check if all members of combo are
        // included in possibleTiles
        if (combo.every((tile) => possibleTiles.includes(tile))) {
          // if so, push the nullTile we're on
          winningPlays.push(emptyTile);
        }
      }
    }
    return winningPlays
  }

  resetBoxes() { // when called, calls restartGame in App
    this.props.restartGame()
  }


  // runs after render (which happens after board state changes)
  componentDidUpdate() {
    if (this.props.gameOn && this.props.moveCount > 0) { // logic runs after first move
      this.gameLogic()
    }
  }

  render() {
    const boxElements = this.state.boxes.map(currentTile => {
      return (
        <Box
          key={currentTile.id}
          value={currentTile.value}
          styles={currentTile.styles}
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