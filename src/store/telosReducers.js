import { TYPES } from "./telosActions";

// Initial state
export const initialState = {
  telos: {
    client: '',
    user_name: '',
    balance_tlosd: '',
    pending_mints: [],
    pending_burns: [],
    pending_transfers: [],
    scatter_state:'',
    network:'',
  }
};

// User Telos account state
export const telos = (state = initialState.telos, action) => {
  switch (action.type) {
    case TYPES.SET_TELOS_CLIENT:
      return Object.assign({}, state, {
        client: action.object
      });
    case TYPES.SET_TELOS_NAME:
      return Object.assign({}, state, {
        user_name: action.string
      });
    case TYPES.CONCAT_PENDING_MINTS_TELOS:
      return Object.assign({}, state, {
        pending_mints: state.pending_mints.concat(action.object)
      });
    case TYPES.CONCAT_PENDING_BURNS_TELOS:
      return Object.assign({}, state, {
        pending_burns: state.pending_burns.concat(action.object)
      });
    case TYPES.CONCAT_PENDING_TRANSFERS_TELOS:
      return Object.assign({}, state, {
        pending_transfers: state.pending_transfers.concat(action.object)
      });
    case TYPES.SET_TELOS_BALANCE:
      return Object.assign({}, state, {
        balance_cusd: action.string
      });
    case TYPES.SET_SCATTER_STATE:
      return Object.assign({}, state, {
        scatter_state: action.string
      });
    case TYPES.SET_TELOS_NETWORK:
      return Object.assign({}, state, {
        network: action.string
      });
    default:
      return state;
  }
};

