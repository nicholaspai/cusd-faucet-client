import {rpcTelos, CONTRACT_CODE} from './getDefaultEosJS'
// Refresh user CUSD balance
export const updateTelosBalance = async (user_name, mainnet=false) => {
  try {
        let result = await rpcTelos.get_table_rows({
            "code": CONTRACT_CODE,
            "scope": user_name,
            "table": "accounts" // accounts table stores balances
        })
        let i;
        for (i = 0; i < result.rows.length; i++){
        	if (result.rows[i].balance.split(" ")[1] === "TLOSD"){
        		return result.rows[i].balance.split(" ")[0]
        	}
        }
    } catch (err) {
        console.log(err)
        throw(err)

    }
}