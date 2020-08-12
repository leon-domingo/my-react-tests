import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';

const appTitle = 'React counter app',
  appInitialFrecuency = 1000;

ReactDOM.render(
  <App
    title={appTitle}
    initialFrecuency={appInitialFrecuency}
  />,
  document.getElementById('app'),
);
