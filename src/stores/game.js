import { Map, List } from 'immutable';
import { INIT, REVEAL_TILE } from 'actions/game';
import { createStore } from 'redux';

import Settings from 'helpers/settings';
import AppHelper from 'helpers/app-helper';

class StoreData {
  static onWEdge(tiles, tile, columns){
    return tile % columns === 0;
  }

  static onEEdge(tiles, tile, columns){
    return tile % columns === columns - 1;
  }

  static idx(tiles, tile){
    if (tile < 0) { return null; }
    return tiles.getIn([tile]) ? tile : null;
  }

  static nw(tiles, tile, columns){
    return this.onWEdge(tiles, tile, columns) ? null : this.idx(tiles, tile - columns - 1);
  }

  static n(tiles, tile, columns){
    return this.idx(tiles, tile - columns);
  }

  static ne(tiles, tile, columns){
    return this.onEEdge(tiles, tile, columns) ? null : this.idx(tiles, tile - columns + 1);
  }

  static e(tiles, tile, columns){
    return this.onEEdge(tiles, tile, columns) ? null : this.idx(tiles, tile + 1);
  }

  static se(tiles, tile, columns){
    return this.onEEdge(tiles, tile, columns) ? null : this.idx(tiles, tile + columns + 1);
  }

  static s(tiles, tile, columns){
    return this.idx(tiles, tile + columns);
  }

  static sw(tiles, tile, columns){
    return this.onWEdge(tiles, tile, columns) ? null : this.idx(tiles, tile + columns - 1);
  }

  static w(tiles, tile, columns){
    return this.onWEdge(tiles, tile, columns) ? null : this.idx(tiles, tile - 1);
  }

  static keep(list, pred){
    return list.map(pred).filter(this.identity);
  }

  static identity(v){
    return v;
  }

  static neighbours(tiles, tile, columns = 10){
    const directions = [this.nw, this.n, this.ne, this.e, this.se, this.s, this.sw, this.w];

    return this.keep(directions, (dir) => {
      return tiles.get(dir.call(this, tiles, tile, columns));
    });
  }

  static getMineCount(tiles, tileId, columns){
    return this.neighbours(tiles, tileId, columns).filter(function(tile){
      return tiles.getIn([tile.get('id'), 'isMine']);
    }).length;
  }

  static revealTiles(tiles, tileId, columns){
    if (tiles.getIn([tileId, 'isMine'])) {
      return tiles;
    }

    tiles = tiles.setIn([tileId, 'isRevealed'], true);
    tiles = tiles.setIn([tileId, 'mineCount'], this.getMineCount(tiles, tileId, columns));
    if (tiles.getIn([tileId, 'mineCount']) === 0) {
      return this.neighbours(tiles, tileId, columns).reduce((newGame, neighbour) => {
        return !newGame.getIn([neighbour.get('id'), 'isRevealed']) ? this.revealTiles(newGame, neighbour.get('id'), columns) : newGame;
      }, tiles, this);
    }
    return tiles;
  }

  static initializeTiles(rows, columns, mineCount){
    let tiles;

    tiles = [];

    for (let i = 0; i < (rows * columns); i++) {
      tiles.push({ isMine: (i < mineCount), isRevealed: false });
    }
    tiles = AppHelper.shuffle(tiles)
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
    .set('tiles', StoreData.initializeTiles(rows, columns, mines))
  );
}

function register(state, payload){
  switch (payload.type) {
    case INIT:
      return initialState();
    case REVEAL_TILE:
      return state.set('tiles', StoreData.revealTiles(state.get('tiles'), payload.value, state.get('columns')));
  }
}

const Store = createStore(register);

export { Store as default };
