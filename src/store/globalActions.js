// List of all actions that can be dispatched to redux store
export const TYPES = {
  SET_WEB3: "SET_WEB3",
  SET_PAGE: "SET_PAGE"
};

// Page options for main site
export const PAGES = {
  MAIN: 0,
  ACCOUNTS: 1,
  INFO: 2
}

export const globalActions = {
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
};

