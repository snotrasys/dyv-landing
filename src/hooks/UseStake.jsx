import { useMemo, useContext, useState, useEffect } from 'react';
import Web3Context from '../context/Web3Context';
import { Contract, ethers } from 'ethers';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';

// import { DateTime } from 'luxon';
import refHandler from './utils';
import { throws } from 'assert';
import { toast } from 'react-hot-toast';
import { formatEther } from 'ethers/lib/utils.js';
// import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { address } from './useContracts';
import { abiNew } from './abiHelpers';
const useContract = (_address) => {
  const { accounts, isLoaded, connect } = useContext(Web3Context);
  // const { walletProvider } = useWeb3ModalProvider();
  const { walletProvider } = useWeb3ModalProvider(); 
  return useMemo(async () => {
    if (!isLoaded) return [undefined,undefined];
    try {
      const provider = new ethers.providers.Web3Provider(walletProvider);
      console.log(provider);

      const signer = provider.getSigner();
      const contract = new Contract(
        _address,abiNew,
        signer,
      );
      return [undefined,contract];
    } catch (e) {      
      return [undefined,undefined];
    }
  }, [accounts, isLoaded]);
};

export default function UseStake(pool) {
  
  const { accounts, isLoaded, connect } = useContext(Web3Context);
  const address_ = address.fantom;
  const Stake = useContract(address_);
  const opt = {
    // value: ethers.utils.parseEther("0.0032"),
  };
  const invest = async (amount, _pool,_token, payNft) => {
    
    if (!isLoaded) return;
    // try {
    
    amount = ethers.utils.parseEther(amount);    
    payNft = payNft || false;
    _pool = _pool || 1;
    let _referrer = refHandler();
    
    console.log('investing');
    
    const [load, contract] = await Stake;    
    // uint _pool,
    // uint amount,
    // address _referrer,
    // address _token,
    // bool payNft
    const tx = contract.invest(
        _pool,
        amount,
        _referrer,
        //  _token,
        payNft
    );
    return tx;
  };

  const forceWithdraw = async (pool_) => {
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    pool_ = pool_ || 1;
    const tx = contract.forceWithdraw(pool_);
    return tx;
  };

  const withdraw = async (pool_,_useTokenFee) => {
    try {
      if (!isLoaded) return;
      const [load, contract] = await Stake;
      pool_ = pool_ || 1;
      _useTokenFee = _useTokenFee || false;
      const tx = contract.withdraw(pool_,_useTokenFee);
      return tx;
    } catch (e) {
      console.log(e);
    }
  };

  const reinvest = async (pool_) => {
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    pool_ = pool_ || 1;
    const tx = contract.reinvest(pool_);
    return tx;
  };

  const harvest = async (pool_,_useTokenFee) => {
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    _useTokenFee = _useTokenFee || false;
    const tx = contract.harvest(pool_,_useTokenFee);
    return tx;
  };
  const getPublicData = async (_pool) => {
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    _pool = _pool || 1;
    const tx = contract.getPublicData(_pool);
    return tx;
  };

  //

  const getUserDepositInfo = async (userAddress, index) => {
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    userAddress = userAddress || accounts;
    const tx = contract.getUserDepositInfo(userAddress, index);
    // uint plan_,
    // uint amount_,
    // uint withdrawn_,
    // uint timeStart_,
    // uint maxProfit
    return tx;
  };

  const getUserTotalDeposits = async (userAddress) => {
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    userAddress = userAddress || accounts;
    const tx = contract.getUserTotalDeposits(userAddress);
    return tx;
  };

  const getUserPlans = async (userAddress) => {
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    userAddress = userAddress || accounts;
    const tx = contract.getUserPlans(userAddress);
    return tx;
  };

  const getReferrerBonus = async (userAddress) => {
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    userAddress = userAddress || accounts;
    const tx = contract.getReferrerBonus(userAddress);
    return tx;
  };

  const getUserData = async (userAddress, pool) => {
    if (!isLoaded) return;
    try {
      const [load, contract] = await Stake;
      userAddress = userAddress || accounts;
      pool = pool || 1;
      const tx = contract.getUser(userAddress, pool);
      return tx;
    } catch (err) {
      console.log(err);
    }
  };

  const users = async (userAddress,_pool) => {
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    try{
    userAddress = userAddress || accounts;
    _pool = _pool || 1;
    const tx = contract.users(_pool,userAddress);
    return tx;
    } catch (e) {
      console.log(e);
    }
  };
  const pools = async (_pool) => {
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    _pool = _pool || 1;
    const tx = contract.pools(_pool);
    return tx;
  }

  const refPercentBonus = async (_user, _pool) => {
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    _user = _user || accounts;
    _pool = _pool || 1;
    const tx = contract.refPercentBonus(_user, _pool);
    return tx;
  };

  const referrers = async (_user) => {
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    _user = _user || accounts;
    const tx = contract.referrers(_user);
    return tx;
  };

  const payBonus = async () => {
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    const tx = contract.payBonus();
    // function payBonus() external {
// 
    return tx;
  };

  const getRefData2 = async (_user) => {
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    _user = _user || accounts;
    const tx = contract.getRefData2(_user);
    return tx;
  };

  const getRefData = async (_user) => {
    if (!isLoaded) return;
    const [load, contract] = await Stake;
    _user = _user || accounts;
    const tx = contract.getRefData(_user);
    return tx;
  };

  const data = {
    address_,
    invest,
    reinvest,
    withdraw,
    getPublicData,
    getUserDepositInfo,
    getUserTotalDeposits,
    getUserPlans,
    getReferrerBonus,
    getUserData,
    users,
    harvest,
    refPercentBonus,
    referrers,
    forceWithdraw,
    payBonus,
    getRefData,
    getRefData2,
    pools,
  };

  return useMemo(() => {
    try {
      if (!isLoaded) throw new Error('Web3 is not loaded');
      return data;
    } catch (e) {
      console.log(e);
      return data;
    }
  }, [accounts, isLoaded, Stake]);
}
