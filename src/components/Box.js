import React from 'react'

class Box extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <div className="box" onClick={this.props.updateGame}>
        <h1>{this.props.value}</h1>
      </div>
    )
  }
}

export default Box