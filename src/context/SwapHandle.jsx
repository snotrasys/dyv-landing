import React, { createContext, useState, useEffect, useContext } from 'react';
import Web3Context from './Web3Context';
import { address, useContract, useBUSD, useToken } from '../hooks/useContracts.js';
import { BigNumber, constants, ethers, utils } from 'ethers';
import { useToasts } from 'react-toast-notifications';
import { toast } from 'react-hot-toast';
import refHandle from '../hooks/utils';
import { useSpinner } from './SpinnerContext';
import apiService from '../services/apiService';
import { useRouter } from 'next/router';
import { useSwap } from '@/hooks/useSwap';
import UsePresaleVesting from '@/hooks/UsePresaleVesting';


const SwapContext = createContext();
const userDefaul = {
  user: '',
  id: 0,
  invest: 0,
  toWithdraw: 0,
  tokenAmount:"",
        investAmount:"",
        totalWithdrawn:"",
        lastWithdrawn:"",
        hasWithdrawn:"",
        referrals:"",
        referrer:"",
};
const SwapProvider = ({ children }) => {
  const { accounts, isLoaded, setupdate, update, errorMessage } =
    useContext(Web3Context);
  const [update_, setupdate_] = useState(0);
  const [balanceOf, setbalanceOf_] = useState(0);
  const [balanceOfConctract, setbalanceOfContract_] = useState(0);
  const [userData, setuserData] = useState(userDefaul);
  const [allData, setallData] = useState({
    totalInvested_: 0,
  });

  const [userData1, setuserData1] = useState({
    totalWithdrawn_: 0,
    hatcheryMiners: 0,
    sellEggs_: 0,
	  eggsMiners_: 0,
    totalDeposits_: 0,
    totalBonus_: 0,
    totalreinvest_: 0,
    hold_: 0,
    balance_: 0,
    balanceOf:0,
    referrerAmount: 0,
    nextAssignment_: 0,
    amountOfDeposits: 0,
  checkpoint: 'Loading...',
    isUser_: false,
    referrer_: "",
    deltaWithdrawDate: 0,
    referrerCount_: [0, 0, 0],
    referrerBonus: [0, 0, 0],
    time_: 0,
  });

  const [isApprove, setisApprove] = useState(false);
  const history = useRouter();

  const [Swap] = useSwap();
  const Token = useToken();
  const Presale = UsePresaleVesting();

  useEffect(() => {
    if (!isLoaded) return;
    // allowanceHandle();
    // balanceOfHandle();
    getPublicData()
    getUserData();
    // TotalBalance();

    return () => {};
  }, [accounts, isLoaded, update_]);

  const updateHandle = () => {
    setupdate_(update_ + 1);
  };

  const balanceOfHandle = async () => {
    if (
      !isLoaded &&
      accounts != '000000000000000000000000000000000000000000000'
    )
      return;
    const [load, contract] = await Token;
    if (!load) return;

    let balance_ = await contract.balanceOf(accounts);
    balance_ = Number(ethers.utils.formatEther(balance_)).toFixed(3);
    setbalanceOf_(balance_);
  };

  const approveHandle = async (type) => {
    if (
      !isLoaded &&
      accounts != '000000000000000000000000000000000000000000000'
    )
      return;
    const [load, contract] = await Token;
    if (!load) return;
    
    const addr = Swap.address_;
// console.log(addr,'addr');
//     return
    const res = await contract.approve(addr, constants.MaxUint256);
    res.wait().then(() => updateHandle());
  };

  const allowanceHandle = async () => {
    if (
      !isLoaded &&
      accounts != '000000000000000000000000000000000000000000000'
    )
      return;
    const [load, contract] = await Token;
    if (!load) return;     
    const addr = Presale.address_;
    const allowance_ = await contract.allowance(accounts, addr);
    console.log(allowance_.gt(constants.MaxUint256.div(5)), 'allowance_');
    setisApprove(allowance_.gt(constants.MaxUint256.div(5)));
  };

  const invest = async (investAmt) => {
    if (!isLoaded) {
      errorMessage();
      return;
    }
    try {
      // investAmt = utils.parseEther(investAmt.toString());
      const res =await Presale.buy(investAmt);      
      toast.success('Invest success');
      
      res.wait().then((value) => {
        updateHandle();
      });
            
    } catch (err) {
      if (err.data != undefined) toast.error(err.data.message);
      else toast.error(err.message);
    }
  };
  // userData
  const verifyRegister = async () => {
    // showSpinner();
    try {
      console.log(accounts);
      await apiService.get(`/user/verify/${accounts}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.log(error, 'error');

      history.push(`/register${window.location.search}`);
    } finally {
      // hideSpinner();
    }
  };

  const withdraw = async () => {
    if (!isLoaded) {
      errorMessage();
      return;
    }

    try {
      const res = await Presale.withdrawTokens();
      toast.success('withdraw success');
      // if (!utils.isAddress(accounts) === false) {
      //   verifyRegister();
      // }
      res.wait().then((value) => {
        updateHandle();
      });
    } catch (err) {
      if (err.data != undefined) toast.error(err.data.message);
      else toast.error(err.message);
    }
  };

  const TotalBalance = async () => {
    if (
      !isLoaded &&
      accounts != "000000000000000000000000000000000000000000000"
    )
      return;
    const [load, contract] = await Token;
    const balanceOf = await contract.balanceOf(Swap.address_);
    const balanceOf_ = Number(ethers.utils.formatEther(balanceOf));
    setbalanceOfContract_(balanceOf_);
    return balanceOf_;
  
  };

  const getUserData = async () => {
    if (
      !isLoaded &&
      accounts != '000000000000000000000000000000000000000000000'
    )
      return;
    try {
      const data = await Presale.sales()
      console.log(data.investAmount.toString(),'data');
      // address buyer;
      //   uint tokenAmount;
      //   uint bonusToken;
      //   uint investAmount;
      //   uint toWithdraw;
      //   uint totalWithdrawn;
      //   uint lastWithdraw;
      //   bool hasWithdrawn;
      //   address referrals;
      //   uint[1] referrer;
      //   uint[1] referrerAmount;
      
      const data_ = {
        // user: data.user,
        // id: data.id.toString(),
        invest: ParseEther(data.investAmount),
        toWithdraw: ParseEther(data.tokenAmount),        
        tokenAmount:ParseEther(data.tokenAmount),
        investAmount:ParseEther(data.investAmount),
        totalWithdrawn:ParseEther(data.tokenAmount),
        // lastWithdrawn:data.lastWithdrawn.toString(),
        hasWithdrawn:data.hasWithdrawn.toString(),
        referrals:data.referrals,
        // referrer:data.referrals.map((e)=>e.toString())
      };
      console.log(data_,accounts, 'getUserData');
      const res = Object.assign({}, userData, data_);
      setuserData(res);
    } catch (error) {
      console.log('Errr user', error);
      setuserData(userDefaul);
    }
  };


  const ParseEther = (amount) => {    
    return utils.formatUnits(amount, 6);
  };
  

  const getPublicData = async () => {
    if (
      !isLoaded &&
      accounts != '000000000000000000000000000000000000000000000'
    )
      return;
    try {
      const data = await Presale.totalInvested();

      

      const data_ = {
        totalInvested_: ParseEther(data),
      };

      setallData(data_);
    } catch (error) {
      console.log('Errr public', error);
    }
  };
  

  const datas = {
    userData,
    allData,
    balanceOf,
    invest,
    withdraw, 
    updateHandle,
    getUserData,
    isApprove,
    getPublicData,
    approveHandle,
    allowanceHandle,
    balanceOfConctract,
    
    
      };

  return <SwapContext.Provider value={datas}>{children}</SwapContext.Provider>;
};

export { SwapProvider };
export default SwapContext;

export const useSwap_ = ()=>useContext(SwapContext); 
