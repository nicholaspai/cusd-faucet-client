// List of all actions that can be dispatched to redux store
export const TYPES = {
    SET_ORE_CLIENT: "SET_ORE_CLIENT",
    SET_ORE_NAME: "SET_ORE_NAME",
    CONCAT_PENDING_MINTS_ORE: "CONCAT_PENDING_MINTS_ORE",
    CONCAT_PENDING_BURNS_ORE: "CONCAT_PENDING_BURNS_ORE",
    CONCAT_PENDING_TRANSFERS_ORE: "CONCAT_PENDING_TRANSFERS_ORE",
    SET_ORE_BALANCE: "SET_ORE_BALANCE",
    SET_SCATTER_STATE: "SET_SCATTER_STATE",
    SET_ORE_NETWORK: "SET_ORE_NETWORK",
  };
  
  export const oreActions = {
    setOreClient: object => ({
        type: TYPES.SET_ORE_CLIENT,
        object
    }),
    setOreName: string => ({
      type: TYPES.SET_ORE_NAME,
      string
    }),
    setOreNetwork: string => ({
      type: TYPES.SET_ORE_NETWORK,
      string
    }),
    concatPendingMints: object => ({
      type: TYPES.CONCAT_PENDING_MINTS_ORE,
      object
    }),
    concatPendingBurns: object => ({
      type: TYPES.CONCAT_PENDING_BURNS_ORE,
      object
    }),
    concatPendingTransfers: object => ({
      type: TYPES.CONCAT_PENDING_TRANSFERS_ORE,
      object
    }),
    setOreBalance: string => ({
      type: TYPES.SET_ORE_BALANCE,
      string
    }),
    setScatterState: string => ({
      type:TYPES.SET_SCATTER_STATE,
      string
    }),
  
  
  };
  
  