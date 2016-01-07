import { Map, List } from 'immutable';
import { INIT, REVEAL_TILE, SET_TILE_STATUS } from 'actions/game';
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

    tiles = tiles.setIn([tileId, 'tileStatus'], 'revealed');
    tiles = tiles.setIn([tileId, 'mineCount'], this.getMineCount(tiles, tileId, columns));
    if (tiles.getIn([tileId, 'mineCount']) === 0) {
      return this.neighbours(tiles, tileId, columns).reduce((newGame, neighbour) => {
        return newGame.getIn([neighbour.get('id'), 'tileStatus']) !== 'revealed' ? this.revealTiles(newGame, neighbour.get('id'), columns) : newGame;
      }, tiles, this);
    }
    return tiles;
  }

  static initializeTiles(rows, columns, mineCount){
    let tiles;

    tiles = [];

    for (let i = 0; i < (rows * columns); i++) {
      tiles.push({ isMine: (i < mineCount), tileStatus: 'initial' });
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

  static isPlayerVictory(game){
    return game.get('tiles').every((tile) => {
      return !tile.get('isMine') || tile.get('tileStatus') === 'flag';
    });
  }
}
function initialState(opts){
  const { columns, rows, mines } = Object.assign({}, Settings, opts);

  return (
    Map({ columns, isGameOver: false, isPlayerVictory: false, rows, mines })
    .set('tiles', StoreData.initializeTiles(rows, columns, mines))
  );
}

function register(state, payload){
  switch (payload.type) {
    case INIT:
      return initialState(payload.value);
    case REVEAL_TILE:
      if (state.get('isGameOver')) { return state; }
      if (state.getIn(['tiles', payload.value, 'isMine'])) {
        let revealedTiles;

        revealedTiles = state.get('tiles').map(tile => {
          if (tile.get('isMine')) {
            tile = tile.set('tileStatus', 'revealed');
          }
          return tile;
        });

        return state.merge({ isGameOver: true, tiles: revealedTiles });
      } else {
        return state.set('tiles', StoreData.revealTiles(state.get('tiles'), payload.value, state.get('columns')));
      }
    case SET_TILE_STATUS:
      if (state.get('isGameOver')) { return state; }
      switch (payload.value.tileStatus) {
        case 'revealed':
          return state;
        case 'initial':
          state = state.setIn(['tiles', payload.value.id, 'tileStatus'], 'flag');
          return state.set('isPlayerVictory', StoreData.isPlayerVictory(state));
        case 'flag':
          return state.setIn(['tiles', payload.value.id, 'tileStatus'], 'possibleMine');
        case 'possibleMine':
          return state.setIn(['tiles', payload.value.id, 'tileStatus'], 'initial');
        default:
          console.error(`There was an error setting the tile status. Invalid value of ${payload.value.tileStatus}`);
          return state;
      }
    default:
      return state;
  }
}

const Store = createStore(register);

export { Store as default };
