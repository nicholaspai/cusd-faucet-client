import {rpc, rpcMainnet, CONTRACT_CODE_MAINNET, CONTRACT_CODE} from './getDefaultEosJS'
// Refresh user CUSD balance
export const updateEosBalance = async (user_name, mainnet=false) => {
  try {
        let result
        if (mainnet) {
            result = await rpcMainnet.get_table_rows({
                "code": CONTRACT_CODE_MAINNET,
                "scope": user_name,
                "table": "accounts" // accounts table stores balances
            })
        } else {
            result = await rpc.get_table_rows({
                "code": CONTRACT_CODE,
                "scope": user_name,
                "table": "accounts" // accounts table stores balances
            })
        }
        let i;
        for (i = 0; i < result.rows.length; i++){
        	if (result.rows[i].balance.split(" ")[1] === "CUSD"){
        		return result.rows[i].balance.split(" ")[0]
        	}
        }
    } catch (err) {
        console.log(err)
        throw(err)

    }
}