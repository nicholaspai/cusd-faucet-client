import { WS_RPC } from '@vite/vitejs-ws'
import { client } from '@vite/vitejs'
import { sleep } from '../utils/sleep'

const ADDRESSES = {
    TEST: `wss://premainnet.vitewallet.com/test/ws`
}

/**
 * @function getClient
 */
export const getClient = async () => {
    let URL = ADDRESSES.TEST
    let provider = new WS_RPC(URL)

    let count = 0
    while (true) {
        if (!provider.connectStatus) {
            console.log(`[Vite-Provider] Failed to connect to TESTNET node (${URL}) on attempt #${count}`)
            count += 1
            await sleep(1000)
            continue;
        } else {
            break;
        }
    }
    
    // Instantiate new client from provider
    let _client = new client(provider, () => {
        console.log(`[Provider] Connected to client, path => `, provider.path);
    })
    return _client  
}