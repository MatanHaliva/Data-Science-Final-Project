import { createStore as reduxCreateStore, applyMiddleware } from "redux"
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga'
import rootReducer from './combineReducers';
import mySaga from './sagas'



const composeEnhancers = composeWithDevTools({
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

const createStore = () => { 
    const store = reduxCreateStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)))
    sagaMiddleware.run(mySaga)

    return store
}

export default createStore

