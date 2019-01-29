import React from "react";
import { Api, JsonRpc } from "eosjs";
import ScatterJS from "scatterjs-core";
import ScatterEOS from "scatterjs-plugin-eosjs2";
import {fetch} from 'node-fetch';  

const endpoint = "https://jungle.eosio.cr:443"

const network = {
  blockchain: "eos",
  protocol: "http",
  host: "jungle.eosio.cr",
  port: 443,
  chainId: "e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473" 
};
const URL = 'https://jungle.eosio.cr:443'
export const rpc = new JsonRpc(URL,{fetch});

export default class EOSIOClient extends React.Component {
 
  constructor(contractAccount)   {
    super(contractAccount);
    
    
    this.contractAccount = contractAccount;
    ScatterJS.plugins(new ScatterEOS());
    try {
      ScatterJS.scatter.connect(this.contractAccount).then(connected => {
        if (!connected) {
          console.log("Issue Connecting")
          this.noScatter= true
          return;
        } else {
          this.noScatter = false
        }
        const scatter = ScatterJS.scatter;
        const requiredFields = {
          accounts: [network] // We defined this above
        };
      
        scatter.getIdentity(requiredFields).then(() => {
          
          this.account = scatter.identity.accounts.find(
            x => x.blockchain === "eos"
            
          );
          
          const rpc = new JsonRpc(endpoint);    
          
          this.eos = scatter.eos(network, Api, { rpc });   
        });
        window.ScatterJS = null;
      });

    } catch (error) {
      console.log(error);
    }
  } 
  
}







