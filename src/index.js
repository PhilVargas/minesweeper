const $ = require('jquery');
const ReactDOM = require('react-dom');
const React = require('react');
const Game = require('components/game');
const Store = require('stores/game');
const Action = require('actions/game');

Action.init();
$(document).on('ready', function(){
  ReactDOM.render(React.createElement(Game, Store.getAll()), document.getElementById('game-anchor'));
});
