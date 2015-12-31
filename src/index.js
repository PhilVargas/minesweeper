import $ from 'jquery';
import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';

import Game from 'components/game';
import Store from 'stores/game';
import Action from 'actions/game';

Store.dispatch(Action.init());

$(document).on('ready', function(){
  ReactDOM.render(
    <Provider store={ Store }>
      <Game />
    </Provider>,
    document.getElementById('game-anchor')
  );
});
