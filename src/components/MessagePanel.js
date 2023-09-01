// class component for message

import React from 'react'

class MessagePanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: "Here"
    }
  }

  static getDerivedStateFromProps(props) {
    let newMessage;

    // if session won by either player
    if (props.sessionWinner !== null) {
      newMessage = `${props.sessionWinner} wins the session! Press 'Start Match!' to go again.`;
    }

    // start of session
    else if (props.gameOn === false && props.winner === null) {
      newMessage = `Enter details above and press 'Start Match!' to begin. Please enter a color that's HTML friendly`;
    }

    else if (props.gameOn === false && props.winner) {
      newMessage = `${props.winner} wins the game! Press 'Reset' to continue the session.`
    }

    else if (props.gameOn === false && props.winner === false) {
      newMessage = `It's a tie! Press 'Reset' to go again.`
    }

    if (props.gameOn === true && props.playerTurn) {
      newMessage = `It's ${props.playerTurn}'s turn.`
    }

    return { message: newMessage }
  }

  render() {
    return (
      <div className="message">
        <h1>{this.state.message}</h1>
      </div>
    )
  }
}

export default MessagePanel