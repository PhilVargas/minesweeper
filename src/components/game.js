import React from 'react';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import cx from 'classnames';

import { default as Tile } from 'components/tile';

import Action from 'actions/game';

class Game extends React.Component {
  static displayName = 'Game'

  static propTypes = {
    columns: React.PropTypes.number.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    isGameOver: React.PropTypes.bool.isRequired,
    mines: React.PropTypes.number.isRequired,
    rows: React.PropTypes.number.isRequired,
    tiles: React.PropTypes.any.isRequired
  }

  constructor(props){
    super(props);

    this.state = {
      tiles: props.tiles
    };
  }

  generateRows(){
    let rows;

    rows = [];
    for (let i = 0; i < this.props.rows; i++) {
      rows.push(
        <div key={ i } className='row'>
          { this.generateColumns(i) }
        </div>
      );
    }

    return rows;
  }

  revealTile = (id) => {
    this.props.dispatch(Action.revealTile(id));
  }

  setTileStatus = (id, status) => {
    this.props.dispatch(Action.setTileStatus(id, status));
  }

  resetGame = () => {
    this.props.dispatch(Action.init());
  }

  defaultTileProps(tile){
    return {
      isRevealed: tile.get('tileStatus') === 'revealed',
      isFlag: tile.get('tileStatus') === 'flag',
      isPossibleMine: tile.get('tileStatus') === 'possibleMine'
    };
  }

  generateColumns(row){
    return (
      fromJS(this.props.tiles.slice(row * this.props.columns, (row + 1) * this.props.columns))
      .map((tile) => {
        return <Tile {...tile.toObject()} {...this.defaultTileProps(tile)} key={ tile.get('id') } revealTile={ this.revealTile } setTileStatus={ this.setTileStatus }/>;
      })
    );
  }

  render(){
    return (
      <div className='game-container'>
        <div id='header' className='row'>
          <div className='mine-header columns large-4'>{ this.props.mines }</div>
          <div className='icon-header columns large-4'>
            <div className='icon-container' onClick={ this.resetGame }>
              <i className={ cx('fa fa-lg', { 'fa-smile-o': !this.props.isGameOver, 'fa-frown-o': this.props.isGameOver }) }></i>
            </div>
          </div>
          <div className='counter-header columns large-4'></div>
        </div>
        { this.generateRows() }
      </div>
    );
  }
}

function select(state){
  return {
    columns: state.get('columns'),
    isGameOver: state.get('isGameOver'),
    mines: state.get('mines'),
    rows: state.get('rows'),
    tiles: state.get('tiles')
  };
}
export default connect(select)(Game);
