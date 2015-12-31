import React from 'react';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';

import { default as Tile } from 'components/tile';

import Action from 'actions/game';

class Game extends React.Component {
  static displayName = 'Game'

  static propTypes = {
    columns: React.PropTypes.number.isRequired,
    dispatch: React.PropTypes.func.isRequired,
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

  revealTile(id){
    this.props.dispatch(Action.revealTile(id));
  }

  generateColumns(row){
    return (
      fromJS(this.props.tiles.slice(row * this.props.columns, (row + 1) * this.props.columns))
      .map((tile) => {
        return <Tile {...tile.toObject()} key={ tile.get('id') } revealTile={ this.revealTile.bind(this, tile.get('id')) }/>;
      })
    );
  }

  render(){
    return (
      <div className='game-container'>
        { this.generateRows() }
      </div>
    );
  }
}

function select(state){
  return {
    columns: state.get('columns'),
    rows: state.get('rows'),
    tiles: state.get('tiles')
  }
}
export default connect(select)(Game);
