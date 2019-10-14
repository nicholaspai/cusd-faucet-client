import { _fromBech32 } from './convertAddress'
import { getContract } from './getContract'
import web3 from 'web3'

// Refresh user CUSD balance
export const updateHarmonyBalance = async (user_name) => {
  try {
        user_name = _fromBech32(user_name)
        let stablecoin = await getContract()
        let balance = await stablecoin.methods.balanceOf(user_name).call({
            gasLimit: web3.utils.toWei('200000', 'wei').toString(),
            gasPrice: web3.utils.toWei('50', 'gwei').toString()
        })
        return web3.utils.fromWei(balance.toString(), 'ether')  
    } catch (err) {
        console.log(err)
        throw(err)
    }
}