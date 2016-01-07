import React from 'react';
import cx from 'classnames';

class Tile extends React.Component {
  static displayName = 'Tile'

  static propTypes = {
    id: React.PropTypes.number.isRequired,
    isFlag: React.PropTypes.bool.isRequired,
    isMine: React.PropTypes.bool.isRequired,
    isPossibleMine: React.PropTypes.bool.isRequired,
    isRevealed: React.PropTypes.bool.isRequired,
    mineCount: React.PropTypes.number.isRequired,
    revealTile: React.PropTypes.func.isRequired,
    setTileStatus: React.PropTypes.func.isRequired,
    tileStatus: React.PropTypes.oneOf(['revealed', 'initial', 'flag', 'possibleMine']).isRequired
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
    if (this.props.isRevealed) {
      return cx({
        [this.props.mineCount]: this.props.isRevealed && !this.props.isMine && this.props.mineCount > 0
      });
    } else {
      const tileClass = cx({
        'fa fa-flag': !this.props.isRevealed && this.props.isFlag,
        'fa fa-question': !this.props.isRevealed && this.props.isPossibleMine
      });

      return <i className={ tileClass }></i>;
    }
  }

  render(){
    return <div className={ this.containerClass() } onContextMenu={ this.handleContextMenu } onClick={ this.handleClick }>{ this.mineCount() }</div>;
  }

  handleContextMenu = (e) => {
    e.preventDefault();
    this.props.setTileStatus(this.props.id, this.props.tileStatus);
  }

  handleClick = () => {
    this.props.revealTile(this.props.id);
  }
}

export { Tile as default };
