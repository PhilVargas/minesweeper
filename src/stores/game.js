const Dispatcher = require('dispatcher');
const MicroEvent = require('microevent-github');
const { Map, List } = require('immutable');

const Settings = require('helpers/settings');

const directions = [nw, n, ne, e, se, s, sw, w];
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
    this.game = List(tiles).map(function(tile,id,list){
      return tile.set('mineCount', getMineCount(list,id))
    });
  }
}

MicroEvent.mixin(Store);
store = new Store();

function onWEdge(game, tile) {
  return tile % Settings.columns === 0;
}

function onEEdge(game, tile) {
  return tile % Settings.columns === Settings.columns - 1;
}

function idx(game, tile) {
  if (tile < 0) { return null; }
  return game.getIn([tile]) ? tile : null;
}

function nw(game, tile) {
  return onWEdge(game, tile) ? null : idx(game, tile - Settings.columns - 1);
}

function n(game, tile) {
  return idx(game, tile - Settings.columns);
}

function ne(game, tile) {
  return onEEdge(game, tile) ? null : idx(game, tile - Settings.columns + 1);
}

function e(game, tile) {
  return onEEdge(game, tile) ? null : idx(game, tile + 1);
}

function se(game, tile) {
  return onEEdge(game, tile) ? null : idx(game, tile + Settings.columns + 1);
}

function s(game, tile) {
  return idx(game, tile + Settings.columns);
}

function sw(game, tile) {
  return onWEdge(game, tile) ? null : idx(game, tile + Settings.columns - 1);
}

function w(game, tile) {
  return onWEdge(game, tile) ? null : idx(game, tile - 1);
}

function keep(list, pred) {
  return list.map(pred).filter(identity);
}
function identity(v) {
  return v;
}

function neighbours(game, tile) {
  return keep(directions, function (dir) {
    return game.get(dir(game, tile));
  });
}

function getMineCount(game, tileId) {
  var nbs = neighbours(game, tileId);
  return nbs.filter(function(tile){ return game.getIn([tile.get('id'), 'isMine']) }).length;
}


Dispatcher.register(function(payload){
  switch (payload.eventName) {
    case 'game:revealTile':
      store.game = store.game.setIn([payload.value, 'isRevealed'], true);
      store.game = store.game.setIn([payload.value, 'mineCount'], getMineCount(store.game, payload.value));
      store.triggerChange();
      break;
  }
});

module.exports = store;
