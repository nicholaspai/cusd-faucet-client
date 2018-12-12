// Request user to cryptographically sign a message
export const signMessage = async (web3, dataToSign, from, signer_wallet) => {
    if (!web3) return;

    // If passed in the optional parameter "signer_wallet", then use this wallet to sign message
    if (signer_wallet) {
        let privateKey = signer_wallet.privateKey
        let sig = web3.eth.accounts.sign(dataToSign, privateKey)
        return sig.signature
    } else {
      // Else ask injected web3 provider to sign
      alert('Welcome to the CUSD faucet! Please sign the message to sign in, or authenticate your Transfer or Redemption of CUSD. We will broadcast all of your transactions, so there is no need to hold any ETH.')
      return new Promise((resolve, reject) =>
        web3.eth.personal.sign(
          dataToSign,
          from,
          (err, signature) => {
            if (err) return reject(err);
            return resolve(signature);
          }
        )
      );
    }
  };