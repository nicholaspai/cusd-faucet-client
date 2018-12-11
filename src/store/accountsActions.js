// List of all actions that can be dispatched to redux store
export const TYPES = {
  ADD_ETH_ACCOUNT: "ADD_ETH_ACCOUNT",
  ADD_EOS_ACCOUNT: "ADD_EOS_ACCOUNT"
};

export const accountsActions = {
  addEthAccount: object => ({
    type: TYPES.ADD_ETH_ACCOUNT,
    object
  }),
  // add an ETH account object

  addEosAccount: object => ({
    type: TYPES.ADD_EOS_ACCOUNT,
    object
  }),
  // add an EOS account object

};

