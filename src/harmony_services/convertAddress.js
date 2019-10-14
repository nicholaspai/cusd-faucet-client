import { toBech32, fromBech32 } from '@harmony-js/crypto'

export const _toBech32 = (eth_address) => {
    return toBech32(eth_address)
}

export const _fromBech32 = (bech_32) => {
    return fromBech32(bech_32)
}