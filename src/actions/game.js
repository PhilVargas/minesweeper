import Dispatcher from 'dispatcher';

class Action {
  static init(opts = {}){
    Dispatcher.dispatch({
      eventName: 'game:init',
      value: opts
    });
  }

  static revealTile(id){
    Dispatcher.dispatch({
      eventName: 'game:revealTile',
      value: id
    });
  }
}

export { Action as default };

export const INIT = 'INIT';
export const REVEAL_TILE = 'REVEAL_TILE';
export const Actions = {
  INIT,
  REVEAL_TILE
};

export function init(opts = {}){
  return {
    type: INIT,
    value: opts
  };
}

export function revealTile(id){
  return {
    type: REVEAL_TILE,
    value: id
  };
}
