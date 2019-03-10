import { JsonRpc } from 'eosjs';

export const EOS_NETWORK = { /** Change this to connect to Mainnet/Jungle */
  blockchain: "eos",
  protocol: "https",
  host: "jungle2.cryptolions.io",
  port: 443,
  chainId: "e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473" 
};
export const EOS_RPC_URL = EOS_NETWORK.protocol+"://"+EOS_NETWORK.host+":"+EOS_NETWORK.port

export const rpc = new JsonRpc(EOS_RPC_URL);

// Contract details for CUSD
export const CONTRACT_CODE = "carbon12nick"
export const CURRENCY_PRECISION = 2

// EosJS transaction options
export const transactionOptions = {
  blocksBehind: 3,
  expireSeconds: 30,
  broadcast:true
}