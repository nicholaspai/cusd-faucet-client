// REST API server
import axios from 'axios'
import config from '../config'
const SERVER = config.server_url
const USERS_ENDPOINT = SERVER+"api/accounts/users"

const loginUser = async (username, password) => {
    try {
        let get_data = {
            user: username,
            password: password, 
        }
        console.log('get data: ', get_data)

        let db_get_response = await axios.get(
            USERS_ENDPOINT,
            get_data
          );

        // if successfully signed in user
        if (db_get_response.data) {
            let user_id = db_get_response.data.key
            let user_password = db_get_response.data.value
            return {
                user: user_id,
                password: user_password
            }
        } else {
            console.log('user does not exist')
            return false
        }
    } catch(err) {
        console.log('unable to connect users accounts database: ', USERS_ENDPOINT)
        return false
    }
    
}

export default loginUser