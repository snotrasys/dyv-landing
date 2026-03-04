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
  tokenAmount: "",
  investAmount: "",
  totalWithdrawn: "",
  lastWithdrawn: "",
  hasWithdrawn: "",
  referrals: "",
  referrer: "",
  data: [],
  nextDates: [],
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

    return () => { };
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
      const res = await Presale.buy(investAmt);
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
      res.wait().then((value) => {
        updateHandle();
      });
    } catch (err) {
      if (err.data != undefined) toast.error(err.data.message);
      else toast.error(err.message);
    }
  };

  const withdrawData = useMemo(async () => {
    let withdrawData_ = [];
    if (
      !isLoaded &&
      accounts != '000000000000000000000000000000000000000000000'
    )
      return withdrawData_
    if (!userData.data)
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
      const data = await Presale.sales()
      sleep(500);

      const currentUserBalance = await Presale.currentUserBalance();
      // data fields according to DYV_V2:
      // data[0] totalWithdrawn_
      // data[1] totalRewards
      // data[2] depositBalance (mapped to currentUserBalance)
      // data[3] totalDeposits_ (mapped to investAmount)
      // data[4] nextAssignment_
      // data[5] amountOfDeposits
      // data[6] checkpoint
      // data[7] maxWithdraw
      // data[8] referrer_
      // data[9] referrerCount_

      let nextDates = [];
      let nextDatesRaw = 0;
      if (data[4] && data[4].gt(0)) {
        nextDates = [DateTime.fromSeconds(Number(data[4].toString())).toLocaleString(DateTime.DATETIME_SHORT)];
        nextDatesRaw = Number(data[4].toString());
      }

      const data_ = {
        invest: ParseEther(data[3] || 0),
        investAmount: ParseEther(data[3] || 0),
        tokenAmount: ParseEther(data[7] || 0), // Use maxWithdraw to calculate limit progress
        totalWithdrawn: ParseEther(data[0] || 0),
        currentUserBalance: ParseEther(currentUserBalance || data[2]),
        totalRewards: ParseEther(data[1] || 0),
        hasWithdrawn: "false", // We don't have this boolean natively now
        referrals: data[8],
        data: ParseEther(data[2] || 0),
        nextDates: nextDates,
        nextDatesRaw: nextDatesRaw,
      };
      console.log(data_, accounts, 'getUserData');
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
      // Returns [totalUsers_, totalInvested_, totalWithdrawn_, totalDeposits_, balance_]
      const data = await Presale.totalInvested();

      const data_ = {
        totalInvested_: ParseEther(data[1] || 0),
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

export const useSwap_ = () => useContext(SwapContext); 
