import React, { createContext, useState, useEffect, useContext } from 'react';
import Web3Context from './Web3Context';
import {
  address,
  usePrivateSale,
  usePublicSale,
} from '../hooks/useContracts.js';
import { BigNumber, constants, ethers, utils } from 'ethers';

import { toast } from 'react-hot-toast';
import refHandle from '../hooks/utils';
// import { useSpinner } from './SpinnerContext';
import apiService from '../services/apiService';
import { useRouter } from 'next/router';
import { useNftMarket } from '@/hooks/UseNftMarket';

const PresaleContext = createContext();
const userDefaul = {
  totalWithdrawn_: 0,
  hatcheryMiners: 0,
  sellEggs_: 0,
  tokenAmount_: 0,
  eggsMiners_: 0,
  totalDeposits_: 0,
  totalBonus_: 0,
  totalreinvest_: 0,
  hold_: 0,
  balance_: 0,
  balanceOf: 0,
  referrerAmount: 0,
  nextAssignment_: 0,
  amountOfDeposits: 0,
  checkpoint: 0,
  isUser_: false,
  referrer_: [0, 0, 0, 0, 0, 0],
  deltaWithdrawDate: 0,
  referrerCount_: [0, 0, 0, 0],
  referrerBonus: [0, 0, 0, 0],
  time_: 0,
  premiumBonus: 0,
};
const PresaleProvider = ({ children }) => {  
  const { accounts, isLoaded, setupdate, update, errorMessage } =
    useContext(Web3Context);
  const [id, setid] = useState(0);
  const [update_, setupdate_] = useState(0);
  const [userData, setuserData] = useState(userDefaul);
  const [allData, setallData] = useState({
    totalUsers_: 0,
    totalInvested_: 0,
    totalReinvested_: 0,
    totalWithdrawn_: 0,
    totalDeposits_: 0,
    totalEarnings_: 0,
    tokenAmount_: 0,
    balance_: 0,
    eggPrices_: 0,
    balanceOf: 0,
    roiBase: 0,
    bonusPool: 0,
    comunityBonus: 0,
    currentRoi: 0,
    maxProfit: 0,
    minDeposit: 0,
    daysFormdeploy: 0,
  });
  const [deposit, setdeposit] = useState(0);
  const [balanceOf, setbalanceOf_] = useState(0);
  const [balanceOfToken, setbalanceOfToken_] = useState(0);
  const [isApprove, setisApprove] = useState(false);
  const [userWalletData, setuserWalletData] = useState([]);
  const history = useRouter();
  // const { isSpinnerShown, spinnerMessage, showSpinner, hideSpinner } =
  //   useSpinner();

  const [userPlans, setuserPlans] = useState([
    {
      plan: 0,
      percent: 0,
      amount: 0,
      start: 0,
      finish: 0,
      withdrawn: 0,
    },
  ]);
  const [btcPrice, setBtcPrice] = useState(1);

  const privateSale = usePrivateSale();
  const publicSale = usePublicSale();
  const [nftMArket]=useNftMarket("0xFAf1b3e6C471BB9037a4fcBA294CaB5346a6A287")
  const Token = useBUSD();



  useEffect(() => {
    if (!isLoaded) return;
    try {
      getPublicData();
      getUserData();
      balanceOfETH();
      // getUserWalletData();

      balanceOfHandle();
      // // getUserDataDeposit();
      allowanceHandle();
    } catch (error) {
      console.log(error);
    }
    return () => {};
  }, [accounts, isLoaded, update_]);

  const updateHandle = () => {
    setupdate_(update_ + 1);
  };
  const idHandle = (id_) => {
    setid(id_);
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
    setbalanceOfToken_(balance_);
  };

  const balanceOfETH = async () => {
    if (
      !isLoaded &&
      accounts != '000000000000000000000000000000000000000000000'
    )
      return;
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    // let balance_ = etherJSProvider();
    let balance_ = await provider.getBalance(accounts);
    // console.log(await provider.getBalance(accounts),"balance_");
    // return
    balance_ = Number(ethers.utils.formatEther(balance_)).toFixed(4);
    // const res =Object.assign({},userData,{balanceOf:balance_})
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
    const addr = nftMArket.address_;
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
    const allowance_ = await contract.allowance(accounts, nftMArket.address_);
    console.log(allowance_.gt(constants.MaxUint256.div(5)), 'allowance_');
    setisApprove(allowance_.gt(constants.MaxUint256.div(5)));
  };

  const invest = async (amount_) => {
    if (!isLoaded) {
      errorMessage();
      return;
    }
    // const ref_ = refHandle();

    try {
 
// console.log(await nftMArket.calculatePrice(1));
//       return

      // investAmt = utils.parseEther(investAmt.toString());

      // // console.log(investAmt.toString(),"investAmt");
      console.log(amount_);
      // // return
      // // return
      // return
      const res = await nftMArket.buy(amount_);
      toast.success('Invest success');
      // res.wait().then((value) => {
      //   updateHandle();
      // });
    } catch (err) {
      if (err.data != undefined) toast.error(err.data.message);
      else toast.error(err);
      // else toast.error(err.message.split("reason=\"")[1].split("\",")[0])
    }
  };
  // userData
  const verifyRegister = async () => {
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
    console.log("finally");  
    }
  };

  const withdraw = async (isPrivate) => {
    if (!isLoaded) {
      errorMessage();
      return;
    }
    let contract;
    let load;
    if (isPrivate) {
      const [load1, contract1] = await privateSale;
      load = load1;
      contract = contract1;
    } else {
      const [load2, contract2] = await publicSale;
      load = load2;
      contract = contract2;
    }

    if (!load) return;

    try {
      const res = await contract.withdrawTokens();
      toast.success('withdraw success');
      if (!utils.isAddress(accounts) === false) {
        verifyRegister();
      }
      res.wait().then((value) => {
        updateHandle();
      });
    } catch (err) {
      if (err.data != undefined) toast.error(err.data.message);
      else toast.error(err.message);
    }
  };

  const reinvestment = async () => {
    if (!isLoaded) {
      errorMessage();
      return;
    }
    const ref_ = refHandle();
    try {
      const [load, contract] = await privateSale;
      if (!load) return;

      const res = await contract.reInvest();
      toast.success('Invest success');
      if (!utils.isAddress(accounts) === false) {
        verifyRegister();
      }
      res.wait().then((value) => {
        updateHandle();
      });
    } catch (err) {
      if (err.data != undefined) toast.error(err.data.message);
      else toast.error(err.message);
    }
  };

  
 
  const getUserData = async () => {
    if (
      !isLoaded &&
      accounts != '000000000000000000000000000000000000000000000'
    )
      return;
     


    try {
      const res = await nftMArket.getUser();
    //   address user;
    //   uint id;
    //   uint nftBought;
    //   uint tokenInvested;
    //   uint bnbInvested;

      
// console.log(Number(utils.formatEther(user2_.tokenAmount)).toFixed(4));
console.log(res,"res");      
const data_ = {
        // totalWithdrawn_: Number(utils.formatEther(user_.withdraw)).toFixed(4),
        totalDeposits_: Number(utils.formatEther(res.tokenInvested)).toFixed(
          4,
        ),
        totalEarnings_: Number(utils.formatEther(res.bnbInvested)).toFixed(
          4,
        ),
        // totalBonus_: Number(utils.formatEther(user2_.tokenAmount)).toFixed(4),
        // // totalreinvest_: pausa?0:utils.formatEther(data.totalreinvest_),
        // hold_: Number(utils.formatEther(data.amountAvailableReinvest_)).toFixed(
        //   4,
        // ),
        balance_: res.nftBought.toString(),
        //       hatcheryMiners:data.hatcheryMiners_.toString(),
        // sellEggs_: utils.formatEther(data.sellEggs_),
        // eggsMiners_: data.beatsMiners_.toString(),

        // premiumBonus: user_.premiumBonus.toString(),
        // nextAssignment_: pausa ? 0 : data.nextAssignment_.toString(),
        // amountOfDeposits: data.amountOfDeposits.toString(),
        // checkpoint: pausa ? 0 : data.checkpoint.toString(),
        // isUser_: data.isUser_,
        // referrer_: data.referrer,
        // referrerCount_: [0, 0, 0],
        // referrerBonus: [0, 0, 0],
        // referrerCount_: data._referrerCounts.map((value) => value.toString()),
        // referrerAmount: referrerAmount,
        // time_: time_.toFixed(2),
        // referrerBonus: utils.formatEther(_referrerBonus),
      };
      // console.log(data,"userData");
      // console.log(data_, 'userData');
      const res1 = Object.assign({}, userData, data_);
      setuserData(res1);
    } catch (error) {
      console.log('Errr user', error);
      setuserData(userDefaul);
    }
  };

  const getPublicData = async () => {
    if (
      !isLoaded &&
      accounts != '000000000000000000000000000000000000000000000'
    )
      return;
    try {
      const res = await nftMArket.getPublicData();

      // if (!load) return;

      // returns (uint256 _totalInvest, uint256 _balance)
      // const pausa = await contract.isPaused();

     
      // const getPlayers = await contract.getPlayers();

      // const data = await contract.getBalance();
      // console.log(res, 'getPublicData');
      // address _token, uint _nftSold, uint _maxNFT, uint _tokenInvested, uint _bnbInvested, uint _totalUsers
      console.log(res);
      const data_ = {
        totalUsers_: res._totalUsers.toString(),
        totalInvested_: utils.formatEther(res._tokenInvested),
        totalReinvested_: utils.formatEther(res._bnbInvested),
        // totalWithdrawn_: utils.formatEther(data.totalWithdrawn_.toString()),
        // totalDeposits_: utils.formatEther(data2),
        balance_: res._nftSold.toString(),
        // eggPrices_: utils.formatEther(data._eggPrices)
        // roiBase: data.roiBase.toString(),
        // bonusPool: data.bonusPool.toString(),
        // comunityBonus: data.comunityBonus.toString(),
        // currentRoi: Number(data.currentRoi.toString())/10,
        // maxProfit: data.maxProfit.toString(),
        // minDeposit: data.minDeposit.toString(),
        // daysFormdeploy: data.daysFormdeploy.toString(),
      };

      setallData(data_);
    } catch (error) {
      console.log('Errr public', error);
    }
  };

  const datas = {
    userData,
    allData,
    invest,
    withdraw,
    reinvestment,
    updateHandle,
    idHandle,
    id,
    btcPrice,
    userPlans,
    balanceOf,
    isApprove,
    approveHandle,
    deposit,
    userWalletData,
    balanceOfToken
  };

  return (
    <PresaleContext.Provider value={datas}>{children}</PresaleContext.Provider>
  );
};

export const useSPresale = () => useContext(PresaleContext);

export { PresaleProvider };
export default PresaleContext;
