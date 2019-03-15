import { JsonRpc } from 'eosjs';

export const EOS_NETWORK = { /** Change this to connect to Mainnet/Jungle */
  blockchain: "eos",
  protocol: "https",
  host: "nodes.get-scatter.com",
  port: 443,
  chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906" 
};
export const EOS_RPC_URL = EOS_NETWORK.protocol+"://"+EOS_NETWORK.host+":"+EOS_NETWORK.port

export const rpc = new JsonRpc(EOS_RPC_URL);

// Contract details for CUSD
export const CONTRACT_CODE = "stablecarbon"
export const CURRENCY_PRECISION = 2

// EosJS transaction options
export const transactionOptions = {
  blocksBehind: 3,
  expireSeconds: 30,
  broadcast:true
}