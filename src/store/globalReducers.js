import { TYPES, PAGES, NETWORKS } from "./globalActions";

// Initial state
export const initialState = {
  global: {
    web3: '',
    web3_network: '',
    page: PAGES.MAIN,
    username: '',
    password: '',
    network: NETWORKS.EOS,
    eos_client: '',
    telos_client: '',
    ore_client: '',
    tronWeb: '',
  },
};

// Global app state
export const global = (state = initialState.global, action) => {
  switch (action.type) {
    case TYPES.SET_WEB3:
      return Object.assign({}, state, {
        web3: action.object
      });
    case TYPES.SET_WEB3_NETWORK:
      return Object.assign({}, state, {
        web3_network: action.number
      });
    case TYPES.SET_PAGE:
      return Object.assign({}, state, {
        page: action.number
      });
    case TYPES.SET_USERNAME:
      return Object.assign({}, state, {
        username: action.string
      });
    case TYPES.SET_PASSWORD:
      return Object.assign({}, state, {
        password: action.string
      });
    case TYPES.SET_NETWORK:
      return Object.assign({}, state, {
        network: action.number
      });
    case TYPES.SET_EOS:
      return Object.assign({}, state, {
        eos_client:action.object
      });
    case TYPES.SET_TELOS:
      return Object.assign({}, state, {
        eos_client:action.object
      });
    case TYPES.SET_ORE:
      return Object.assign({}, state, {
        ore_client:action.object
      });
    case TYPES.SET_TRONWEB:
      return Object.assign({}, state, {
        tronWeb: action.object
      });
    default:
      return state;
  }
};

