// REST API server
import axios from 'axios'
import config from '../config'
const SERVER = config.server_url
const USERS_ENDPOINT = SERVER+"api/accounts/users"

const saveUser = async (username, password) => {
    try {
        let post_data = {
            user: username,
            password: password, 
        }

        let db_post_response = await axios.post(
            USERS_ENDPOINT,
            post_data
          );

        // if successfully created new user
        if (db_post_response.data) {
            let new_user_id = db_post_response.data.key
            let new_password = db_post_response.data.value
            return {
                user: new_user_id,
                password: new_password
            }
        } else {
            // user already exists or error
            console.log('user already exists or error')
            return false
        }
    } catch(err) {
        console.log('unable to connect users accounts database: ', USERS_ENDPOINT)
        return false
    }
    
}

export default saveUser