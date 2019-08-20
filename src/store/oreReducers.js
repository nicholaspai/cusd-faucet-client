import { TYPES } from "./oreActions";

// Initial state
export const initialState = {
  ore: {
    client: '',
    user_name: '',
    balance_ored: '',
    pending_mints: [],
    pending_burns: [],
    pending_transfers: [],
    scatter_state:'',
    network:'',
  }
};

// User Ore account state
export const ore = (state = initialState.ore, action) => {
  switch (action.type) {
    case TYPES.SET_ORE_CLIENT:
      return Object.assign({}, state, {
        client: action.object
      });
    case TYPES.SET_ORE_NAME:
      return Object.assign({}, state, {
        user_name: action.string
      });
    case TYPES.CONCAT_PENDING_MINTS_ORE:
      return Object.assign({}, state, {
        pending_mints: state.pending_mints.concat(action.object)
      });
    case TYPES.CONCAT_PENDING_BURNS_ORE:
      return Object.assign({}, state, {
        pending_burns: state.pending_burns.concat(action.object)
      });
    case TYPES.CONCAT_PENDING_TRANSFERS_ORE:
      return Object.assign({}, state, {
        pending_transfers: state.pending_transfers.concat(action.object)
      });
    case TYPES.SET_ORE_BALANCE:
      return Object.assign({}, state, {
        balance_ored: action.string
      });
    case TYPES.SET_SCATTER_STATE:
      return Object.assign({}, state, {
        scatter_state: action.string
      });
    case TYPES.SET_ORE_NETWORK:
      return Object.assign({}, state, {
        network: action.string
      });
    default:
      return state;
  }
};

