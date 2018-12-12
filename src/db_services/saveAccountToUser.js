// REST API server
import axios from 'axios'
import config from '../config'
const SERVER = config.server_url
const ACCOUNTS_ENDPOINT = SERVER+"api/accounts"

const saveAccountToUser = async (post_data) => {
    try {
        let db_get_response = await axios.get(
            ACCOUNTS_ENDPOINT
        )
        console.log('get response: ', db_get_response)
        let db_post_response = await axios.post(
            ACCOUNTS_ENDPOINT,
            post_data
          );
        console.log('post response: ', db_post_response)
        return db_post_response; 
    } catch(err) {
        console.log('unable to connect to accounts database: ', ACCOUNTS_ENDPOINT)
    }
    
}

export default saveAccountToUser