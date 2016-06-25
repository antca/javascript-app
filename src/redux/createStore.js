import { createStore as createReduxStore, combineReducers, applyMiddleware } from 'redux';
import counterReducer from './counter/reducer';
import { routerReducer, routerMiddleware } from 'react-router-redux'

const reducers = combineReducers({
  counter: counterReducer,
  routing: routerReducer,
})

function createStore(history, state) {
  return createReduxStore(reducers, state, applyMiddleware(routerMiddleware(history)));
}

export default createStore;
