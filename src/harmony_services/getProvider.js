import { Harmony } from '@harmony-js/core';
import { ChainID, ChainType } from '@harmony-js/utils';

const TEST_URL = 'wss://ws.s0.b.hmny.io'
let URL = TEST_URL

export const getHarmony = async () => {
    // Create Harmony Core instance
    const harmony = new Harmony(URL, {
      chainUrl: URL,
      chainId: ChainID.HmyTestnet,
      chainType: ChainType.Harmony,
    })
    // console.log(`[Provider] Connected to node @ ${URL}`)

    return harmony
}
