/** HELPER FUNCTIONS **/

// See docs.ethers.io: If the progressCallback is specified, 
// it will be called periodically during encryption with a value between 0 and 1, 
// inclusive indicating the progress.
function callback_encrypt(progress) {
    let percentComplete = parseInt(progress * 100)
    if ( percentComplete%20 === 0 ) {
        console.log("Encrypting: " + percentComplete + "% complete");
    }
}

/** PUBLIC FUNCTIONS **/

// Encrypt JSON wallet
// @param password Password used to encrypt JSON wallet
const encryptAccount = async (password, wallet_json) => {
    console.log(password, wallet_json)
    let encryptedJson
    if (wallet_json) {
        encryptedJson = await wallet_json.encrypt(password, callback_encrypt);
    }
    return encryptedJson
}

export default encryptAccount