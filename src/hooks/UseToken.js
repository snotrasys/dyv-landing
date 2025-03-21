import { useMemo, useContext, useState } from 'react';
import { abi, BUSD, saleAbi, masterchefv2Abi, StakeAbi } from './abiHelpers';
import Web3Context from '../context/Web3Context';
import { BigNumber, Contract, ethers } from 'ethers';

export const useToken = (address_) => {
  const { accounts, isLoaded, connect } = useContext(Web3Context);

  const contract = async () => {
    if (!isLoaded) return null;
    const provider = await connect();
    const signer = provider.getSigner();
    const contract = new Contract(address_, BUSD, signer);
    return contract;
  };

  const balanceOf = async (address_) => {
    if (!isLoaded) return BigNumber.from(0);
    const contract_ = await contract();
    const address = address_ == undefined ? accounts : address_;
    const balance = await contract_.balanceOf(address);
    return balance;
  };
  const approve = async (address, amount_) => {
    const amount =
      amount_ == undefined
        ? ethers.constants.MaxUint256
        : ethers.utils.parseEther(amount_).toString();

    const contract_ = await contract();
    const approve = contract_.approve(address, amount);
    return approve;
  };

  const allowance = async (owner, aspend) => {
    if (!isLoaded) return BigNumber.from(0);
    const contract_ = await contract();
    const allowance = contract_.allowance(owner, aspend);
    return allowance;
  };

  const transfer = async (address, amount_) => {
    const amount = ethers.utils.parseEther(amount_).toString();
    const contract_ = await contract();
    const transfer = contract_.transfer(address, amount);
    return transfer;
  };
  const transferFrom = async (from, to, amount_) => {
    const amount = ethers.utils.parseEther(amount_).toString();
    const contract_ = await contract();
    const transfer = contract_.transferFrom(from, to, amount);
    return transfer;
  };
  const allowanceHandle = async (aspend) => {
    if (!isLoaded) return BigNumber.from(0);
    const contract_ = await contract();
    const allowance = await contract_.allowance(accounts, aspend);
    return allowance.gt(ethers.utils.parseEther('10000'));
  };

  const data = {
    contract,
    balanceOf,
    approve,
    allowance,
    transfer,
    transferFrom,
    allowanceHandle,
    address_
  }
  return useMemo(() => {
    try {
      return [
        
          data
        
      ];
    } catch (e) {
      console.log(e);
      return [    data];
    }
  }, [accounts, isLoaded,address_]);
};
