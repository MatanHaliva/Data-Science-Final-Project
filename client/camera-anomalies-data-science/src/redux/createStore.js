import { createStore as reduxCreateStore, applyMiddleware } from "redux"
import createSagaMiddleware from 'redux-saga'

import rootReducer from './combineReducers';
import mySaga from './sagas'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

const createStore = () => { 
    const store = reduxCreateStore(rootReducer, applyMiddleware(sagaMiddleware))
    sagaMiddleware.run(mySaga)

    return store
}

export default createStore

