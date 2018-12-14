// REST API server
import axios from 'axios'
import config from '../config'
const SERVER = config.server_url
const WALLETS_ENDPOINT = SERVER+"api/accounts/wallets"

const saveAccountToUser = async (username, password, chainId, eth_address, encrypted_json) => {
    try {
        let post_data = {
            user: username,
            password: password,
            chainId: chainId,
            accountName: eth_address,
            wallet: JSON.stringify(encrypted_json)
        }
        console.log('data to post: ', post_data)

        let db_post_response = await axios.post(
            WALLETS_ENDPOINT,
            post_data
          );

        // if successfully created wallet
        if (db_post_response.data) {
            let new_wallets_key = db_post_response.data.key
            let new_wallet = db_post_response.data.value
            return {
                wallet_key: new_wallets_key,
                wallet: new_wallet
            }
        } else {
            console.log('user does not exist')
            return false
        }
    } catch(err) {
        console.log('unable to connect users accounts database: ', WALLETS_ENDPOINT)
        return false
    }
    
}

export default saveAccountToUser