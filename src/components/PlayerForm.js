// class component w/o props

import React from 'react'

class PlayerForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      player1: { name: '', token: 'X', color: 'orange' },
      player2: { name: '', token: 'O', color: 'white' },
      winCondition: 1,
    }
    this.handlePlayerChange = this.handlePlayerChange.bind(this);
    this.handlePlayerToken = this.handlePlayerToken.bind(this);
    this.handleWinCondition = this.handleWinCondition.bind(this);
  }

  handlePlayerToken(event) {
    const { value, name } = event.target;
    const otherName = name === "player1" ? "player2" : "player1"
    const otherVal = value === 'X' ? 'O' : 'X'
    this.setState(function (prevState) {
      return ({ [otherName]: { ...prevState[otherName], token: otherVal }, [name]: { ...prevState[name], token: value } })
    })
  }

  handleWinCondition(event) {
    const { value } = event.target;
    this.setState(prevState => {
      return ({
        ...prevState,
        winCondition: Number(value),
      })
    })
  }

  handlePlayerChange(event) {
    const { name, value } = event.target;
    const nameSplit = name.split(".")
    this.setState(function (prevState) {
      return ({ ...prevState, [nameSplit[0]]: { ...prevState[nameSplit[0]], [nameSplit[1]]: value } })
    });
  }

  render() {
    return (
      <div className='form-container'>
        <form className='form'>

          <h2>Player Details</h2>

          <div className='form-player'>
            <div className="form-player-name-color">
              <div>
                <label htmlFor="player1.name">Player 1: </label>
                <input
                  type='text'
                  value={this.state.player1.name}
                  onChange={this.handlePlayerChange}
                  name='player1.name'
                  id='player1.name'>
                </input>
              </div>

              <div>
                <label htmlFor="player1.color">Color: </label>
                <input
                  type='text'
                  value={this.state.player1.color}
                  onChange={this.handlePlayerChange}
                  name='player1.color'
                  id='player1.color'>
                </input>
              </div>
            </div>
            <div>
              <label htmlFor="player1.X"> X</label>
              <input
                className="radio"
                type='radio'
                id='player1.X'
                name='player1'
                value='X'
                onChange={this.handlePlayerToken}
                checked={this.state.player1.token === 'X'} >
              </input>
            </div>

            <div>
              <label htmlFor="player1.O"> O</label>
              <input
                className="radio"
                type='radio'
                id='player1.O'
                name='player1'
                value='O'
                onChange={this.handlePlayerToken}
                checked={this.state.player1.token === 'O'} >
              </input>
            </div>
          </div>

          <br></br>

          <div className="form-player">
            <div className="form-player-name-color">
              <div>
                <label htmlFor='player2.name'>Player 2: </label>
                <input
                  type='text'
                  value={this.state.player2.name}
                  onChange={this.handlePlayerChange}
                  name='player2.name'
                  id='player2.name'>
                </input>
              </div>

              <div>
                <label htmlFor="player2.color">Color: </label>
                <input
                  type='text'
                  value={this.state.player2.color}
                  onChange={this.handlePlayerChange}
                  name='player2.color'
                  id='player2.color'>
                </input>
              </div>
            </div>

            <div>
              <label htmlFor='player2.X'> X</label>
              <input
                className="radio"
                type="radio"
                id="player2.X"
                name="player2"
                value='X'
                checked={this.state.player2.token === 'X'}
                onChange={this.handlePlayerToken}>
              </input>
            </div>

            <div>
              <label htmlFor='player2.O'> O</label>
              <input
                className="radio"
                type="radio"
                id="player2.O"
                name="player2"
                value='O'
                checked={this.state.player2.token === 'O'}
                onChange={this.handlePlayerToken}>
              </input>
            </div>
          </div>

          <div className='form-winCondition'>

            <label htmlFor='winCondition-radio-container'>Best Of:</label>

            <div>
              <label htmlFor="win-Condition-radio-1">1</label>
              <input
                className='radio'
                id='win-Condition-Radio-1'
                type='radio'
                value='1'
                name='1'
                onChange={this.handleWinCondition}
                checked={this.state.winCondition === 1}>
              </input>
            </div>

            <div>
              <label htmlFor="win-Condition-radio-3">3</label>
              <input
                className='radio'
                id='win-Condition-radio-3'
                type='radio'
                value='2'
                name='2'
                onChange={this.handleWinCondition}
                checked={this.state.winCondition === 2}>
              </input>
            </div>

            <div>
              <label htmlFor="win-Condition-radio-5">5</label>
              <input
                className="radio"
                id='win-Condition-radio-5'
                type='radio'
                value='3'
                name='3'
                onChange={this.handleWinCondition}
                checked={this.state.winCondition === 3}>
              </input>
            </div>

          </div>
          <button type='button' onClick={() => this.props.startSession(this.state.player1, this.state.player2, this.state.winCondition)}>Start Match!</button>
        </form>
      </div>
    )
  }
}

export default PlayerForm;