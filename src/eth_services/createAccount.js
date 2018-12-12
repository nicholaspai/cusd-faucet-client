import { ethers } from 'ethers';

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

// Create a new random wallet and encrypt it in JSON form
// @param password Password used to encrypt new JSON wallet
const createAccount = async (password) => {
    let randomWallet = new ethers.Wallet.createRandom()
    let encryptedJson = randomWallet
    if (password) {
        encryptedJson = await randomWallet.encrypt(password, callback_encrypt);
    }
    return encryptedJson
}

export default createAccount