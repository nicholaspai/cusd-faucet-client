import { TYPES } from "./eosActions";

// Initial state
export const initialState = {
  eos: {
    client: '',
    user_name: '',
    balance_cusd: '',
    eos_mints: [],
    pending_transfers: [],
    pending_burns: [],
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
    case TYPES.CONCAT_EOS_MINTS:
      return Object.assign({}, state, {
        eos_mints: state.eos_mints.concat(action.object)
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

