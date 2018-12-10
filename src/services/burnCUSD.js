import { getCUSD } from './getCUSD'
import { signMessage } from './signMessage'

const WT0_ADDRESS = "0xcd36463470c4b92700b4d5fbe270e680d9d48968";

// Burn amount of CUSD from user 
export const burnCUSD = async function(web3, from, amount) {
  if (
    !web3 ||
    !from ||
    !amount ||
    isNaN(amount) ||
    amount <= 0 ||
    !web3.utils.isAddress(from) 
  ) {
    console.error("invalid parameters passed");
    return;
  }

  try {
    let cusd = getCUSD(web3);
    let stablecoin = WT0_ADDRESS
    let crafted_transaction = cusd.methods.burnCarbonDollar(stablecoin, amount);
    let nonce = await cusd.methods.replayNonce(from).call();
    let metatoken = cusd.options.address;
    let reward = Math.ceil(
      (await crafted_transaction.estimateGas({
        from,
      })) * 2.5
    );

    // Hash must be in this format: keccak256(abi.encodePacked(address(MetaToken),"metaTransfer", _to, _amount, _nonce, _reward));
    // @devs: cast all signed ints to unsigned ints via web3.utils.toTwosComplement()
    let metaTx = [
      metatoken,
      "metaBurnCarbonDollar",
      stablecoin,
      amount,
      web3.utils.toTwosComplement(nonce),
      web3.utils.toTwosComplement(reward)
    ];

    let hash = web3.utils.soliditySha3(...metaTx);
    let sig = await signMessage(web3, hash, from);

    var post_data = {
      type: 'burn',
      stablecoin,
      amount,
      sig,
      signerNonce: nonce,
      reward,
    };

    return post_data

  } catch (err) {
    throw err;
  }
};