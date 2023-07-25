// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { db, tokensQuery } from '../../../utils/db';

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

    const dbConnection = db();
    const ret = await (new Promise((resolve, reject) => {
        dbConnection.query(tokensQuery, (err, result) => {
            if (err) return reject(err);
            console.log(result)
            return resolve(result);
        });
    }));
    const data = JSON.parse(JSON.stringify(ret[0]));
    const tokens = JSON.parse(data.tokens);
    const tokenAddr =  Object.keys(tokens).filter(key => key === token);
    if (tokenAddr.length == 0) {
        res.status(400).json({ data: "Unexisting token" })
        return;
    }
    const tokenObj = {
        name: tokens[token].name,
        symbol: tokens[token].symbol,
        price: tokens[token].price,
        price_BNB: tokens[token].price_BNB
    };
    
    await (new Promise((resolve, reject) => { 
        dbConnection.end(err => {
            if (err) return reject(err)
            console.log('DB Closed!');
            return resolve()
        });
    }));
    
    res.status(200).json({ data: tokenObj, updated_at: data.updated_at })
}