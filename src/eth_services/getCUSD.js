// Fetch active CUSD instance
export const getCUSD = (web3) => {
    if (!web3) return;
    // Contract ABI's
    const ABI = require("../contracts/MetaToken.json");

    // Contract Ropsten Addresses
    const ADDRESS = "0x67450c8908e2701abfa6745be3949ad32acf42d8";

    var jsonFile = ABI;
    var abi = jsonFile.abi;
    var deployedAddress = ADDRESS;
    const instance = new web3.eth.Contract(abi, deployedAddress);
    return instance;
}