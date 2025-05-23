import { useMemo, useContext, useState, useEffect } from 'react';
import Web3Context from '../context/Web3Context';
import { Contract, ethers } from 'ethers';
import refHandler from './utils';
import { address } from './useContracts';
import { presaleAbi } from './abiHelpers';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';


const useContract = (_address) => {
    const { walletProvider } = useWeb3ModalProvider(); 
  const { accounts, isLoaded, connect } = useContext(Web3Context);
  return useMemo(async () => {
    if (!isLoaded) return [undefined,undefined];
    try {
      const provider = new ethers.providers.Web3Provider(walletProvider);
      const signer = provider.getSigner();
      const contract = new Contract(
        _address,presaleAbi,
        signer,
      );
      return [undefined,contract];
    } catch (e) {      
      return [undefined,undefined];
    }
  }, [accounts, isLoaded]);
};

export default function UsePresaleVesting() {
  const { walletProvider } = useWeb3ModalProvider();
  const { accounts, isLoaded, connect } = useContext(Web3Context);
  const address_ = address.privateSale;
  const Stake = useContract(address_);
  const opt = {
    // value: ethers.utils.parseEther("0.0032"),
  };
  const buy = async (amount) => {
    
    if (!isLoaded) return;
    console.log(amount, 'amoun1t');
    amount = ethers.utils.parseUnits(String(amount),6);        
    let _referrer = refHandler();

    console.log(amount, 'amount');   
    
    const [load, contract] = await Stake;        
    const tx = contract.buy(
      // _referrer,
        amount,    
        _referrer    
    );
    return tx;
  };

  const withdrawTokens = async () => {
    
    if (!isLoaded) return;
    const [load, contract] = await Stake;        
    const tx = contract.withdrawTokens();
    return tx;
  };


  const getReserveToInvest = async () => {
      
      if (!isLoaded) return;
      const [load, contract] = await Stake;        
      const tx = contract.reserveToInvest();
      return tx;
    }
  
const sales = async () => {
  
  if (!isLoaded) return;
  const [load, contract] = await Stake;
  console.log(accounts, 'accounts');
  const tx = contract.getUserData(accounts);
  return tx;
};

const totalInvested = async () => {
    
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    const tx = contract.totalInvested();
    return tx;
  }
 
  const totalTokenSale = async () => {
    
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    const tx = contract.totalTokenSale();
    return tx;
  }

  const start = async () => {
    
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    const tx = contract.start();
    return tx;
  }
  const stop = async () => {
    
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    const tx = contract.stop();
    return tx;
  }

  const nextDates = async () => {
    
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    const tx = contract.nextDatesPlus();
    return tx;
  }
  const endDate = async () => {
    
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    const tx = contract.endDate();
    return tx;
  }
  

  const withdrawData = async (_user) => {

    if (!isLoaded) return;
    const [load, contract] = await Stake;
    _user =   _user || accounts;
    const tx = contract.getWithdrawData(_user);
    return tx;
  }

  const currentUserBalance = async () => {
    
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    const tx = contract.currentUserBalance(accounts);

    return tx;

  }
  
  

  const starTWithDrawHandle = async () => {
    
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    const tx = contract.starTWithDrawHandle();
    return tx;
  }
  const    stopWithDraw = async () => {

    if (!isLoaded) return;
    const [load, contract] = await Stake;
    const tx = contract.stopWithDraw();
    return tx;
  }

  const Claim = async (_address) => {
  
      if (!isLoaded) return [undefined,undefined];
      try {
        const provider = new ethers.providers.Web3Provider(walletProvider);
        const signer = provider.getSigner()    
        const contract = new Contract(
          "0x68eaBe6e7ba3BBC391006b0Fb524d07F71c2bf59",[
            `function claim(address _token) external`
          ],
          signer,
        );
        
        await contract.claim(address.busd)
      } catch (e) {      
        return [undefined,undefined];
      }
    
  };


   const Claim2 = async (_address) => {
  
      if (!isLoaded) return [undefined,undefined];
      try {
        const provider = new ethers.providers.Web3Provider(walletProvider);
        const signer = provider.getSigner()    
        const contract = new Contract(
          "0x46a40D7CB5184CCF793bA2F9e69E6124B1731E15",[
            `function claim(address _token) external`
          ],
          signer,
        );
        
        await contract.claim(address.busd)
      } catch (e) {      
        return [undefined,undefined];
      }
    
  };

  const data = {
    address_,
    buy,
    withdrawTokens,
    getReserveToInvest,
    sales,
    totalInvested,
    totalTokenSale,
    start,
    stop,
    starTWithDrawHandle,
    stopWithDraw,
    currentUserBalance,
    nextDates,
    withdrawData,
    Claim,
    Claim2
    
  };

  return useMemo(() => {
    try {
      if (!isLoaded) throw new Error('Web3 is not loaded');
      return data;
    } catch (e) {
      // console.log(e);
      return data;
    }
  }, [accounts, isLoaded, Stake]);
}
