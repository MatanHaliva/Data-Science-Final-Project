import { combineReducers } from 'redux';
import app from './reducers';
import login from './login.reducer';

export default combineReducers({ app, login });