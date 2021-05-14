import { createStore as reduxCreateStore } from "redux"
import rootReducer from './combineReducers';

const createStore = () => reduxCreateStore(rootReducer);

export default createStore

