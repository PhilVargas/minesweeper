const Dispatcher = require('dispatcher');

class Action {
  static revealTile(id){
    Dispatcher.dispatch({
      eventName: 'game:revealTile',
      value: id
    });
  }
}

module.exports = Action;
