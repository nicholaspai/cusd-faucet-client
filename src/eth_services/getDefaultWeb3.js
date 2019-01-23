import Web3 from 'web3';

// Config 
import config from '../config'

const getDefaultWeb3 = async () => {
    var WEB_3_NODE = ('wss://ropsten.infura.io/ws/v3/'+config.infura_public_key)
    let default_web3 = new Web3(new Web3.providers.WebsocketProvider(WEB_3_NODE));
    let default_network = await default_web3.eth.net.getId()
    return {
        web3: default_web3, 
        network: default_network
    }
}

export default getDefaultWeb3