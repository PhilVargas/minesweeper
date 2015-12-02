const React = require('react');
const { fromJS } = require('immutable');

const Tile = require('components/tile');

const Action = require('actions/game');
const Store = require('stores/game');

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

  componentDidMount(){
    Store.bindChange(this.gameChanged.bind(this));
  }

  gameChanged(){
    this.setState({ game: Store.game });
  }

  componentWillUnount(){
    Store.unbindChange(this.gameChanged.bind(this));
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
      fromJS(this.state.game.slice(row * this.props.columns, (row + 1) * this.props.columns))
      .map(function(tile){
        return <Tile {...tile.toObject()} key={ tile.get('id') } revealTile={ Action.revealTile }/>;
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
