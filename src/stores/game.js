const Dispatcher = require('dispatcher');
const MicroEvent = require('microevent-github');
const { Map, List } = require('immutable');

const Settings = require('helpers/settings');
const emmitter = new MicroEvent();

let store;

class Store {
  static get(attr){
    return store.get(attr);
  }

  static getAll(){
    return {
      columns: store.get('columns'),
      rows: store.get('rows'),
      mines: store.get('mines'),
      game: store.get('game')
    };
  }

  static triggerChange(){
    emmitter.trigger('change');
  }

  static unbindChange(cb){
    emmitter.unbind('change', cb);
  }

  static bindChange(cb){
    emmitter.bind('change', cb);
  }

  static onWEdge(game, tile){
    return tile % store.get('columns') === 0;
  }

  static onEEdge(game, tile){
    return tile % store.get('columns') === store.get('columns') - 1;
  }

  static idx(game, tile){
    if (tile < 0) { return null; }
    return game.getIn([tile]) ? tile : null;
  }

  static nw(game, tile){
    return this.onWEdge(game, tile) ? null : this.idx(game, tile - store.get('columns') - 1);
  }

  static n(game, tile){
    return this.idx(game, tile - store.get('columns'));
  }

  static ne(game, tile){
    return this.onEEdge(game, tile) ? null : this.idx(game, tile - store.get('columns') + 1);
  }

  static e(game, tile){
    return this.onEEdge(game, tile) ? null : this.idx(game, tile + 1);
  }

  static se(game, tile){
    return this.onEEdge(game, tile) ? null : this.idx(game, tile + store.get('columns') + 1);
  }

  static s(game, tile){
    return this.idx(game, tile + store.get('columns'));
  }

  static sw(game, tile){
    return this.onWEdge(game, tile) ? null : this.idx(game, tile + store.get('columns') - 1);
  }

  static w(game, tile){
    return this.onWEdge(game, tile) ? null : this.idx(game, tile - 1);
  }

  static keep(list, pred){
    return list.map(pred).filter(this.identity);
  }

  static identity(v){
    return v;
  }

  static neighbours(game, tile){
    const directions = [this.nw.bind(this), this.n, this.ne, this.e, this.se, this.s, this.sw, this.w];

    return this.keep(directions, (dir) => {
      return game.get(dir.call(this, game, tile));
    });
  }

  static getMineCount(game, tileId){
    return this.neighbours(game, tileId).filter(function(tile){
      return game.getIn([tile.get('id'), 'isMine']);
    }).length;
  }

  static revealTiles(game, tileId){
    if (game.getIn([tileId, 'isMine'])) {
      return game;
    }

    game = game.setIn([tileId, 'isRevealed'], true);
    game = game.setIn([tileId, 'mineCount'], this.getMineCount(game, tileId));
    if (game.getIn([tileId, 'mineCount']) === 0) {
      return this.neighbours(game, tileId).reduce((newGame, neighbour) => {
        return !newGame.getIn([neighbour.get('id'), 'isRevealed']) ? this.revealTiles(newGame, neighbour.get('id')) : newGame;
      }, game, this);
    }
    return game;
  }

  static initializeTiles(rows, columns, mineCount){
    let mines, safeTiles, tiles;

    mines = [];
    safeTiles = [];

    for (let i = 0; i < mineCount; i++) {
      mines.push({ isMine: true, isRevealed: false });
    }
    for (let i = 0; i < ((rows * columns) - mineCount); i++) {
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
    return List(tiles).map((tile, id, list) => {
      return tile.set('mineCount', this.getMineCount(list, id));
    });
  }
}

Dispatcher.register(function(payload){
  switch (payload.eventName) {
    case 'game:init':
      const { columns, rows, mines } = Object.assign(Settings, payload.value);

      store = Map({
        columns,
        rows,
        mines
      });
      store = store.set('game', Store.initializeTiles(rows, columns, mines));
      Store.triggerChange();
      break;
    case 'game:revealTile':
      store = store.set('game', Store.revealTiles(store.get('game'), payload.value));
      Store.triggerChange();
      break;
  }
});

module.exports = Store;
