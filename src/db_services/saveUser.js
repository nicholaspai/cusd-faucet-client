// REST API server
import axios from 'axios'
import config from '../config'
const SERVER = config.server_url
const USERS_ENDPOINT = SERVER+"api/accounts/users"

const saveUser = async (post_data) => {
    try {
        // let db_get_response = await axios.get(
        //     USERS_ENDPOINT
        // )
        let db_post_response = await axios.post(
            USERS_ENDPOINT,
            post_data
          );
        return db_post_response; 
    } catch(err) {
        console.log('unable to connect users accounts database: ', USERS_ENDPOINT)
    }
    
}

export default saveUser