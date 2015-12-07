import $ from 'jquery';
import ReactDOM from 'react-dom';
import React from 'react';

import Game from 'components/game';
import Store from 'stores/game';
import Action from 'actions/game';

Action.init();
$(document).on('ready', function(){
  ReactDOM.render(React.createElement(Game, Store.getAll()), document.getElementById('game-anchor'));
});
