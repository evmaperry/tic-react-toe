import React from 'react'

class Box extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      styles: {
        'border': null,
        'color': null,
      }
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.border === true){
        return { styles: { 'border': `solid 4px ${props.color}`, 'color': `${ props.color }`}}
    } else {
      return { styles: { 'border': null, 'color': `${ props.color }`} }
    }
  }

  render() {
    console.log('box props', this.props, 'state', this.state)
    return (
      <div style={this.state.styles} className="box" onClick={this.props.updateTile}>
        <h1>{this.props.value}</h1>
      </div>
    )
  }
}

export default Box