const React = require('react');
const cx = require('classnames');

class Tile extends React.Component {
  static displayName = 'Tile'

  static propTypes = {
    id: React.PropTypes.number.isRequired,
    isMine: React.PropTypes.bool.isRequired,
    isRevealed: React.PropTypes.bool.isRequired,
    mineCount: React.PropTypes.number.isRequired
  }

  constructor(props){
    super(props);
  }

  containerClass(){
    return cx('tile', {
      mine: this.props.isMine,
      revealed: this.props.isRevealed
    });
  }

  render(){
    return <div className={ this.containerClass() }>{ this.props.mineCount || null }</div>;
  }
}

module.exports = Tile;

