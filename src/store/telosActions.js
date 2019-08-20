// List of all actions that can be dispatched to redux store
export const TYPES = {
    SET_TELOS_CLIENT: "SET_TELOS_CLIENT",
    SET_TELOS_NAME: "SET_TELOS_NAME",
    CONCAT_PENDING_MINTS_TELOS: "CONCAT_PENDING_MINTS_TELOS",
    CONCAT_PENDING_BURNS_TELOS: "CONCAT_PENDING_BURNS_TELOS",
    CONCAT_PENDING_TRANSFERS_TELOS: "CONCAT_PENDING_TRANSFERS_TELOS",
    SET_TELOS_BALANCE: "SET_TELOS_BALANCE",
    SET_SCATTER_STATE: "SET_SCATTER_STATE",
    SET_TELOS_NETWORK: "SET_TELOS_NETWORK",
  };
  
  export const telosActions = {
    setTelosClient: object => ({
        type: TYPES.SET_TELOS_CLIENT,
        object
    }),
    setTelosName: string => ({
      type: TYPES.SET_TELOS_NAME,
      string
    }),
    setTelosNetwork: string => ({
      type: TYPES.SET_TELOS_NETWORK,
      string
    }),
    concatPendingMints: object => ({
      type: TYPES.CONCAT_PENDING_MINTS_TELOS,
      object
    }),
    concatPendingBurns: object => ({
      type: TYPES.CONCAT_PENDING_BURNS_TELOS,
      object
    }),
    concatPendingTransfers: object => ({
      type: TYPES.CONCAT_PENDING_TRANSFERS_TELOS,
      object
    }),
    setTelosBalance: string => ({
      type: TYPES.SET_TELOS_BALANCE,
      string
    }),
    setScatterState: string => ({
      type:TYPES.SET_SCATTER_STATE,
      string
    }),
  
  
  };
  
  