import { getCUSD } from './getCUSD'

// Refresh user CUSD balance
export const updateUserBalance = async (web3, user) => {
  try {
    if (web3 && user) {
      let cusd = getCUSD(web3)
      if (web3.utils.isAddress(user)) {
        let balance = await cusd.methods.balanceOf(user).call()
        let short_balance = web3.utils.fromWei(balance.toString(), 'ether')
        return short_balance
      } else {
        return -1
      }
    } else {
      return -1
    }

  } catch (err) {
    return -1
  }
}