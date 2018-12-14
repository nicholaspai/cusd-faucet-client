// REST API server
import axios from 'axios'
import config from '../config'
const SERVER = config.server_url
const USERS_ENDPOINT = SERVER+"api/accounts/users"

const loginUser = async (username, password) => {
    console.log("LOGIN")
    try {
        let post_data = {
            user: username,
            password: password, 
        }
        console.log(post_data)
        let response = await axios.get(
            USERS_ENDPOINT,
            post_data
        );
        console.log(response)
        // // new user was created
        // if (response.data) {
        //     let key = response.data.key
        //     let value = response.data.value
        //     console.log('key: ', key)
        //     console.log('value: ', value)

        //     return {
        //         key, value
        //     }
        // } else {
        //     // error or user already exists
        //     console.log('invalid account or user already exists')
        //     return false
        // } 
    } catch(err) {
        console.log('unable to connect users accounts database: ', USERS_ENDPOINT)
        console.log(err)
        return  false
    }
    
}

export default loginUser