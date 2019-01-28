import {rpc} from './setupEos'
// Refresh user CUSD balance
export const updateEosBalance = async (user_name) => {
  try {
        const result = await rpc.get_table_rows({
            "code": "carbonjungle",
            "scope": user_name,
            "table": "accounts"
        })
        console.log(result.rows[0].balance.split(" ")[0])
        let i
        for (i = 0; i < result.rows.length; i++){
        	if (result.rows[i].balance.split(" ")[1] == "CUSD"){
        		return result.rows[i].balance.split(" ")[0]
        	}
        }
        throw ("no CUSD found")
    } catch (err) {
        console.log(err)
        throw(err)

    }
}