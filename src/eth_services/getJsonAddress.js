import { ethers } from 'ethers';

// Get the Wallet address from an encrypted JSON wallet
const getJsonAddress = (encryptedJson) => {
    let data = encryptedJson.toString()
    let address = ethers.utils.getJsonWalletAddress(data);
    return address
}

export default getJsonAddress
