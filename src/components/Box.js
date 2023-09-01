import React from 'react'

class Box extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      styles: {
      }
    }
  }

  render() {
    console.log('box props', this.props, 'box state', this.state)
    return (
      <div style={this.props.styles} className="box" onClick={this.props.updateTile}>
        <h1>{this.props.value}</h1>
      </div>
    )
  }
}

export default Box