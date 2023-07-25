import { web3 } from './web3';

const apiKey = 'BQYCCPFobWtRMoXL8AaBpd4Tg23de6ij'
const url = "https://graphql.bitquery.io/";
const dailyBlocks = 28500
const buildQuery = (token, target, fromBlock, toBlock) => {
  return `query {
    ethereum(network: bsc) {
      transfers(
        amount: {gt: 0}
        height: {gt: ${fromBlock}, lt: ${toBlock}}
        currency: {is: "${token}"}
      ) {
        bought: amount(
          calculate: sum
          sender: {is: "${target}"}
        )
        sold: amount(
          calculate: sum
          receiver: {is: "${target}"}
        )
        currency { 
          symbol 
          name 
        }
      }
    }
  }
  `
}

export const getDailyVolume = async (token, pair) => {
  const currentBlock = await web3.eth.getBlockNumber()
  const query = buildQuery(token, pair, currentBlock-dailyBlocks, currentBlock)

  const opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify({query})
  }

  const ret = await fetch(url, opts);
  const data = (await ret.json()).data.ethereum.transfers;

  if (data.length == 0) return {sold:0,bought:0,volume:0}

  return {
    sold: data[0].sold, 
    bought: data[0].bought, 
    volume: data[0].sold + data[0].bought 
  }
}