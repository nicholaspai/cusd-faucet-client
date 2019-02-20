import { getCUSD } from './getCUSD'

// Refresh user CUSD balance
export const updateTronBalance = async (tronWeb, user) => {
  try {
    if (tronWeb && user) {
      let cusd = await getCUSD(tronWeb)
      if (tronWeb.isAddress(user)) {
        let balance = await cusd.balanceOf(user).call()
        return balance.toString()
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