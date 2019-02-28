import { TYPES } from "./tronActions";

// Initial state
export const initialState = {
  tron: {
    user_address: '',
    balance_cusd: '',
    pending_mints: [],
    pending_burns: [],
    pending_transfers: [],
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
    case TYPES.CONCAT_PENDING_MINTS_TRON:
      return Object.assign({}, state, {
        pending_mints: state.pending_mints.concat(action.object)
      });
    case TYPES.CONCAT_PENDING_BURNS_TRON:
      return Object.assign({}, state, {
        pending_burns: state.pending_burns.concat(action.object)
      });
    case TYPES.CONCAT_PENDING_TRANSFERS_TRON:
      return Object.assign({}, state, {
        pending_transfers: state.pending_transfers.concat(action.object)
      });
    default:
      return state;
  }
};

