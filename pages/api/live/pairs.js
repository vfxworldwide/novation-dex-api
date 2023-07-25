// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import address from '../../../address';
import { factory, erc20, price, web3 } from '../../../utils/web3';
import { toEther, fromWei, fromWeiEx, toWei, toBN } from '../../../utils/utils';
import { getDailyVolume } from '../../../utils/volume';

export default async function handler(req, res) {
    const tokens = (await factory.methods.getAllTokens().call()).slice(1);

    const allPairs = await Promise.all(tokens.map(async token => {
        const pair = await factory.methods.getPair(address.bnb, token).call()
        return {token: token, pair: pair};
    }))

    let availablePairs = allPairs.filter(pair => pair.pair !== address.null)
    availablePairs = await Promise.all(availablePairs.map(async pair => {
        const totalSupply = await erc20(pair.pair).methods.totalSupply().call()
        return {...pair, totalSupply}
    }))

    availablePairs = availablePairs.filter(pair => pair.totalSupply !== '0')

    const ret = await Promise.all(availablePairs.map(async pair => {
        const tokenPrice = await price.methods.priceOf(pair.token).call()
        const baseVolume = (await getDailyVolume(pair.token, pair.pair)).volume
        const pairObj = {
            pair_address: pair.pair,
            base_name: await erc20(pair.token).methods.name().call(),
            base_address: pair.token,
            base_symbol: await erc20(pair.token).methods.symbol().call(),
            quote_name: "Wrapped BNB",
            quote_symbol: "WBNB",
            quote_address: address.bnb,
            price: fromWeiEx(tokenPrice.bnbPrice),
            base_volume: baseVolume.toString(),
            quote_volume: (baseVolume * fromWei(tokenPrice.bnbPrice)).toString(),
            liquidity: fromWeiEx(await erc20(pair.token).methods.balanceOf(pair.pair).call()),
            liquidity_BNB: fromWeiEx(await erc20(address.bnb).methods.balanceOf(pair.pair).call())
        }
        return {obj: pairObj, pair: `${pair.token}_${address.bnb}`};
    }))

    const pairs = ret.reduce((acc, value) => {
        return {...acc, [value.pair]: value.obj}
    }, {})
    
    res.status(200).json({ data: pairs })
}