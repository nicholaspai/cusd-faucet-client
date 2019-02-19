// List of all actions that can be dispatched to redux store
export const TYPES = {
    SET_TRON_ADDRESS: "SET_TRON_ADDRESS"
  };
  
  export const tronActions = {
    setTronAddress: string => ({
      type: TYPES.SET_TRON_ADDRESS,
      string
    }),
    // Set user tron account
};
  
  