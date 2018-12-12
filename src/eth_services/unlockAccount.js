import { ethers } from 'ethers';

/** HELPER FUNCTIONS **/

function callback_decrypt(progress) {
    let percentComplete = parseInt(progress * 100)
    if ( percentComplete%20 === 0 ) {
        console.log("Decrypting: " + percentComplete + "% complete");
    }
}

/** PUBLIC FUNCTIONS **/

// Decrypt walletJSON file with password
const unlockWallet = async (encryptedJsonFile, password) => {
    try {
        let data = encryptedJsonFile
        return await ethers.Wallet.fromEncryptedJson(data, password, callback_decrypt)
    } catch(err) {
        throw err
    }
}

export default unlockWallet