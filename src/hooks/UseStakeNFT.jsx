import { useMemo, useContext, useState, useEffect } from 'react';
import Web3Context from '@/context/Web3Context';
import { Contract, ethers } from 'ethers';
import { stakingNft } from '@/hooks/abiHelpers.js';



export default function UseStakeNFT(pool) {
  const { accounts, isLoaded, connect } = useContext(Web3Context);
  // const Stake = useStake();
  // const Biotic = useToken("0x25461B460A667C0a81495c7150b8d664d223c68a");
  // const Ximbia = useToken("0xe62030f94d8b2F520be3525dC788a00A6B13cA7e");
  const address_ ="0x96079b18D7cE749692e62D16041A77C6bc4f5640"
  const contract_ = async () => {
    if (!isLoaded) return null;
    const provider = await connect();
    const signer = provider.getSigner();
    const contract = new Contract(address_, stakingNft, signer);
    return [null,contract];
  };

  

  const payBonus = async ( pool_) => {
    if (!isLoaded) return;
    // try {
      const [load, contract] = await contract_();
      // let _amount = ethers.utils.parseEther(amount);
      let _pool = pool_ == undefined ? pool : pool_;
      // let _referrer = refHandler();
      const tx = contract.payBonus(_pool); //{gasLimit: 3000000});
      return tx;
    // } catch (e) {
    //   // console.log(e);
    //   return e;
    // }
  };

  const invest = async (amount, pool_) => {
    if (!isLoaded) return;
    // try {
      const [load, contract] = await contract_();
      let _amount = ethers.utils.parseEther(amount);
      let _pool = pool_ == undefined ? pool : pool_;
      // let _referrer = refHandler();
      const tx = contract.invest(_pool, _amount); //{gasLimit: 3000000});
      return tx;
    // } catch (e) {
    //   // console.log(e);
    //   return e;
    // }
  };

  const harvest = async (pool_) => {
    if (!isLoaded) return;
    // try {
      const [load, contract] = await contract_();
      let _pool = pool_ == undefined ? pool : pool_;
      const tx = contract.harvest(_pool);
      // await tx.wait();
      return tx;
    // } catch (e) {
    //   console.log(e);
    //   return false;
    // }
  };

  const withdraw = async (pool_) => {
    if (!isLoaded) return;
    // try {
      const [load, contract] =await contract_();
      let _pool = pool_ == undefined ? pool : pool_;
      const tx = contract.withdraw(_pool);
      // await tx.wait();
      return tx;
    // } catch (e) {
    //   console.log(e);
    //   return false;
    // }
  };

  const reinvest = async (pool_) => {
    if (!isLoaded) return;
    // try {
      const [load, contract] = await contract_();
      let _pool = pool_ == undefined ? pool : pool_;
      const tx = contract.reinvest(_pool);
      // await tx.wait();
      return tx;
    // } catch (e) {
    //   console.log(e);
    //   return false;
    // }
  };
  const forceWithdraw = async (pool_) => {
    if (!isLoaded) return;
    try {
      const [load, contract] = await contract_();
      let _pool = pool_ == undefined ? pool : pool_;
      const tx = contract.forceWithdraw(_pool);
      // await tx.wait();
      return tx;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const getReward = async (pool_, weis, seconds) => {
    if (!isLoaded) return;
    try {
      const [load, contract] = await contract_();
      let _weis = weis;
      let _seconds = seconds;
      let _pool = pool_ == undefined ? pool : pool_;
      const tx = await contract.getReward(_weis, _seconds, _pool);
      // await tx.wait();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const userCanwithdraw = async (pool_) => {
    if (!isLoaded) return;
    try {
      const [load, contract] =await contract_();
      let _pool = pool_ == undefined ? pool : pool_;
      const tx = await contract.userCanwithdraw(_pool, accounts);
      return tx;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const users = async (pool_) => {
    if (!isLoaded) return;
    try {
      const [load, contract] = await contract_();
      let _pool = pool_ == undefined ? pool : pool_;
      // console.log(accounts,"?accounts",_pool,"?pool");
      const tx = await contract.getUser(accounts, _pool);
      // const tx = await contract.users(_pool,accounts);
      // console.log(_pool,"?TX");
      return tx;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const dataStake = async (pool_) => {
    if (!isLoaded) return;
    if (!isLoaded) return;
    try {
      const [load, contract] =await contract_();
      let _pool = pool_ == undefined ? pool : pool_;
      const tx = await contract.getPublicData(_pool);
      return tx;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const getAllUsers = async (pool_) => {
    if (!isLoaded) return;
    if (!isLoaded) return;
    try {
      const [load, contract] = await contract_();
      let _pool = pool_ == undefined ? pool : pool_;
      console.log(_pool,"?pool");
      const tx = await contract.getAllUsers(_pool);
      return tx;
    } catch (e) {
      console.log(e);
      return false;
    }
  };


  const data = {
    invest,
    harvest,
    withdraw,
    reinvest,
    forceWithdraw,
    getReward,
    users,
    userCanwithdraw,
    dataStake,
    getAllUsers,
    address_,
    contract_,
    payBonus
  }
  

  return useMemo(() => {
    if (!isLoaded) return;
    try {
      return [
        data
      ];
    } catch (e) {
      console.log(e);
      return [data];
    }
  }, [accounts, isLoaded,contract_,address_]);
}