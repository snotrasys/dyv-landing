import { useMemo, useContext, useState } from 'react';
import { abi, BUSD, saleAbi, presaleV3ClaimAbi, StakeAbi } from './abiHelpers';
import Web3Context from '../context/Web3Context';
import { BigNumber, Contract, ethers } from 'ethers';

export const useNftMarket = (address_) => {
  const { accounts, isLoaded, connect } = useContext(Web3Context);

  const contract = async () => {
    if (!isLoaded) return null;
    const provider = await connect();
    const signer = provider.getSigner();
    const contract = new Contract(address_, presaleV3ClaimAbi, signer);
    return contract;
  };
  const calculatePrice = async (amount) => {
    const contract_ = await contract();
    const [pricebnb, pricetoken] = await contract_.calculatePrice(amount);
    return [pricebnb, pricetoken];
  };
  const buy = async (amount) => {
    const contract_ = await contract();
    let [ pricebnb, pricetoken]=await calculatePrice(amount)
    pricebnb=pricebnb.mul(105).div(100)

    const buy = await contract_.buyNFT(amount,{value:pricebnb});
    // const buy = await contract_.buyNFT(amount,{value:ethers.utils.parseEther("0.1")});
    return buy;
  };

  const getPublicData = async () => {
    const contract_ = await contract();
    const data = await contract_.getPublicData();
    return data;
  };
  const getUser = async (account_) => {
    const contract_ = await contract();
    const address = account_ == undefined ? accounts : account_;
    const data = await contract_.getUser(address);
    return data;
  };

  
  const data = {
    address_,
    contract,
    calculatePrice,
    buy,
    getPublicData,
    getUser
  };
  return useMemo(() => {
    try {
      return [data];
    } catch (e) {
      console.log(e);
      return [data];
    }
  }, [accounts, isLoaded, address_,contract]);
};
