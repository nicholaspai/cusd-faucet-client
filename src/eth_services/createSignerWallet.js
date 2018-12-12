import { ethers } from 'ethers';

// Create a wallet object capable of signing transaction
const createSignerWallet = (decryptedJson) => {
    let privateKey = decryptedJson.privateKey
    let wallet = new ethers.Wallet(privateKey)
    return wallet
}

export default createSignerWallet
