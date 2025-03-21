import { useMemo, useContext, useState } from 'react';
import { abi, BUSD, saleAbi, masterchefv2Abi, StakeAbi, nftAbi } from './abiHelpers';
import Web3Context from '../context/Web3Context';
import { BigNumber, Contract, ethers } from 'ethers';

export const useNft = (address_) => {
  const { accounts, isLoaded, connect } = useContext(Web3Context);

  const contract = async () => {
    if (!isLoaded) return null;
    const provider = await connect();
    const signer = provider.getSigner();
    const contract = new Contract(address_, nftAbi, signer);
    return contract;
  };

  const balanceOf = async (address_,id=0) => {
    if (!isLoaded) return BigNumber.from(0);
    const contract_ = await contract();
    const address = address_ == undefined ? accounts : address_;
    const balance = await contract_.balanceOf(address,id);
    return balance;
  };
  const approve = async (address) => {
    if (!isLoaded) return BigNumber.from(0);
    const contract_ = await contract();
    const approve = contract_.setApprovalForAll(address,true);
    return approve;
  };

  const allowance = async (owner, aspend) => {
    if (!isLoaded) return BigNumber.from(0);
    const contract_ = await contract();
    // console.log(contract_.isApprovedForAll);
    // return
    const address = owner == undefined ? accounts : owner;
    const allowance = contract_["isApprovedForAll"](address, aspend);
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
    return await allowance(accounts, aspend);
  };
 const  data={
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
      return [   data];
    }
  }, [accounts, isLoaded,address_,contract]);
};
