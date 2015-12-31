export const INIT = 'INIT';
export const REVEAL_TILE = 'REVEAL_TILE';
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
}

export { Action as default };

