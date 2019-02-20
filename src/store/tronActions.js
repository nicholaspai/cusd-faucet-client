// List of all actions that can be dispatched to redux store
export const TYPES = {
    SET_TRON_ADDRESS: "SET_TRON_ADDRESS",
    SET_TRON_BALANCE: "SET_TRON_BALANCE",
    CONCAT_PENDING_MINTS: "CONCAT_PENDING_MINTS",
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
      type: TYPES.CONCAT_PENDING_MINTS,
      object
    }),
    // Add a pending mint transaction to user profile
  
};
  
  