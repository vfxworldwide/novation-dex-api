import { web3 } from './web3';

export const toEther = (val, decimal = 4, decimals = 'ether') => {
    if (!val) return 0;
    return Number(web3.utils.fromWei(val, decimals).toString()).toFixed(decimal);
}

export const fromWei = (val) => {
    return Number(web3.utils.fromWei(val).toString());
}

export const fromWeiEx = (val) => {
    return web3.utils.fromWei(val).toString();
}

export const toWei = (val, decimals = 'ether') => {
    return web3.utils.toWei(val, decimals);
}

export const toBN = (val) => {
    return (new web3.utils.BN(val));
}