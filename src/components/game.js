import React from 'react';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';

import { default as Tile } from 'components/tile';

import Action, { revealTile } from 'actions/game';
import Store from 'stores/game';

class Game extends React.Component {
  static displayName = 'game'

  static propTypes = {
    columns: React.PropTypes.number.isRequired,
    game: React.PropTypes.any.isRequired,
    rows: React.PropTypes.number.isRequired
  }

  constructor(props){
    super(props);

    this.state = {
      game: props.game
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
    this.props.dispatch(revealTile(id));
  }

  generateColumns(row){
    return (
      fromJS(this.props.game.slice(row * this.props.columns, (row + 1) * this.props.columns))
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
    game: state.get('game')
  }
}
export default connect(select)(Game);
