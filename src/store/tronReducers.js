import { TYPES } from "./tronActions";

// Initial state
export const initialState = {
  tron: {
    user_address: '',
    balance_cusd: '',
    pending_mints: [],

  },
};

// User Tron account state
export const tron = (state = initialState.tron, action) => {
  switch (action.type) {
    case TYPES.SET_TRON_ADDRESS:
      return Object.assign({}, state, {
        user_address: action.string
      });
    case TYPES.SET_TRON_BALANCE:
      return Object.assign({}, state, {
        balance_cusd: action.string
      });
    case TYPES.CONCAT_PENDING_MINTS:
      return Object.assign({}, state, {
        pending_mints: state.pending_mints.concat(action.object)
      });

    default:
      return state;
  }
};

