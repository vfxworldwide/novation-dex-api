import Web3 from 'web3';
import factoryABI from '../abi/factory.json';
import erc20ABI from '../abi/erc20.json';
import priceABI from '../abi/price.json';
import address from '../address';

export const web3 = new Web3(
    new Web3.providers.HttpProvider("https://bsc-dataseed1.ninicoin.io/")
);

export const factory = new web3.eth.Contract(
    factoryABI,
    address.factory
);

export const price = new web3.eth.Contract(
    priceABI,
    address.price
)

export const erc20 = (addr) => {
    return (new web3.eth.Contract(
        erc20ABI,
        addr
    ));
}