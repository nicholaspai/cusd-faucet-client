import { TYPES } from "./tronActions";

// Initial state
export const initialState = {
  tron: {
    user_address: ''
  },
};

// User Tron account state
export const tron = (state = initialState.tron, action) => {
  switch (action.type) {
    case TYPES.SET_TRON_ADDRESS:
      return Object.assign({}, state, {
        user_address: action.string
      });
    default:
      return state;
  }
};

