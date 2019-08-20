import { JsonRpc } from 'eosjs';

export const ORE_NETWORK = {
  blockchain: "eos",
  protocol: "https",
  host: "ore-staging.openrights.exchange",
  port: 443,
  chainId: "a6df478d5593b4efb1ea20d13ba8a3efc1364ee0bf7dbd85d8d756831c0e3256" 
};

export const ORE_RPC_URL = ORE_NETWORK.protocol+"://"+ORE_NETWORK.host+":"+ORE_NETWORK.port

export const rpcOre = new JsonRpc(ORE_RPC_URL);

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