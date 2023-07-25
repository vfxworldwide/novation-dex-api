import mysql from 'mysql';

const dbConfig = {
  host: "localhost",
  user: "dbadmin",
  password: "",
  database: "nov_api_db"
}

export const db = () => {
  const connection = mysql.createConnection(dbConfig)
  connection.connect((err) => {
    if (err) throw err;
    console.log("DB Connected!");
  })
  return connection
}

export const tokensQuery = 'SELECT tokens, updated_at FROM chaindata ORDER BY id DESC LIMIT 1;'
// export const pairsQuery = 'SELECT pairs, updated_at FROM chaindata WHERE id = 1;'
export const totalVolumeQuery = `SELECT SUM(volume) AS total_volume FROM chaindata;`
export const pairsQuery = `SELECT * FROM (
  SELECT pairs, updated_at, volume, volume_for FROM chaindata ORDER BY id DESC LIMIT 1) AS A 
  CROSS JOIN 
  (SELECT SUM(volume) AS total_volume FROM chaindata) AS B;`