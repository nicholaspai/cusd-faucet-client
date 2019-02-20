/**
 * Return tronweb object (akin to "Truffle" for Ethereum) connected to the Shasta testnet
 */
import TronWeb from 'tronweb';
const HttpProvider = TronWeb.providers.HttpProvider;
const NODE_URL = 'https://api.shasta.trongrid.io'
const fullNode = new HttpProvider(NODE_URL);
const solidityNode = new HttpProvider(NODE_URL);
const eventServer = NODE_URL;

const getDefaultTronWeb = async () => {
    const tronWeb = new TronWeb(
        fullNode,
        solidityNode,
        eventServer
    );
    return tronWeb
}


export default getDefaultTronWeb