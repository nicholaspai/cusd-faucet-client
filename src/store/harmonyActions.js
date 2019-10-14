// List of all actions that can be dispatched to redux store
export const TYPES = {
    SET_HARMONY_CLIENT: "SET_HARMONY_CLIENT",
    SET_HARMONY_NAME: "SET_HARMONY_NAME",
    CONCAT_PENDING_MINTS_HARMONY: "CONCAT_PENDING_MINTS_HARMONY",
    CONCAT_PENDING_BURNS_HARMONY: "CONCAT_PENDING_BURNS_HARMONY",
    CONCAT_PENDING_TRANSFERS_HARMONY: "CONCAT_PENDING_TRANSFERS_HARMONY",
    SET_HARMONY_BALANCE: "SET_HARMONY_BALANCE",
    SET_HARMONY_NETWORK: "SET_HARMONY_NETWORK",
  };
  
  export const harmonyActions = {
    setHarmonyClient: object => ({
        type: TYPES.SET_HARMONY_CLIENT,
        object
    }),
    setHarmonyName: string => ({
      type: TYPES.SET_HARMONY_NAME,
      string
    }),
    setHarmonyNetwork: string => ({
      type: TYPES.SET_HARMONY_NETWORK,
      string
    }),
    concatPendingMints: object => ({
      type: TYPES.CONCAT_PENDING_MINTS_HARMONY,
      object
    }),
    concatPendingBurns: object => ({
      type: TYPES.CONCAT_PENDING_BURNS_HARMONY,
      object
    }),
    concatPendingTransfers: object => ({
      type: TYPES.CONCAT_PENDING_TRANSFERS_HARMONY,
      object
    }),
    setHarmonyBalance: string => ({
      type: TYPES.SET_HARMONY_BALANCE,
      string
    })
  };
  
  