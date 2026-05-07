import { useMemo, useContext, useState, useEffect } from 'react';
import Web3Context from '../context/Web3Context';
import { Contract, ethers } from 'ethers';
import refHandler from './utils';
import { address } from './useContracts';
import { presaleAbi } from './abiHelpers';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { toast } from 'react-hot-toast';

const useContract = (_address) => {
  const { walletProvider } = useWeb3ModalProvider();
  const { accounts, isLoaded, connect } = useContext(Web3Context);
  return useMemo(async () => {
    if (!isLoaded) return [undefined, undefined];
    try {
      const provider = new ethers.providers.Web3Provider(walletProvider);
      const signer = provider.getSigner();
      const contract = new Contract(
        _address, presaleAbi,
        signer,
      );
      return [undefined, contract];
    } catch (e) {
      return [undefined, undefined];
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
    try {
      console.log(amount, 'amoun1t');
      amount = ethers.utils.parseUnits(String(amount), 6);
      let _referrer = refHandler();

      console.log(amount, 'amount');

      const [load, contract] = await Stake;
      const tx = await contract.buy(
        amount,
        _referrer
      );
      return tx;
    } catch (err) {
      console.log(err, 'buy error');
      if (err?.error?.data != undefined) toast.error(err.error.data.message);
      else toast.error(err.message);
    }
  };

  const withdrawTokens = async () => {
    if (!isLoaded) return;
    try {
      const [load, contract] = await Stake;
      const tx = await contract.withdrawTokens();
      return tx;
    } catch (err) {
      console.log(err, 'withdrawTokens error');
      if (err?.error?.data != undefined) toast.error(err.error.data.message);
      else toast.error(err.message);
    }
  };

  const getReserveToInvest = async () => {
    if (!isLoaded) return;
    try {
      const [load, contract] = await Stake;
      const tx = await contract.reserveToInvest();
      return tx;
    } catch (err) {
      console.log(err, 'getReserveToInvest error');
      if (err?.error?.data != undefined) toast.error(err.error.data.message);
      else toast.error(err.message);
    }
  };

  const sales = async () => {
    if (!isLoaded) return;
    try {
      const [load, contract] = await Stake;
      console.log(accounts, 'accounts');
      const tx = await contract.getUserData(accounts);
      return tx;
    } catch (err) {
      console.log(err, 'sales error');
      if (err?.error?.data != undefined) toast.error(err.error.data.message);
      else toast.error(err.message);
    }
  };

  const totalInvested = async () => {
    if (!isLoaded) return;
    try {
      const [load, contract] = await Stake;
      const tx = await contract.totalInvested();
      return tx;
    } catch (err) {
      console.log(err, 'totalInvested error');
      if (err?.error?.data != undefined) toast.error(err.error.data.message);
      else toast.error(err.message);
    }
  };

  const totalTokenSale = async () => {
    if (!isLoaded) return;
    try {
      const [load, contract] = await Stake;
      const tx = await contract.totalTokenSale();
      return tx;
    } catch (err) {
      console.log(err, 'totalTokenSale error');
      if (err?.error?.data != undefined) toast.error(err.error.data.message);
      else toast.error(err.message);
    }
  };

  const start = async () => {
    if (!isLoaded) return;
    try {
      const [load, contract] = await Stake;
      const tx = await contract.start();
      return tx;
    } catch (err) {
      console.log(err, 'start error');
      if (err?.error?.data != undefined) toast.error(err.error.data.message);
      else toast.error(err.message);
    }
  };

  const stop = async () => {
    if (!isLoaded) return;
    try {
      const [load, contract] = await Stake;
      const tx = await contract.stop();
      return tx;
    } catch (err) {
      console.log(err, 'stop error');
      if (err?.error?.data != undefined) toast.error(err.error.data.message);
      else toast.error(err.message);
    }
  };

  const nextDates = async () => {
    if (!isLoaded) return;
    try {
      const [load, contract] = await Stake;
      const tx = await contract.nextDatesPlus();
      return tx;
    } catch (err) {

    }
  };

  const endDate = async () => {
    if (!isLoaded) return;
    try {
      const [load, contract] = await Stake;
      const tx = await contract.endDate();
      return tx;
    } catch (err) {
      console.log(err, 'endDate error');
      if (err?.error?.data != undefined) toast.error(err.error.data.message);
      else toast.error(err.message);
    }
  };

  const withdrawData = async (_user) => {
    if (!isLoaded) return;
    try {
      const [load, contract] = await Stake;
      _user = _user || accounts;
      const tx = await contract.getWithdrawData(_user);
      return tx;
    } catch (err) {
      console.log(err, 'withdrawData error');
      if (err?.error?.data != undefined) toast.error(err.error.data.message);
      else toast.error(err.message);
    }
  };

  const currentUserBalance = async () => {
    if (!isLoaded) return;
    try {
      const [load, contract] = await Stake;
      const tx = await contract.currentUserBalance(accounts);
      return tx;
    } catch (err) {
      console.log(err, 'currentUserBalance error');
      if (err?.error?.data != undefined) toast.error(err.error.data.message);
      else toast.error(err.message);
    }
  };

  const starTWithDrawHandle = async () => {
    if (!isLoaded) return;
    try {
      const [load, contract] = await Stake;
      const tx = await contract.starTWithDrawHandle();
      return tx;
    } catch (err) {
      console.log(err, 'starTWithDrawHandle error');
      if (err?.error?.data != undefined) toast.error(err.error.data.message);
      else toast.error(err.message);
    }
  };

  const stopWithDraw = async () => {
    if (!isLoaded) return;
    try {
      const [load, contract] = await Stake;
      const tx = await contract.stopWithDraw();
      return tx;
    } catch (err) {
      console.log(err, 'stopWithDraw error');
      if (err?.error?.data != undefined) toast.error(err.error.data.message);
      else toast.error(err.message);
    }
  };


    const withdrawDividens = async () => {
    if (!isLoaded) return;
    try {
      const [load, contract] = await Stake;
      const tx = await contract.withdrawDividens();
      return tx;
    } catch (err) {
      console.log(err, 'withdrawDividens error');
      if (err?.error?.data != undefined) toast.error(err.error.data.message);
      else toast.error(err.message);
    }
  };

  const Claim = async (_address) => {
    if (!isLoaded) return [undefined, undefined];
    try {
      const provider = new ethers.providers.Web3Provider(walletProvider);
      const signer = provider.getSigner();
      const contract = new Contract(
        "0x8e941b8d50868CFd5D785bDC7E38B93aa696A337", [
          `function claim(address _token) external`
        ],
        signer,
      );

      await contract.claim(address.busd);
    } catch (err) {
      console.log(err, 'Claim error');
      if (err?.error?.data != undefined) toast.error(err.error.data.message);
      else toast.error(err.message);
      return [undefined, undefined];
    }
  };

  const Claim2 = async (_address) => {
    if (!isLoaded) return [undefined, undefined];
    try {
      const provider = new ethers.providers.Web3Provider(walletProvider);
      const signer = provider.getSigner();
      const contract = new Contract(
        "0x8e941b8d50868CFd5D785bDC7E38B93aa696A337", [
          `function claim(address _token) external`
        ],
        signer,
      );

      await contract.claim(address.busd);
    } catch (err) {
      console.log(err, 'Claim2 error');
      if (err?.error?.data != undefined) toast.error(err.error.data.message);
      else toast.error(err.message);
      return [undefined, undefined];
    }
  };

  const data = {
    address_,
    buy,
    withdrawTokens,
    getReserveToInvest,
    withdrawDividens,
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
      return data;
    }
  }, [accounts, isLoaded, Stake]);
}