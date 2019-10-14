import { TYPES } from "./harmonyActions";

// Initial state
export const initialState = {
  harmony: {
    client: '',
    user_name: '',
    balance_oned: '',
    pending_mints: [],
    pending_burns: [],
    pending_transfers: [],
    network:'',
  }
};

// User Harmony account state
export const harmony = (state = initialState.harmony, action) => {
  switch (action.type) {
    case TYPES.SET_HARMONY_CLIENT:
      return Object.assign({}, state, {
        client: action.object
      });
    case TYPES.SET_HARMONY_NAME:
      return Object.assign({}, state, {
        user_name: action.string
      });
    case TYPES.CONCAT_PENDING_MINTS_HARMONY:
      return Object.assign({}, state, {
        pending_mints: state.pending_mints.concat(action.object)
      });
    case TYPES.CONCAT_PENDING_BURNS_HARMONY:
      return Object.assign({}, state, {
        pending_burns: state.pending_burns.concat(action.object)
      });
    case TYPES.CONCAT_PENDING_TRANSFERS_HARMONY:
      return Object.assign({}, state, {
        pending_transfers: state.pending_transfers.concat(action.object)
      });
    case TYPES.SET_HARMONY_BALANCE:
      return Object.assign({}, state, {
        balance_oned: action.string
      });
    case TYPES.SET_HARMONY_NETWORK:
      return Object.assign({}, state, {
        network: action.string
      });
    default:
      return state;
  }
};

