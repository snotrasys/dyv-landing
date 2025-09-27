import React, { createContext, useState, useEffect, useContext } from 'react';
import Web3Context from './Web3Context';
import { address } from '../hooks/useContracts.js';
import {  Contract, constants, ethers } from 'ethers';

import { BUSD } from '@/hooks/abiHelpers';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';

const MultiApproveContext = createContext();
const MultiApproveProvider = ({ children }) => {
  // const { addToast } = useToasts();
  const { accounts, isLoaded, connect } =
    useContext(Web3Context);
    const { walletProvider } = useWeb3ModalProvider(); 
const [update, setupdate] = useState(0)

const updateHandle = () => {
  setupdate(update + 1)
} 
  const [isApprove, setisApprove] = useState(false);
  const [currentBalance_, setbalanceOf_] = useState(0);
  const [changeToken, setchangeToken] = useState(    
    address.busd
  );
  

    useEffect(() => {
      if(!isLoaded)
      return
      if(changeToken == undefined ) return
      allowanceHandlePlus()
    
      return () => {
        
      }
    }, [isLoaded,accounts,changeToken,update])
  const contractHandle = async (addr) => {
    const provider = new ethers.providers.Web3Provider(walletProvider);
    const signer = provider.getSigner();
    addr = addr || changeToken;
    
    const contract = new Contract(addr, BUSD, signer);
    return contract;
  };


  const balanceOfHandlePlus = async () => {
    if (
      !isLoaded &&
      accounts != '000000000000000000000000000000000000000000000'
    )
      return;
    if (changeToken == '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c')
      return balanceOfETH();
    const contract = await contractHandle(changeToken);
    
    let balance_ = await contract.balanceOf(accounts);
    let decimals = await contract.decimals();
    balance_ = Number(ethers.utils.formatUnits(balance_,decimals)).toFixed(2);
    // console.log(balance_, 'balance_');
    setbalanceOf_(balance_);
  };
  const allowanceHandlePlus = async (addr,allow) => {
    if (
      !isLoaded &&
      accounts != '000000000000000000000000000000000000000000000'
    )
      return;
    if (changeToken == '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c')
      return setisApprove(true);

    addr = addr || changeToken;
    // console.log(addr, 'addr');
    allow = allow || address.fantom;

    const contract = await contractHandle(addr);
    
    const allowance_ = await contract.allowance(accounts, allow);
    // console.log(allowance_.gt(constants.MaxUint256.div(5)), 'allowance_');
    setisApprove(allowance_.gte(ethers.utils.parseUnits("2000",6)));
    return allowance_.gt(ethers.utils.parseUnits("2000",6));
  };



  const approveHandlePlus = async (addr,appr) => {    
    if (
      !isLoaded &&
      accounts != '000000000000000000000000000000000000000000000'
    )
      return;
    addr = addr || changeToken;    
    appr = appr || address.fantom;
    
    const contract = await contractHandle(addr);
    
    const res = await contract.approve(appr, constants.MaxUint256);
    
    res.wait().then(() => updateHandle());
  };
  const datas = {
    isApprove,
    currentBalance_,
    changeToken,
    setchangeToken,    
    approveHandlePlus,
    allowanceHandlePlus,
    balanceOfHandlePlus,
    update


  };

  return (
    <MultiApproveContext.Provider value={datas}>{children}</MultiApproveContext.Provider>
  );
};

export { MultiApproveProvider };
export default MultiApproveContext;
