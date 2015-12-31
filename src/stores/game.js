import { Map, List } from 'immutable';
import { INIT, REVEAL_TILE } from 'actions/game';
import { createStore } from 'redux';

import Settings from 'helpers/settings';
import AppHelper from 'helpers/app-helper';

class StoreData {
  static onWEdge(game, tile, columns){
    return tile % columns === 0;
  }

  static onEEdge(game, tile, columns){
    return tile % columns === columns - 1;
  }

  static idx(game, tile){
    if (tile < 0) { return null; }
    return game.getIn([tile]) ? tile : null;
  }

  static nw(game, tile, columns){
    return this.onWEdge(game, tile, columns) ? null : this.idx(game, tile - columns - 1);
  }

  static n(game, tile, columns){
    return this.idx(game, tile - columns);
  }

  static ne(game, tile, columns){
    return this.onEEdge(game, tile, columns) ? null : this.idx(game, tile - columns + 1);
  }

  static e(game, tile, columns){
    return this.onEEdge(game, tile, columns) ? null : this.idx(game, tile + 1);
  }

  static se(game, tile, columns){
    return this.onEEdge(game, tile, columns) ? null : this.idx(game, tile + columns + 1);
  }

  static s(game, tile, columns){
    return this.idx(game, tile + columns);
  }

  static sw(game, tile, columns){
    return this.onWEdge(game, tile, columns) ? null : this.idx(game, tile + columns - 1);
  }

  static w(game, tile, columns){
    return this.onWEdge(game, tile, columns) ? null : this.idx(game, tile - 1);
  }

  static keep(list, pred){
    return list.map(pred).filter(this.identity);
  }

  static identity(v){
    return v;
  }

  static neighbours(game, tile, columns = 10){
    const directions = [this.nw, this.n, this.ne, this.e, this.se, this.s, this.sw, this.w];

    return this.keep(directions, (dir) => {
      return game.get(dir.call(this, game, tile, columns));
    });
  }

  static getMineCount(game, tileId, columns){
    return this.neighbours(game, tileId, columns).filter(function(tile){
      return game.getIn([tile.get('id'), 'isMine']);
    }).length;
  }

  static revealTiles(game, tileId, columns){
    if (game.getIn([tileId, 'isMine'])) {
      return game;
    }

    game = game.setIn([tileId, 'isRevealed'], true);
    game = game.setIn([tileId, 'mineCount'], this.getMineCount(game, tileId, columns));
    if (game.getIn([tileId, 'mineCount']) === 0) {
      return this.neighbours(game, tileId, columns).reduce((newGame, neighbour) => {
        return !newGame.getIn([neighbour.get('id'), 'isRevealed']) ? this.revealTiles(newGame, neighbour.get('id'), columns) : newGame;
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
    tiles = AppHelper.shuffle(mines.concat(safeTiles))
      .map(function(el, index){
        el.id = index;
        return Map(el);
      });
    return List(tiles).map((tile, id, list) => {
      return tile.set('mineCount', this.getMineCount(list, id));
    });
  }
}
function initialState(){
  const { columns, rows, mines } = Settings;

  return (
    Map({ columns, rows, mines })
    .set('game', StoreData.initializeTiles(rows, columns, mines))
  );
}

function register(state, payload){
  switch (payload.type) {
    case INIT:
      return initialState();
    case REVEAL_TILE:
      return state.set('game', StoreData.revealTiles(state.get('game'), payload.value, state.get('columns')));
  }
}

const Store = createStore(register);

export { Store as default };
