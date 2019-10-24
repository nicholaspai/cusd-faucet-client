import { JsonRpc } from 'eosjs';

export const TELOS_NETWORK = {
  blockchain: "eos",
  protocol: "https",
  host: "testnet.eos.miami",
  port: 443,
  chainId: "1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f" 
};

export const TELOS_RPC_URL = TELOS_NETWORK.protocol+"://"+TELOS_NETWORK.host+":"+TELOS_NETWORK.port

export const rpcTelos = new JsonRpc(TELOS_RPC_URL);

// Contract details for TLOSD
export const CONTRACT_CODE = "carboncarbon"
export const CONTRACT_CODE_MAINNET = "stablecarbon"
export const CURRENCY_PRECISION = 4

// EosJS transaction options
export const transactionOptions = {
  blocksBehind: 3,
  expireSeconds: 30,
  broadcast:true
}