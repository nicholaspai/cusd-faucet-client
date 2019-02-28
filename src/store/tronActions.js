// List of all actions that can be dispatched to redux store
export const TYPES = {
    SET_TRON_ADDRESS: "SET_TRON_ADDRESS",
    SET_TRON_BALANCE: "SET_TRON_BALANCE",
    CONCAT_PENDING_MINTS_TRON: "CONCAT_PENDING_MINTS_TRON",
    CONCAT_PENDING_BURNS_TRON: "CONCAT_PENDING_BURNS_TRON",
    CONCAT_PENDING_TRANSFERS_TRON: "CONCAT_PENDING_TRANSFERS_TRON",
  };
  
  export const tronActions = {
    setTronAddress: string => ({
      type: TYPES.SET_TRON_ADDRESS,
      string
    }),
    // Set user tron account

    setTronBalance: string => ({
      type: TYPES.SET_TRON_BALANCE,
      string
    }),
    // Set cusd-tron balance

    concatPendingMints: object => ({
      type: TYPES.CONCAT_PENDING_MINTS_TRON,
      object
    }),
    // Add a pending mint transaction to user profile

    concatPendingBurns: object => ({
      type: TYPES.CONCAT_PENDING_BURNS_TRON,
      object
    }),
    // Add a pending burn transaction to user profile
    
    concatPendingTransfers: object => ({
      type: TYPES.CONCAT_PENDING_TRANSFERS_TRON,
      object
    }),
    // Add a pending transfer transaction to user profile

};
  
  