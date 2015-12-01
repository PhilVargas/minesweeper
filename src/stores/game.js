const Dispatcher = require('dispatcher');
const MicroEvent = require('microevent-github');
const { Map, List } = require('immutable');

const Settings = require('helpers/settings');

let store;

class Store {
  constructor(opts = {}){
    this.columns = opts.columns || Settings.columns;
    this.rows = opts.rows || Settings.rows;
    this.mines = opts.mines || Settings.mines;
    this.game = null;
    this.initializeTiles();
  }

  getAll(){
    return {
      columns: this.columns,
      rows: this.rows,
      mines: this.mines,
      game: this.game
    };
  }

  triggerChange(){
    this.trigger('change');
  }

  unbindChange(cb){
    this.unbind('change', cb);
  }

  bindChange(cb){
    this.bind('change', cb);
  }

  initializeTiles(){
    let mines, safeTiles, tiles;

    mines = [];
    safeTiles = [];

    for (let i = 0; i < this.mines; i++) {
      mines.push({ isMine: true, isRevealed: false });
    }
    for (let i = 0; i < ((this.rows * this.columns) - this.mines); i++) {
      safeTiles.push({ isMine: false, isRevealed: false });
    }
    tiles = mines.concat(safeTiles)
      .sort(function(){
        return Math.random() - 0.5;
      })
      .map(function(el, index){
        el.id = index;
        return Map(el);
      });
    this.game = List(tiles);
  }
}

MicroEvent.mixin(Store);
store = new Store();

module.exports = store;
