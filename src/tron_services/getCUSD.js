// Fetch active CUSD instance
export const getCUSD = async (tronWeb) => {
    if (!tronWeb) return;
    // Contract ABI's
    const ABI = require("../contracts/tron/CarbonDollar.json");

    // Contract Ropsten Addresses
    const SHASTA_NETWORK_ID = 2
    const ADDRESS = ABI.networks[SHASTA_NETWORK_ID].address

    try {
        let contract_base58_address = tronWeb.address.fromHex(ADDRESS) 
        let cusd = await tronWeb.contract().at('TQF3guBM1T8JWgLX9M6B3xTBJEoew1bfBp')
        return cusd
    } catch (err) {
        throw err
    }
}

export default getCUSD