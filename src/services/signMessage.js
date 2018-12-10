// Request user to cryptographically sign a message
export const signMessage = (web3, dataToSign, from) => {
    if (!web3) return;
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
  };