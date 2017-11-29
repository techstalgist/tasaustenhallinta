import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import {createLogger} from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './shared/rootReducer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import RouterComponent from './routes';
import { loadState, saveState } from './localstorage';
import { throttle } from 'lodash';

let middleware = [thunkMiddleware];

// only log to browser console in development
if(process.env.NODE_ENV !== 'production') {
  const loggerMiddleware = createLogger();
  middleware = [...middleware, loggerMiddleware];
}

const enhancer = compose(
  applyMiddleware(...middleware)
);

const store = createStore(rootReducer, loadState(), enhancer);

store.subscribe(throttle(() => {
  saveState({
    loginData: {
      logInInfo: store.getState().loginData.logInInfo
    },
    signUpData: {
      userGroup: store.getState().signUpData.userGroup
    }
  });
}, 1000)); // save state only max once per sec.

ReactDOM.render(
  <Provider store={store}>
    <RouterComponent store={store}/>
  </Provider>, document.getElementById('root')
);

registerServiceWorker();
