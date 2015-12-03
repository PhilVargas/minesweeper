const Dispatcher = require('dispatcher');

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

module.exports = Action;
