import { Harmony } from '@harmony-js/core';
import { ChainID, ChainType } from '@harmony-js/utils';
import {sleep} from '../utils/sleep'

const TEST_URL = 'wss://ws.s0.b.hmny.io'
let URL = TEST_URL


export const getHarmony = async () => {
    // Create Harmony Core instance
    const harmony = new Harmony(URL, {
      chainUrl: URL,
      chainId: ChainID.HmyTestnet,
      chainType: ChainType.Harmony,
    })
    let count = 1
    while (true) {
      if (!harmony.provider.connected) {
        count += 1
        console.log(`[Harmony-Provider] Failed to connect to TESTNET node (${URL}) on attempt #${count}`)
        await sleep(1000)
        continue
      } else {
        break;
      }
    }
    return harmony
}
