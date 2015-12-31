import $ from 'jquery';
import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';

import Game from 'components/game';
import { redStore } from 'stores/game';
import { init } from 'actions/game';

redStore.dispatch(init());

$(document).on('ready', function(){
  ReactDOM.render(
    <Provider store={ redStore }>
      <Game />
    </Provider>,
    document.getElementById('game-anchor')
  );
});
