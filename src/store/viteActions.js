// List of all actions that can be dispatched to redux store
export const TYPES = {
    SET_VITE_CLIENT: "SET_VITE_CLIENT",
    SET_VITE_NAME: "SET_VITE_NAME",
    CONCAT_PENDING_MINTS_VITE: "CONCAT_PENDING_MINTS_VITE",
    CONCAT_PENDING_BURNS_VITE: "CONCAT_PENDING_BURNS_VITE",
    CONCAT_PENDING_TRANSFERS_VITE: "CONCAT_PENDING_TRANSFERS_VITE",
    SET_VITE_BALANCE: "SET_VITE_BALANCE",
    SET_VITE_NETWORK: "SET_VITE_NETWORK",
  };
  
  export const viteActions = {
    setViteClient: object => ({
        type: TYPES.SET_VITE_CLIENT,
        object
    }),
    setViteName: string => ({
      type: TYPES.SET_VITE_NAME,
      string
    }),
    setViteNetwork: string => ({
      type: TYPES.SET_VITE_NETWORK,
      string
    }),
    concatPendingMints: object => ({
      type: TYPES.CONCAT_PENDING_MINTS_VITE,
      object
    }),
    concatPendingBurns: object => ({
      type: TYPES.CONCAT_PENDING_BURNS_VITE,
      object
    }),
    concatPendingTransfers: object => ({
      type: TYPES.CONCAT_PENDING_TRANSFERS_VITE,
      object
    }),
    setViteBalance: string => ({
      type: TYPES.SET_VITE_BALANCE,
      string
    })
  };
  
  