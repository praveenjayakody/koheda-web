import React from 'react';
import { Router } from 'react-router-dom';

import history from './services/history';
import Routes from './routes/routes.js';

import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme.js';

import './i18n';

import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Routes />
      </Router>
    </ThemeProvider>
  );
}
export default App;