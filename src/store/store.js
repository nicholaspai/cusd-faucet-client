import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
// import logger from "redux-logger"; // Debuggin: prints redux actions to console
import { eth, global } from "./reducers";

// Add all reducers here to aggregate into one store
const rootReducer = combineReducers({
  eth,
  global,
});

// Import store from createStore() => store
export default createStore(rootReducer, {}, applyMiddleware(thunk));
