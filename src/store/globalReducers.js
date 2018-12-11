import { TYPES, PAGES } from "./globalActions";

// Initial state
export const initialState = {
  global: {
    web3: '',
    page: PAGES.MAIN,
  },
};

// Global app state
export const global = (state = initialState.global, action) => {
  switch (action.type) {
    case TYPES.SET_WEB3:
      return Object.assign({}, state, {
        web3: action.object
      });
    case TYPES.SET_PAGE:
      return Object.assign({}, state, {
        page: action.number
      });
    default:
      return state;
  }
};

