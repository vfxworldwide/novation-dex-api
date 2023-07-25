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
    
    await (new Promise((resolve, reject) => { 
        dbConnection.end(err => {
            if (err) return reject(err)
            console.log('DB Closed!');
            return resolve()
        });
    }));
    
    res.status(200).json({ data: JSON.parse(data.pairs), updated_at: data.updated_at })
}
