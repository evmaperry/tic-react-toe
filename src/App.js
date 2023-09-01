import './App.css';
import React from 'react'
import PlayerForm from './components/PlayerForm';
import Board from './components/Board'
import MessagePanel from './components/MessagePanel';
import StatsPanel from './components/StatsPanel';
import tileData from './data/tileData';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      player1: { identity: 'player1', name: null, token: null, gamesWon: 0, }, // updates from PlayerForm
      player2: { identity: 'player2', name: null, token: null, gamesWon: 0, }, // updates from PlayerForm
      winCondition: 1, // updates from PlayerForm
      sessionOn: null,
      gameCount: 0, // updates from Board when game finishes
      moveCount: 0, // updates from Board when move made
      playerTurn: null, // updates from PlayerForm when game starts, Board when move made
      gameOn: false, // updates from PlayerForm when game starts
      winner: null, // updates from Board, sent to MessagePanel
      sessionWinner: null // updates from app, sent to MessagePanel
    }

    this.childBoard = React.createRef();

    this.startSession = this.startSession.bind(this);
    this.switchTurn = this.switchTurn.bind(this);
    this.endGameWithWin = this.endGameWithWin.bind(this);
    this.endGameWithTie = this.endGameWithTie.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.checkForSessionWinner = this.checkForSessionWinner.bind(this);
    this.clearBoard = this.clearBoard.bind(this);
  }

  startSession(player1, player2, winCondition) {
    if (player1.name !== '' && player2.name !== '') {
      this.setState(prevState => ({
        ...prevState,

        player1: { identity: 'player1', ...player1, gamesWon: 0 },
        player2: { identity: 'player2', ...player2, gamesWon: 0 },
        playerTurn: player1.name,
        winCondition: winCondition,
        gameOn: true,
        sessionOn: true,
        sessionWinner: null,
        moveCount: 0,
        gameCount: 1,
        winner: null,
      }))
      this.clearBoard();
    }
  }

  restartGame() {
    this.setState(prevState => ({
      ...prevState,
      playerTurn: (this.state.gameCount + 1) % 2 !== 0 ? this.state.player1.name : this.state.player2.name,
      gameOn: true,
      gameCount: this.state.gameCount + 1,
      moveCount: 0,
      winner: null,
    }))
    this.clearBoard();
  }

  clearBoard() {
    this.childBoard.current.setState({ boxes: tileData });
  }

  switchTurn() {
    this.setState(prevState => {
      return {
        ...prevState,
        playerTurn: this.state.playerTurn === this.state.player1.name ? this.state.player2.name : this.state.player1.name,
        moveCount: this.state.moveCount + 1,
      }
    })
  }

  endGameWithWin(player) {
    if (this.state.winner === null) { // makes sure setState doesn't run in a loop
      this.setState(prevState => {
        return {
          ...prevState,
          winner: player.name, // will be name of winner passed from board
          gameOn: false,
          [player.identity]: { ...player, gamesWon: this.state[player.identity].gamesWon + 1 }
        }
      })

    }
  }

  endGameWithTie() {
    if (this.state.winner === null) { // makes sure setState doesn't run in a loop
      this.setState(prevState => {
        return {
          ...prevState,
          winner: false, // will be false
          gameOn: false
        }
      })
    }
  }

  checkForSessionWinner(player) {
    if (player.gamesWon === this.state.winCondition && this.state.sessionOn === true) {
      this.setState(prevState => {
        return {
          ...prevState,
          player1: { ...prevState.player1, },
          player2: { ...prevState.player2, },
          sessionWinner: this.state[player.identity].name,
          sessionOn: false,
        }
      })
    }
  }

  componentDidUpdate() {
    // set session winner if either player's gamesWon === winCondition
    this.checkForSessionWinner(this.state.player1)
    this.checkForSessionWinner(this.state.player2)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className='title'>
            <h1>Tic-React-Toe</h1>
          </div>
        </header>
        <div className='body'>
          <div className='left-side'>
            <PlayerForm
              startSession={this.startSession}
              winCondition={this.state.winCondition}
            />
            <StatsPanel
              gameCount={this.state.gameCount}
              moveCount={this.state.moveCount}
              player1={this.state.player1}
              player2={this.state.player2}
              sessionOn={this.state.sessionOn} />
          </div>
          <div className='right-side'>
            <Board
              endGameWithTie={this.endGameWithTie}
              endGameWithWin={this.endGameWithWin}
              restartGame={this.restartGame}
              switchTurn={this.switchTurn}
              winner={this.state.winner}
              sessionWinner={this.state.sessionWinner}
              gameOn={this.state.gameOn}
              player1={this.state.player1}
              player2={this.state.player2}
              playerTurn={this.state.playerTurn}
              moveCount={this.state.moveCount}
              ref={this.childBoard} />
          </div>
        </div>
        <MessagePanel
          player1={this.state.player1}
          player2={this.state.player2}
          playerTurn={this.state.playerTurn}
          gameOn={this.state.gameOn}
          winner={this.state.winner}
          sessionWinner={this.state.sessionWinner} />
      </div>
    );
  }
}

export default App;
