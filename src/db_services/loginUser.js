// REST API server
import axios from 'axios'
import config from '../config'

const SERVER = config.server_url
const USERS_ENDPOINT = SERVER+"api/accounts/users"


const loginUser = async (username, password) => {
    let params = {
        user: username,
        password: password, 
    }
    try {
        let db_get_response = await axios.get(
            USERS_ENDPOINT,
            { params }
          );
        
        // if successfully signed in user
        if (db_get_response.data) {
            let user_id = db_get_response.data.key
            let user_password = db_get_response.data.value.password
            let user_wallets = db_get_response.data.value.chainAccounts
            return {
                user: user_id,
                password: user_password,
                wallets: user_wallets
            }
        } else {
            console.log('user does not exist')
            return false
        }
    } catch(err) {
        console.log('invalid username password combo: ', params)
        return false
    }
    
}

export default loginUser