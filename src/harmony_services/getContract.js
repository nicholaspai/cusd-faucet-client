import { getHarmony } from './getProvider'

export const getContract = async () => {
    const stablecoinAddress = '0x1694a6C1EA4C72364fe914F9420C8ad8CA04cf05'
    const stablecoinAbi = require("../contracts/CarbonDollar.json").abi
    const provider = await getHarmony()
    const deployedContract = provider.contracts.createContract(
        stablecoinAbi,
        stablecoinAddress
    )
    return deployedContract
}