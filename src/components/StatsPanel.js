// class component to track stats
// of the session

import React from 'react'

class StatsPanel extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='stats-panel'>
        <div className='stats-panel-top-row'>
          <h3>Match Stats</h3>
          <p>Game count: {this.props.gameCount}</p>
          <p>Move count: {this.props.moveCount}</p>
        </div>
        <div className='stats-panel-top-row'>
          <h3>Game Stats</h3>
          {this.props.player1.name && <p>{`${this.props.player1.name}'s wins: ${this.props.player1.gamesWon}`}</p>}
          {this.props.player2.name && <p>{`${this.props.player2.name}'s wins: ${this.props.player2.gamesWon}`}</p>}
        </div>
      </div>
    )
  }
}

export default StatsPanel