// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import address from '../../../../address';
import { factory, erc20, price, web3 } from '../../../../utils/web3';
import { toEther, fromWei, fromWeiEx, toWei, toBN } from '../../../../utils/utils';

export default async function handler(req, res) {
    const tokenList = (await factory.methods.getAllTokens().call()).slice(1);

    const allPairs = await Promise.all(tokenList.map(async token => {
        const pair = await factory.methods.getPair(address.bnb, token).call()
        return {token: token, pair: pair};
    }))
    
    let availablePairs = allPairs.filter(pair => pair.pair !== address.null)
    availablePairs = await Promise.all(availablePairs.map(async pair => {
        const totalSupply = await erc20(pair.pair).methods.totalSupply().call()
        return {...pair, totalSupply}
    }))
    
    availablePairs = availablePairs.filter(pair => pair.totalSupply !== '0')
    const availableTokens = availablePairs.map(pair => pair.token);
    
    const ret = await Promise.all(availableTokens.map(async token => {
        const tokenPrice = await price.methods.priceOf(token).call()
        const tokenObj = {
            name: await erc20(token).methods.name().call(),
            symbol: await erc20(token).methods.symbol().call(),
            price: fromWeiEx(tokenPrice.usdPrice),
            price_BNB: fromWeiEx(tokenPrice.bnbPrice)
        }
        return {obj: tokenObj, token: token};
    }))
    
    const tokens = ret.reduce((acc, value) => {
        return {...acc, [value.token]: value.obj}
    }, {})
    
    res.status(200).json({ data: tokens })
}