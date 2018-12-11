import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger"; // Debuggin: prints redux actions to console

// Redux Reducers to add to global state
import { eth } from "./ethReducers";
import { global } from "./globalReducers";
import { accounts } from "./accountsReducers";


// Add all reducers here to aggregate into one store
const rootReducer = combineReducers({
  eth,
  global,
  accounts
});

// Import store from createStore() => store
export default createStore(rootReducer, {}, applyMiddleware(logger, thunk));
