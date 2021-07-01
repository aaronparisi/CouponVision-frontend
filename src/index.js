import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/App.css';
import AppContainer from './components/App/AppContainer';
import createStore from './store/store'
import { Provider } from 'react-redux';
import { Router } from 'react-router'
import { createBrowserHistory } from 'history'

import axios from 'axios'

const baseUrl = (process.env.NODE_ENV === 'production') ? 'https://coupons.aaronparisidev.com' : 'http://localhost:3000'
export const axiosIns =  axios.create({
  baseURL: baseUrl,
  withCredentials: true
})

const store = createStore()
export const history = createBrowserHistory()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router history={history} >
        <AppContainer />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
