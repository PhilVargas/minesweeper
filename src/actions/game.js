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
