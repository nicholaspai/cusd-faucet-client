// REST API server
import axios from 'axios'
import config from '../config'
const SERVER = config.server_url
const WALLETS_ENDPOINT = SERVER+"api/accounts/wallets"

const saveAccountToUser = async (post_data) => {
    try {
        // let db_get_response = await axios.get(
        //     WALLETS_ENDPOINT
        // )
        let db_post_response = await axios.post(
            WALLETS_ENDPOINT,
            post_data
          );
        return db_post_response; 
    } catch(err) {
        console.log('unable to connect to wallets database: ', WALLETS_ENDPOINT)
    }
    
}

export default saveAccountToUser