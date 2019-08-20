// List of all actions that can be dispatched to redux store
export const TYPES = {
  ADD_ETH_ACCOUNT: "ADD_ETH_ACCOUNT",
  ADD_EOS_ACCOUNT: "ADD_EOS_ACCOUNT",
  ADD_TELOS_ACCOUNT: "ADD_TELOS_ACCOUNT",
  CLEAR_ETH_ACCOUNTS: "CLEAR_ETH_ACCOUNTS"
};

// Mapping of all blockchain networks that accounts can exist on
export const NETWORKS ={
  ETH: 0,
  EOS: 1,
  TELOS: 3
}

export const accountsActions = {
  addEthAccount: object => ({
    type: TYPES.ADD_ETH_ACCOUNT,
    object
  }),
  // add an ETH account object

  clearEthAccounts: object => ({
    type: TYPES.CLEAR_ETH_ACCOUNTS
  }),
  // add an ETH account object

  addEosAccount: object => ({
    type: TYPES.ADD_EOS_ACCOUNT,
    object
  }),
  // add an EOS account object

  addTelosAccount: object => ({
    type: TYPES.ADD_TELOS_ACCOUNT,
    object
  }),
  // add an TELOS account object

};

