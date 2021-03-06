import { JsonRpc } from 'eosjs';

export const EOS_NETWORK = {
  blockchain: "eos",
  protocol: "https",
  host: "jungle2.cryptolions.io",
  port: 443,
  chainId: "e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473" 
};

export const EOS_NETWORK_MAINNET = {
  blockchain: "eos",
  protocol: "https",
  host: "nodes.get-scatter.com",
  port: 443,
  chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906" 
};

export const EOS_RPC_URL = EOS_NETWORK.protocol+"://"+EOS_NETWORK.host+":"+EOS_NETWORK.port
export const EOS_RPC_URL_MAINNET = EOS_NETWORK_MAINNET.protocol+"://"+EOS_NETWORK_MAINNET.host+":"+EOS_NETWORK_MAINNET.port

export const rpc = new JsonRpc(EOS_RPC_URL);
export const rpcMainnet = new JsonRpc(EOS_RPC_URL_MAINNET);

// Contract details for CUSD
export const CONTRACT_CODE = "carbon12nick"
export const CONTRACT_CODE_MAINNET = "stablecarbon"
export const CURRENCY_PRECISION = 2

// EosJS transaction options
export const transactionOptions = {
  blocksBehind: 3,
  expireSeconds: 30,
  broadcast:true
}