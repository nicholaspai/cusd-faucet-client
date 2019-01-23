import { TYPES } from "./accountsActions";

// Initial state
export const initialState = {
  account: {
      eth_accounts: [],
      eos_accounts: [],
  },
};

// Account/Identity management state
export const accounts = (state = initialState.account, action) => {
  switch (action.type) {
    case TYPES.ADD_ETH_ACCOUNT:
      return Object.assign({}, state, {
        eth_accounts: state.eth_accounts.concat(action.object)
      });
    case TYPES.CLEAR_ETH_ACCOUNTS:
      return Object.assign({}, state, {
        eth_accounts: []
      });
    case TYPES.ADD_EOS_ACCOUNT:
      return Object.assign({}, state, {
        eos_accounts: state.eos_accounts.concat(action.object)
      });
    default:
      return state;
  }
};

