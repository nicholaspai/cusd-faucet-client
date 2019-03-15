// List of all actions that can be dispatched to redux store
export const TYPES = {
  SET_EOS_CLIENT: "SET_EOS_CLIENT",
  SET_EOS_NAME: "SET_EOS_NAME",
  CONCAT_PENDING_MINTS_EOS: "CONCAT_PENDING_MINTS_EOS",
  CONCAT_PENDING_BURNS_EOS: "CONCAT_PENDING_BURNS_EOS",
  CONCAT_PENDING_TRANSFERS_EOS: "CONCAT_PENDING_TRANSFERS_EOS",
  SET_EOS_BALANCE: "SET_EOS_BALANCE",
  SET_SCATTER_STATE: "SET_SCATTER_STATE",
  SET_EOS_NETWORK: "SET_EOS_NETWORK",
};

export const eosActions = {
  setEosClient: object => ({
  	type: TYPES.SET_EOS_CLIENT,
  	object
  }),
  setEosName: string => ({
    type: TYPES.SET_EOS_NAME,
    string
  }),
  setEosNetwork: string => ({
    type: TYPES.SET_EOS_NETWORK,
    string
  }),
  concatPendingMints: object => ({
    type: TYPES.CONCAT_PENDING_MINTS_EOS,
    object
  }),
  concatPendingBurns: object => ({
    type: TYPES.CONCAT_PENDING_BURNS_EOS,
    object
  }),
  concatPendingTransfers: object => ({
    type: TYPES.CONCAT_PENDING_TRANSFERS_EOS,
    object
  }),
  setEosBalance: string => ({
    type: TYPES.SET_EOS_BALANCE,
    string
  }),
  setScatterState: string => ({
    type:TYPES.SET_SCATTER_STATE,
    string
  }),


};

