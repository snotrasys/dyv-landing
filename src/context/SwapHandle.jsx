import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import Web3Context from './Web3Context';
import { useToken } from '../hooks/useContracts.js';
import { constants, ethers, utils } from 'ethers';
import { toast } from 'react-hot-toast';
import apiService from '../services/apiService';
import { useRouter } from 'next/router';
import { useSwap } from '@/hooks/useSwap';
import UsePresaleVesting from '@/hooks/UsePresaleVesting';
import { DateTime } from 'luxon';


const SwapContext = createContext();
const userDefaul = {
  user: '',
  id: 0,
  invest: 0,
  toWithdraw: 0,
  currentUserBalance: 0,
  tokenAmount:"",
        investAmount:"",
        totalWithdrawn:"",
        lastWithdrawn:"",
        hasWithdrawn:"",
        referrals:"",
        referrer:"",
        data:[],
        nextDates:[],
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

  const withdrawData = useMemo(async() => {
    let withdrawData_ =[];
    if (
      !isLoaded &&
      accounts != '000000000000000000000000000000000000000000000'
    )
      return withdrawData_
      if(!userData.data )
      return withdrawData_

     try {
     
    
      withdrawData_ = await Presale.withdrawData(accounts);
      console.log(withdrawData_, 'withdrawData');
      withdrawData_ = withdrawData_.map((e) => {
        return {
          date: DateTime.fromSeconds(Number(e.date.toString())).toLocaleString(DateTime.DATETIME_MED),
          tokenAmount: ParseEther(e.tokenAmount),
        }
      });
      

    } catch (error) {
      console.log(error, 'withdrawData');
      withdrawData_ = [];
     
    } 
    return withdrawData_;   
  }, [userData]);

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const getUserData = async () => {
    if (
      !isLoaded &&
      accounts != '000000000000000000000000000000000000000000000'
    )
      return;
    try {
      const [lastBlock_,data] = await Presale.sales()
      sleep(500);
    
      const currentUserBalance = await Presale.currentUserBalance(accounts);
      console.log(currentUserBalance, 'currentUserBalance');
      sleep(500);
      
      
      let nextDates = await Presale.nextDates();
           
     if(nextDates.length>0 && nextDates[0]>0)
  nextDates=nextDates.map(e=>DateTime.fromSeconds(Number(e.toString())).toLocaleString(DateTime.DATETIME_SHORT))
    else 
  nextDates=[]
      
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
        totalWithdrawn:ParseEther(data.totalWithdrawn),
        currentUserBalance:ParseEther(currentUserBalance),
        bonusToken: ParseEther(data.bonusToken),
        // lastWithdrawn:data.lastWithdrawn.toString(),
        hasWithdrawn:data.hasWithdrawn.toString(),
        referrals:data.referrals,
        data:ParseEther(data.toWithdraw),
        nextDates:nextDates,
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
    return Number(utils.formatUnits(amount, 6));
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
    withdrawData
    
    
      };

  return <SwapContext.Provider value={datas}>{children}</SwapContext.Provider>;
};

export { SwapProvider };
export default SwapContext;

export const useSwap_ = ()=>useContext(SwapContext); 
