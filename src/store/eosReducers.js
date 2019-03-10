import { TYPES } from "./eosActions";

// Initial state
export const initialState = {
  eos: {
    client: '',
    user_name: '',
    balance_cusd: '',
    pending_mints: [],
    pending_burns: [],
    pending_transfers: [],
    scatter_state:'',
  },
};

// User Eos account state
export const eos = (state = initialState.eos, action) => {
  switch (action.type) {
    case TYPES.SET_EOS_CLIENT:
      return Object.assign({}, state, {
        client: action.object
      });
    case TYPES.SET_EOS_NAME:
      return Object.assign({}, state, {
        user_name: action.string
      });
    case TYPES.CONCAT_PENDING_MINTS_EOS:
      return Object.assign({}, state, {
        pending_mints: state.pending_mints.concat(action.object)
      });
    case TYPES.CONCAT_PENDING_BURNS_EOS:
      return Object.assign({}, state, {
        pending_burns: state.pending_burns.concat(action.object)
      });
    case TYPES.CONCAT_PENDING_TRANSFERS_EOS:
      return Object.assign({}, state, {
        pending_transfers: state.pending_transfers.concat(action.object)
      });
    case TYPES.SET_EOS_BALANCE:
      return Object.assign({}, state, {
        balance_cusd: action.string
      });
    case TYPES.SET_SCATTER_STATE:
      return Object.assign({}, state, {
        scatter_state: action.string
      });

    default:
      return state;
  }
};

