// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import address from '../../../../address';
import { factory, erc20, price, web3 } from '../../../../utils/web3';
import { toEther, fromWei, fromWeiEx, toWei, toBN } from '../../../../utils/utils';

export default async function handler(req, res) {
    if (
        !req.query.address ||
        typeof req.query.address !== "string" ||
        !req.query.address.match(/^0x[0-9a-fA-F]{40}$/)
    ) {
        res.status(400).json({ data: "Invalid address" })
        return;
    }

    const token = req.query.address
    const tokenPrice = await price.methods.priceOf(token).call()
    const tokenObj = {
        name: await erc20(token).methods.name().call(),
        symbol: await erc20(token).methods.symbol().call(),
        price: fromWeiEx(tokenPrice.usdPrice),
        price_BNB: fromWeiEx(tokenPrice.bnbPrice)
    }
    
    res.status(200).json({ data: tokenObj })
}