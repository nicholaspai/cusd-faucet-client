// List of all actions that can be dispatched to redux store
export const TYPES = {
  SET_ETH_ADDRESS: "SET_ETH_ADDRESS",
  SET_WEB3: "SET_WEB3",
  SET_ETH_BALANCE: "SET_ETH_BALANCE",
  CONCAT_PENDING_MINTS: "CONCAT_PENDING_MINTS",
  CONCAT_PENDING_TRANSFERS: "CONCAT_PENDING_TRANSFERS",
  CONCAT_PENDING_BURNS: "CONCAT_PENDING_BURNS",
  SET_PAGE: "SET_PAGE"
};

export const PAGES = {
  MAIN: 0,
  INFO: 1
}

export const actions = {
  setPage: number => ({
    type: TYPES.SET_PAGE,
    number
  }), 
  // Set Page

  setWeb3: object => ({
    type: TYPES.SET_WEB3,
    object
  }), 
  // Set Web3 object

  setEthAddress: string => ({
    type: TYPES.SET_ETH_ADDRESS,
    string
  }),
  // Set user eth account

  setEthBalance: string => ({
    type: TYPES.SET_ETH_BALANCE,
    string
  }),
  // Set cusd-eth balance

  concatPendingMints: object => ({
    type: TYPES.CONCAT_PENDING_MINTS,
    object
  }),
  // Add a pending mint transaction to user profile

  concatPendingTransfers: object => ({
    type: TYPES.CONCAT_PENDING_TRANSFERS,
    object
  }),
  // Add a pending transfer transaction to user profile

  concatPendingBurns: object => ({
    type: TYPES.CONCAT_PENDING_BURNS,
    object
  }),
  // Add a pending burn transaction to user profile


};

