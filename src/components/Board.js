// class component for board,
// defines game logic

import React from 'react'
import tileData from '../data/tileData'
import Box from './Box'
import _ from 'underscore'

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
    // this.addHighlights = this.addHighlights.bind(this);
    this.resetBoxes = this.resetBoxes.bind(this);

    this.addBackgroundColorToStyles = this.addBackgroundColorToStyles.bind(this);
    this.addBackgroundImageToStyles = this.addBackgroundImageToStyles.bind(this);
    this.addColorToStyles = this.addColorToStyles.bind(this);

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
    let emptyTiles = this.state.boxes.filter(tile => tile.value === null).map(tile => tile.id);

    // check if either player won; if so, will endWithWin in app
    const didPlayer1Win = this.checkForWin(player1Tiles, this.props.player1);
    const didPlayer2Win = this.checkForWin(player2Tiles, this.props.player2);

    // if a winner is not set, then check for tie; if so, will endWithTie in app
    if (this.props.moveCount === 9 && (!didPlayer1Win && !didPlayer2Win)) {
      this.checkForTie(this.state.boxes)
    }

    // if no winner and no tie,
    // update board with new style
    // to show winning plays and add color to
    // selected tiles
    if (!didPlayer1Win && !didPlayer2Win) {
      this.addStyleToBoard(player1Tiles, player2Tiles, emptyTiles);
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

  addStyleToBoard(player1Tiles, player2Tiles, emptyTiles) {
    let player1Winners = this.checkForWinningPlays(player1Tiles, emptyTiles);
    let player2Winners = this.checkForWinningPlays(player2Tiles, emptyTiles);
    let bothWinners = _.intersection(player1Winners, player2Winners);
    let onlyPlayer1Winners = _.difference(player1Winners, bothWinners);
    let onlyPlayer2Winners = _.difference(player2Winners, bothWinners);

    //console.log('p1', player1Tiles, 'p1winners', onlyPlayer1Winners, 'p2', player2Tiles, 'p2winners', onlyPlayer2Winners, 'both', bothWinners)

    // add color prop to give font color to selected tiles
    this.addColorToStyles(player1Tiles, player2Tiles);

    // add background color to winning tiles
    if (onlyPlayer1Winners || onlyPlayer2Winners)
      this.addBackgroundColorToStyles(onlyPlayer1Winners, onlyPlayer2Winners);

    // add background image (gradient) to bothWinners
    if (bothWinners.length > 0)
      this.addBackgroundImageToStyles(bothWinners);

  }

  addColorToStyles(player1Tiles, player2Tiles) {
    // all selected boxes will have a non-null
    // value property
    let selectedBoxes = this.state.boxes.filter((box) => {
      return box.value !== null;
    })

    // this boolean will provide condition to stop
    // infinite looping
    // look at every box in selectedBoxes (ie, those that have
    // a non-null value). 
    let allSelectedBoxesHaveColorStyles = selectedBoxes.every((box) => {
      if (box.styles === null) {
        return false;
      }
      else if (box.styles.color === this.props.player2.color || box.styles.color === this.props.player1.color) {
        return true;
      }
    })

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
      if (box.styles === null){ // if there's no styles defined yet. winning boxes will have no value, so no styles
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
      else if (box.styles.background === `linear-gradient(${this.props.player1.color},${this.props.player2.color})`){
        return true;
      }})


    console.log('bothWinningBoxes', bothWinningBoxes, 'allBoth', allBothWinningBoxesHaveGradientBackground, )
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


  // knowing what plays are winners for each player
  // add a highlight of player.color to winning tiles
  // addHighlights(player, winningPlays) {
  //   let winningIds = winningPlays.map(tile => tile.id)

  //   // check that some of the 
  //   // winning play tiles needs a highlight
  //   // !every true is the same as some false
  //   // this stops infinite update loop
  //   if (!winningPlays.every((tile) => tile.highlight === true) && this.props.gameOn) {

  //     this.setState({
  //       boxes: this.state.boxes.map((tile) => {
  //         // logic to determine the color of the highlight

  //         // if the tile being mapped over is included
  //         // in the winning id's
  //         if (winningIds.includes(tile.id)) {
  //           console.log('inside addhighlights Tile that just changed:', tile)
  //           if (tile.color === null) {
  //             console.log('=== null')
  //             return { ...tile, highlight: true, color: `${player.color}` }
  //           }
  //           else if (tile.color !== null) {
  //             console.log('!== null. tile.color: ', tile.color)
  //             return { ...tile, highlight: true, color: `linear-gradient(${this.props.player1.color},${this.props.player2.color})` }
  //           }

  //           // if the highlight value is false (ie, it hasn't been
  //           // highlit yet).
  //           // if (tile.highlight === false){
  //           //   return { ...tile, highlight: true, color: player.color }
  //           // }

  //           //return { ...tile, highlight: true, color: `linear-gradient(${player.color},white)` } // `linear-gradient(${player.color}, #9198e5)`
  //         }
  //         return tile;
  //       })
  //     })
  //   }
  // }

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