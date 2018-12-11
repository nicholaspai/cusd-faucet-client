import { TYPES, PAGES } from "./actions";

// Initial state
export const initialState = {
  eth: {
    user_address: '',
    balance_cusd: '',
    pending_mints: [],
    pending_transfers: [],
    pending_burns: [],
  },
  global: {
    web3: '',
    page: PAGES.MAIN,
  },
};

// User Ethereum account state
export const eth = (state = initialState.eth, action) => {
  switch (action.type) {
    case TYPES.SET_ETH_ADDRESS:
      return Object.assign({}, state, {
        user_address: action.string
      });
    case TYPES.SET_ETH_BALANCE:
      return Object.assign({}, state, {
        balance_cusd: action.string
      });
    case TYPES.CONCAT_PENDING_MINTS:
      return Object.assign({}, state, {
        pending_mints: state.pending_mints.concat(action.object)
      });
    case TYPES.CONCAT_PENDING_TRANSFERS:
      return Object.assign({}, state, {
        pending_transfers: state.pending_transfers.concat(action.object)
      });
    case TYPES.CONCAT_PENDING_BURNS:
      return Object.assign({}, state, {
        pending_burns: state.pending_burns.concat(action.object)
      });
    default:
      return state;
  }
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

