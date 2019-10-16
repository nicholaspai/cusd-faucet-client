import BN from 'bignumber.js'
import { getClient } from './getClient' 
import {contractAddresses} from './contractAddresses'

const CURRENCY_UNIT = new BN(1e18)

let client 

export const updateViteBalance = async (address) => {
    try {
        let tokenId = contractAddresses['CUSD']
        if (!client) {
            client = await getClient()
        }
        let _balance = await client.getBalance(address)
        let _availableBalance = _balance.balance
        let _onroadBalance = _balance.onroad

        let availableBalances = []
        if (parseFloat(_availableBalance.totalNumber) > 0 ) {
            let tokens = _availableBalance.tokenBalanceInfoMap
            for (let i = 0; i < Object.keys(tokens).length; i++) {
                let _token = tokens[Object.keys(tokens)[i]]
                if (_token.tokenInfo.tokenId === tokenId) {
                    availableBalances.push({
                        symbol: _token.tokenInfo.tokenSymbol,
                        balance: (new BN(_token.totalAmount)).dividedBy(CURRENCY_UNIT),
                        id: _token.tokenInfo.tokenId
                    })    
                }
            }
        }

        let onroadBalances = []
        if (parseFloat(_onroadBalance.totalNumber) > 0 ) {
            let tokens = _onroadBalance.tokenBalanceInfoMap
            for (let i = 0; i < Object.keys(tokens).length; i++) {
                let _token = tokens[Object.keys(tokens)[i]]
                if (_token.tokenInfo.tokenId === tokenId) {
                    onroadBalances.push({
                        symbol: _token.tokenInfo.tokenSymbol,
                        balance: (new BN(_token.totalAmount)).dividedBy(CURRENCY_UNIT),
                        id: _token.tokenInfo.tokenId
                    })
                }
            }
        }

        return {
            availableBalances,
            onroadBalances
        }
    } catch (err) {
        throw err
    }
}