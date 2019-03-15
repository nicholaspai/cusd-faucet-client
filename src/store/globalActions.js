// List of all actions that can be dispatched to redux store
export const TYPES = {
  SET_TRONWEB: "SET_TRONWEB",
  SET_WEB3: "SET_WEB3",
  SET_WEB3_NETWORK: "SET_WEB3_NETWORK",
  SET_PAGE: "SET_PAGE",
  SET_USERNAME: "SET_USERNAME",
  SET_PASSWORD: "SET_PASSWORD",
  SET_NETWORK: "SET_NETWORK",
  SET_EOS: "SET_EOS"
};

// Page options for main site
export const PAGES = {
  MAIN: 0,
  ACCOUNTS: 1,
  INFO: 2,
  SWAP: 3,
}

// Network options for home page
export const NETWORKS = {
  ETH: 0,
  EOS: 1,
  TRON: 2
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

  setWeb3Network: number => ({
    type: TYPES.SET_WEB3_NETWORK,
    number
  }), 
  // Set Web3 network ID number

  setUsername: string => ({
    type: TYPES.SET_USERNAME,
    string
  }), 
  // Set User identity key: 'username'

  setPassword: string => ({
    type: TYPES.SET_PASSWORD,
    string
  }), 
  // Set User identity key: 'password'


  setEOS: object => ({
    type:TYPES.SET_EOS,
    object
  }),
  // Set EOS object

  setTronWeb: object => ({
    type: TYPES.SET_TRONWEB,
    object
  }), 
  // Set TronWeb object

  setNetwork: number => ({
    type: TYPES.SET_NETWORK,
    number
  }),
  // Set cryptonetwork

};

