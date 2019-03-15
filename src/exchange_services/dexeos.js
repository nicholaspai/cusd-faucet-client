const axios = require('axios')

// Dexeos API services
const API_HTTP_URL = "https://api.dexeos.io/v2/"

/**
* getOrderbook: return order book for token
* @param code String: token contract name (e.g. "betdicetoken")
* @param symbol String: token symbol (e.g. DICE)
* @param depth Number: count of orders to count towards inside market
*/
export const getOrderbook = async (code, symbol, depth=5) => {
    const token_query = code+"::"+symbol

    // GET: /orderbook/<code>::<symbol>
    const url = API_HTTP_URL+"orderbook/"+token_query

    try {
        let response = await axios.get(url)

        let orderbook = response.data
        let bids = []
        let asks = []
        // Sort bids, highest bids are first
        for (var b = 0; b < orderbook.length; b++) {
            if (orderbook[b].type === 'buy' && bids.length < depth) {
                bids.push(orderbook[b])
            }
        }
        // Sort asks, lowest asks are last
        for (var o = orderbook.length-1; o >= 0; o--) {
            if (orderbook[o].type === 'sell' && asks.length < depth) {
                asks.push(orderbook[o]) 
            } 
        }
        
        let inside_bid = 0
        let inside_ask = 0
        let inside_bid_size = 0
        let inside_ask_size = 0

        for (let bid of bids) {
            let price = parseFloat(bid.per_eos)
            let volume = parseFloat(bid.amount)
            inside_bid += price * volume
            inside_bid_size += volume
        }

        for (let ask of asks) {
            let price = parseFloat(ask.per_eos)
            let volume = parseFloat(ask.amount) 
            inside_ask += price * volume
            inside_ask_size += volume
        }

        return {
            bid: inside_bid/inside_bid_size,
            bid_size: inside_bid_size,
            ask: inside_ask/inside_ask_size,
            ask_size: inside_ask_size
        }
    } catch(err) {
        console.log(err)
    }

}

// Return inside market of minimum size
export const getInsideMarket = async (code, symbol, minSize, depth=10) => {
    const token_query = code+"::"+symbol

    // GET: /orderbook/<code>::<symbol>
    const url = API_HTTP_URL+"orderbook/"+token_query

    try {
        let response = await axios.get(url)

        let orderbook = response.data
        let bids = []
        let asks = []

        // @dev: every DEX might return bids/asks in different sorted orders, 
        // be sure to sort them before processing their data!

        // Dexeos returns highest bids first
        for (var b = 0; b < orderbook.length; b++) {
            if (orderbook[b].type === 'buy' && bids.length < depth) {
                bids.push(orderbook[b])
            }
        }
        // Dexeos return lowest asks last
        for (var o = orderbook.length-1; o >= 0; o--) {
            if (orderbook[o].type === 'sell' && asks.length < depth) {
                asks.push(orderbook[o]) 
            } 
        }
        
        let inside_bid = null
        let inside_ask = null
        let inside_bid_size = null
        let inside_ask_size = null

        for (let bid of bids) {
            let price = parseFloat(bid.per_eos)
            let volume = parseFloat(bid.remain_amount)
            if (volume >= minSize) {
                inside_bid = price
                inside_bid_size = volume
                break;
            }
        }

        for (let ask of asks) {
            let price = parseFloat(ask.per_eos)
            let volume = parseFloat(ask.remain_amount) 
            if (volume >= minSize) {
                inside_ask = price
                inside_ask_size = volume
                break;
            }
        }

        return {
            bid: inside_bid,
            bid_size: inside_bid_size,
            ask: inside_ask,
            ask_size: inside_ask_size
        }
    } catch(err) {
        console.log(err)
    }

}

// @dev on Dexeos, the default market for CUSD is CUSD-EOS, where EOS is non-intuitively the quote currency
// i.e. "CUSD is quoted in terms of EOS"
// So, this function returns CUSD-EOS markets in terms of EOS-CUSD
export const getInvertedInsideMarket = async (code, symbol, minSize, depth=10) => {
    let insideMarket = await getInsideMarket(code, symbol, minSize, depth)
    return {
        bid: 1/insideMarket.ask,
        bid_size: insideMarket.ask_size,
        ask: 1/insideMarket.bid,
        ask_size: insideMarket.bid_size
    }
}

const { transactionOptions, CURRENCY_PRECISION, CONTRACT_CODE } = require('../eos_services/getDefaultEosJSMainnet')

// Helper methods
const roundUp = (num, precision) => {
    precision = Math.pow(10, precision)
    return Math.ceil(num * precision) / precision
}

export const postBid = async function (api, user, quantity, price, symbol, code) {
    if (
        !symbol ||
        !code ||
        !api || 
        !user ||
        !quantity ||
        !price ||
        quantity <= 0 ||
        price <= 0) 
    {
        console.error(`invalid params to dexeos::postBid`)
        return
    }
    
    let total
    try {
        // DEXEOS max precision = 8
        price = await roundUp(price, 8)
        const memo = {
            "type":"buy",
            "quantity": quantity,
            "price": price, 
            "code": code, 
            "symbol": symbol
          };

          let transferSymbol = "EOS"
          total = Math.ceil(parseFloat((price * quantity * 10000).toFixed(12))) / 10000
          total = total.toFixed(4)
          total += " " + transferSymbol; // quantity*price is total EOS we transfer for buys

          const resultWithConfig = await api.transact({
            actions: [{
                account: "eosio.token",
                name: "transfer",
                authorization: [{
                    actor: user,
                    permission: 'active',
                }],
                data: {
                    from: user,
                    to: "dexeoswallet",
                    quantity: total,
                    memo: JSON.stringify(memo)
                }
            }]
        }, transactionOptions)
        alert(`...successfully posted CUSD-EOS bid! [quantity: ${total}, price: ${price}, tx_id: ${resultWithConfig.transaction_id}]`)
        return resultWithConfig
    } catch (err) {
        alert(`...posting bid failed [quantity: ${total}, price: ${price}]`)
    }
}

export const postAsk = async function (api, user, quantity, price, symbol, code) {
    // Check params
    if (
        !symbol ||
        !code ||
        !api || 
        !user ||
        !quantity ||
        !price ||
        quantity <= 0 ||
        price <= 0) 
    {
        console.error(`invalid params to dexeos::postAsk`)
        return
    }
    try {
        price = await roundUp(price, 8)
        const memo = {
            "type":"sell",
            "quantity": quantity,
            "price": price, 
            "code": code, 
            "symbol": symbol
          };


          const NUM_DECIMALS = CURRENCY_PRECISION

          quantity = (parseFloat(quantity)).toFixed(NUM_DECIMALS)
          quantity += " " + symbol; 
          
          const resultWithConfig = await api.transact({
            actions: [{
                account: code, 
                name: "transfer",
                authorization: [{
                    actor: user,
                    permission: 'active',
                }],
                data: {
                    from: user,
                    to: "dexeoswallet",
                    quantity: quantity,
                    memo: JSON.stringify(memo)
                }
            }]
        }, transactionOptions)
        alert(`...successfully posted CUSD-EOS offer! [quantity: ${quantity}, price: ${price}, tx_id: ${resultWithConfig.transaction_id}]`)
        return resultWithConfig
    } catch (err) {
        alert(`...posting offer failed [quantity: ${quantity}, price: ${price}]`)
    }
}
