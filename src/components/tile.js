const React = require('react');
const cx = require('classnames');

class Tile extends React.Component {
  static displayName = 'Tile'

  static propTypes = {
    id: React.PropTypes.number.isRequired,
    isMine: React.PropTypes.bool.isRequired,
    isRevealed: React.PropTypes.bool.isRequired,
    mineCount: React.PropTypes.number.isRequired,
    revealTile: React.PropTypes.func.isRequired
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

  mineCount(){
    return cx({
      [this.props.mineCount]: this.props.isRevealed && !this.props.isMine && this.props.mineCount > 0
    });
  }

  render(){
    return <div className={ this.containerClass() } onClick={ this.handleClick.bind(this) }>{ this.mineCount() }</div>;
  }

  handleClick(){
    this.props.revealTile(this.props.id);
  }
}

module.exports = Tile;

