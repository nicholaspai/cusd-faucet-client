import { JsonRpc } from 'eosjs';

export const TELOS_NETWORK = {
  blockchain: "eos",
  protocol: "https",
  host: "testnet.eos.miami",
  port: 443,
  chainId: "e17615decaecd202a365f4c029f206eee98511979de8a5756317e2469f2289e3" 
};

export const TELOS_RPC_URL = TELOS_NETWORK.protocol+"://"+TELOS_NETWORK.host+":"+TELOS_NETWORK.port

export const rpcTelos = new JsonRpc(TELOS_RPC_URL);

// Contract details for TLOSD
export const CONTRACT_CODE = "stablecarbon"
export const CONTRACT_CODE_MAINNET = "stablecarbon"
export const CURRENCY_PRECISION = 4

// EosJS transaction options
export const transactionOptions = {
  blocksBehind: 3,
  expireSeconds: 30,
  broadcast:true
}