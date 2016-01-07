export const INIT = 'INIT';
export const REVEAL_TILE = 'REVEAL_TILE';
export const SET_TILE_STATUS = 'SET_TILE_STATUS';
export const Constants = {
  INIT,
  REVEAL_TILE
};

class Action {
  static init(opts = {}){
    return {
      type: INIT,
      value: opts
    };
  }

  static revealTile(id){
    return {
      type: REVEAL_TILE,
      value: id
    };
  }

  static setTileStatus(id, tileStatus){
    return {
      type: SET_TILE_STATUS,
      value: { id, tileStatus }
    };
  }
}

export { Action as default };

