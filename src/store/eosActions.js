// List of all actions that can be dispatched to redux store
export const TYPES = {
  SET_EOS_CLIENT: "SET_EOS_CLIENT",
  SET_EOS_NAME: "SET_EOS_NAME",
  CONCAT_EOS_MINTS: "CONCAT_EOS_MINTS",
  SET_EOS_BALANCE: "SET_EOS_BALANCE",
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
  concatEosMints: object => ({
    type: TYPES.CONCAT_EOS_MINTS,
    object
  }),
  setEosBalance: string => ({
    type: TYPES.SET_EOS_BALANCE,
    string
  }),


};

