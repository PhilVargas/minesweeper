const React = require('react');
const { fromJS } = require('immutable');

const Tile = require('components/tile');

class Game extends React.Component {
  static displayName = 'game'

  static propTypes = {
    columns: React.PropTypes.number.isRequired,
    game: React.PropTypes.any.isRequired,
    rows: React.PropTypes.number.isRequired
  }

  constructor(props){
    super(props);
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

  generateColumns(row){
    return (
      fromJS(this.props.game.slice(row * this.props.columns, (row + 1) * this.props.columns))
      .map(function(tile){
        return <Tile {...tile.toObject()} mineCount={ 0 } key={ tile.get('id') } />;
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

module.exports = Game;
