import { TYPES } from "./viteActions";

// Initial state
export const initialState = {
  vite: {
    client: '',
    user_name: '',
    balance_vited: '',
    pending_mints: [],
    pending_burns: [],
    pending_transfers: [],
    network:'',
  }
};

// User Vite account state
export const vite = (state = initialState.vite, action) => {
  switch (action.type) {
    case TYPES.SET_VITE_CLIENT:
      return Object.assign({}, state, {
        client: action.object
      });
    case TYPES.SET_VITE_NAME:
      return Object.assign({}, state, {
        user_name: action.string
      });
    case TYPES.CONCAT_PENDING_MINTS_VITE:
      return Object.assign({}, state, {
        pending_mints: state.pending_mints.concat(action.object)
      });
    case TYPES.CONCAT_PENDING_BURNS_VITE:
      return Object.assign({}, state, {
        pending_burns: state.pending_burns.concat(action.object)
      });
    case TYPES.CONCAT_PENDING_TRANSFERS_VITE:
      return Object.assign({}, state, {
        pending_transfers: state.pending_transfers.concat(action.object)
      });
    case TYPES.SET_VITE_BALANCE:
      return Object.assign({}, state, {
        balance_vited: action.string
      });
    case TYPES.SET_VITE_NETWORK:
      return Object.assign({}, state, {
        network: action.string
      });
    default:
      return state;
  }
};

