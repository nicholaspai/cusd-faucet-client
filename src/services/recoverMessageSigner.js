  // Get user who signed a message
  export const recoverMessageSigner = async (
      web3,
      message,
      signature
  ) => {
      if (!web3) return;
      let user = await web3.eth.accounts.recover(
        message, signature
      )
      return user
  }