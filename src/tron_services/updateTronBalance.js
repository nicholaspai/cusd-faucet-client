import { getCUSD } from './getCUSD'

// Refresh user CUSD balance
// @dev user should be in Hex encoding NOT base58
export const updateTronBalance = async (tronWeb, user) => {
  try {
    if (tronWeb && user) {
      let cusd = await getCUSD(tronWeb)
      if (tronWeb.isAddress(user)) {
        let balance = await cusd.balanceOf(user).call()
        let decimal = parseFloat(balance.toString())
        let converted = decimal/(10**18)
        return converted
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