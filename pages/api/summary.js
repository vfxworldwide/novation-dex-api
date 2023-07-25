// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { db, pairsQuery } from '../../utils/db';

export default async function handler(req, res) {
    const dbConnection = db();
    const ret = await (new Promise((resolve, reject) => {
        dbConnection.query(pairsQuery, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        });
    }));

    const data = JSON.parse(JSON.stringify(ret[0]));
    const pairs = JSON.parse(data.pairs);
    const summary = {};
    Object.keys(pairs).map(key => {
        summary[key] = {
            base_volume: pairs[key].base_volume,
            quote_volume: pairs[key].quote_volume,
            price: pairs[key].price,
            liquidity: pairs[key].liquidity,
            liquidity_BNB: pairs[key].liquidity_BNB
        }
    })
    
    await (new Promise((resolve, reject) => { 
        dbConnection.end(err => {
            if (err) return reject(err)
            console.log('DB Closed!');
            return resolve()
        });
    }));
    
    res.status(200).json({ data: summary, total_volume: data.total_volume.toString(), volume: data.volume, updated_at: data.updated_at })
}
