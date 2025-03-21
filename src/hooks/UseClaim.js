import { useMemo, useContext, useState } from 'react';
import { abi, BUSD, claimAbi } from './abiHelpers';
import Web3Context from '../context/Web3Context';
import { BigNumber, Contract, ethers } from 'ethers';
/* eslint-disable */
const address_ = "0x6c4f3eD859842Af2DDaf32ffFCbFF9b4863C269b"
export const UseClaim = () => {
  const { accounts, isLoaded, connect } = useContext(Web3Context);

  const contract = async () => {
    if (!isLoaded) return null;
    const provider = await connect();
    const signer = provider.getSigner();
    const contract = new Contract(address_, claimAbi, signer);
    return contract;
  };

  
  const withdrawTokens = async (aspend) => {
    const contract_ = await contract();
    console.log(contract_);
    const tx = contract_.withdrawTokens();
    return tx;    
  };

  return useMemo(() => {
    try {
      return {
          contract,                    
          withdrawTokens,
          address_
        }
      ;
    } catch (e) {
      console.log(e);
      return    {contract,                
        withdrawTokens,
        address_};
    }
  }, [accounts, isLoaded,address_,contract]);
};
