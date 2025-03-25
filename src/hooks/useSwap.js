import { useMemo, useContext, useState } from 'react';
import { swapABI } from './abiHelpers';
import Web3Context from '../context/Web3Context';
import { BigNumber, Contract, ethers } from 'ethers';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';

export const useSwap = () => {
  const { accounts, isLoaded, connect } = useContext(Web3Context);
      const { walletProvider } = useWeb3ModalProvider(); 
  // const address_ = '0x11caa40Fb970dd322f7116fAD7d37B6AeA536EDB';
  const address_ = '0x1a8db8Dd16c5858a492e0a641BABB5C50ab17933';
  
  const contract = async () => {
    if (!isLoaded) return null;
    const provider = new ethers.providers.Web3Provider(walletProvider);
    const signer = provider.getSigner();
    const contract = new Contract(address_, swapABI, signer);
    return contract;
  };

  const deposit = async (amount) => {
    if (!isLoaded) return BigNumber.from(0);
    const contract_ = await contract();
    amount = ethers.utils.parseEther(amount);
    const balance = await contract_.deposit(amount);
    return balance;
  };
  const withdraw = async () => {
    if (!isLoaded) return BigNumber.from(0);
    const contract_ = await contract();
    const balance = await contract_.withdraw();
    return balance;
  };
  const getUser = async (_accounts) => {
    if (!isLoaded) return BigNumber.from(0);
    const contract_ = await contract();
    const account_ = _accounts || accounts;
    const balance = await contract_.users(account_);
    return balance;
  };

  const totalInvest = async (_accounts) => {
    if (!isLoaded) return BigNumber.from(0);
    const contract_ = await contract();
    const balance = await contract_.totalInvest();
    return balance;
  };

  const data = {
    contract,

    address_,
    deposit,
    withdraw,
    getUser,
    totalInvest,
  };
  return useMemo(() => {
    try {
      return [data];
    } catch (e) {
      console.log(e);
      return [data];
    }
  }, [accounts, isLoaded, address_]);
};
