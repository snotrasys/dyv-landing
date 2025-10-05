import React, { createContext, useState, useEffect, useContext } from 'react';
import Web3Context from './Web3Context';
import { address, useContract, useBUSD, useClaim, useTokenTest, useStakeRoi } from '../hooks/useContracts.js';
import { BigNumber, constants, ethers, utils } from 'ethers';

import { toast } from 'react-hot-toast';

import apiService from '../services/apiService';
import { useRouter } from 'next/router';
import UseStake from '@/hooks/UseStake';


const TonkenContext = createContext();
const userDefaul = {
  totalWithdrawn_: 0,
  hatcheryMiners: 0,
  sellEggs_: 0,
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
  referrerCount_: [0, 0, 0, 0, 0, 0],
  referrerBonus: [0, 0, 0, 0],
  time_: 0,
  timeLock_: 0,
  premiumBonus: 0,
  hasNft: false,
  debAmount: 0,
};
const TokenProvider = ({ children }) => {  
  const { accounts, isLoaded, setupdate, update, errorMessage } =
    useContext(Web3Context);
  const [id, setid] = useState(0);
  const [update_, setupdate_] = useState(0);
  const [pool_, setpool_] = useState(1)
  const [userData, setuserData] = useState(userDefaul);
  const [allData, setallData] = useState({
    totalUsers_: 0,
    totalInvested_: 0,
    totalReinvested_: 0,
    totalWithdrawn_: 0,
    totalDeposits_: 0,
    totalEarnings_: 0,
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
  const [isApprove, setisApprove] = useState(false);
  const [userWalletData, setuserWalletData] = useState([]);
    const [userRoi, setuserRoi] = useState({
      withdrawn_: 0,
    });
  const history = useRouter();
    const [rewards, setRewards] = useState(0);
  // const { isSpinnerShown, spinnerMessage, showSpinner, hideSpinner } =
  // useSpinner();

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

  const fANTOM = useContract();
  const Token = useBUSD();
  const Stake = UseStake();
  const useClaimVesting = useClaim()
  const TokenClaim = useTokenTest()
  const StakeRoi = useStakeRoi();
  

  useEffect(() => {
    getUser()
 
  }, [accounts]);

  const getRewardByWallet = async () => {
    if (!isLoaded) return;
    try {
      const [load, contract] = await StakeRoi;
      if (!load) {
        return;
      }

      const data = await contract.getRewardByWallet(accounts);
     const rewards_ = parse6Decimals(data)
     setRewards(rewards_)

    
    } catch (error) {
      console.log(error);
    }
  };


const getUser = async () => {
  if (!isLoaded) return;
  try {
    const [load, contract] = await StakeRoi;
    if (!load) return;

    const data = await contract.users(accounts);
    
    // No uses Object.assign con userData aquí
    setuserRoi({
      withdrawn_: parse6Decimals(data.withdraw)
    });

  } catch (error) {
    console.log(error);
  }
};



 const withdrawRewards = async () => {
  if (
    !isLoaded &&
    accounts != '000000000000000000000000000000000000000000000'
  )
    return;

  try { 
    const [load, contract] = await StakeRoi; 
    if (!load) return;

    const res = await contract.withdrawRewards();
    toast.success('withdrawTokens successfully');

    res.wait().then((value) => {
      updateHandle();
    });
  } catch (err) {
    console.log(err, 'withdrawRewards error');

    if (err?.error?.data != undefined) toast.error(err.error.data.message);
    else toast.error(err.message);
  }
};



  const balanceOfHandle = async () => {
    if (
      !isLoaded &&
      accounts != '000000000000000000000000000000000000000000000'
    )
      return;
    const [load, contract] = await TokenClaim;
    if (!load) return;

    let balance_ = await contract.balanceOf(accounts);
    balance_ = Number(ethers.utils.formatEther(balance_)).toFixed(3);
    setbalanceOf_(balance_);
  };


 const withdrawTokens = async () => {
  if (
    !isLoaded &&
    accounts != '000000000000000000000000000000000000000000000'
  )
    return;

  try { 
    const [load, contract] = await useClaimVesting; 
    if (!load) return;

    const res = await contract.withdrawTokens();
    toast.success('withdrawTokens successfully');

    res.wait().then((value) => {
      updateHandle();
    });
  } catch (err) {
    console.log(err, 'setWhitelist error');

    if (err?.error?.data != undefined) toast.error(err.error.data.message);
    else toast.error(err.message);
  }
};



  useEffect(() => {
    if (!isLoaded) return;
    // getPublicData();
    // getUserData(pool_);
    // // balanceOfETH()
    // getUserWalletData();

    balanceOfHandle();
    // // getUserDataDeposit();
    // allowanceHandle();
    return () => {};
  }, [accounts, isLoaded, update_,pool_]);

  

  const updateHandle = () => {
    setupdate_(update_ + 1);
  };
  const idHandle = (id_) => {
    setid(id_);
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
    const addr = address.fantom;
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
    const allowance_ = await contract.allowance(accounts, address.fantom);
    console.log(allowance_.gt(constants.MaxUint256.div(5)), 'allowance_');
    setisApprove(allowance_.gt(constants.MaxUint256.div(5)));
  };

  const invest = async (investAmt,_pool_,pay) => {
    if (!isLoaded) {
      errorMessage();
      return;
    }
    try {            
      const res = await Stake.invest(investAmt, pool_, address.btc, pay);
      toast.success('Invest success');
      res.wait().then((value) => {
        updateHandle();
      });
    } catch (err) {
      console.log(err, 'err');
      if (err.error.data != undefined) toast.error(err.error.data.message);
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

  const withdraw = async (pool,_useTokenFee ) => {
    if (!isLoaded) {
      errorMessage();
      return;
    }    

    try {
      const res = await Stake.withdraw(pool_,_useTokenFee);
      toast.success('withdraw success');
      if (!utils.isAddress(accounts) === false) {
        // verifyRegister();
      }
      res.wait().then((value) => {
        updateHandle();
      });
    } catch (err) {
      console.log(err, 'err');
      if (err.data != undefined) toast.error(err.data.message);
      else toast.error(err.message);
    }
  };
  const payBonus = async ( ) => {
    if (!isLoaded) {
      errorMessage();
      return;
    }    

    try {
      const res = await Stake.payBonus();
      toast.success('withdraw referrer success');
      if (!utils.isAddress(accounts) === false) {
        // verifyRegister();
      }
      res.wait().then((value) => {
        updateHandle();
      });
    } catch (err) {
      console.log(err, 'err');
      if (err.data != undefined) toast.error(err.data.message);
      else toast.error(err.message);
    }
  };

  const harvest = async ( a,_useTokenFee) => {
    if (!isLoaded) {
      errorMessage();
      return;
    }    

    try {
      const res = await Stake.harvest(pool_,_useTokenFee);
      toast.success('withdraw success');
      if (!utils.isAddress(accounts) === false) {
        // verifyRegister();
      }
      res.wait().then((value) => {
        updateHandle();
      });
    } catch (err) {
      console.log(err, 'err');
      if (err.error.data != undefined) toast.error(err.error.data.message);
      else toast.error(err.message);
    }
  };

  const reinvestment = async (pool) => {
    if (!isLoaded) {
      errorMessage();
      return;
    }
    
    try {    
      

      const res = await Stake.reinvest(pool);
      toast.success('Invest success');
      if (!utils.isAddress(accounts) === false) {
        // verifyRegister();
      }
      res.wait().then((value) => {
        updateHandle();
      });
    } catch (err) {
      console.log(err, 'err');
      if (err.error.data != undefined) toast.error(err.error.data.message);
      else toast.error(err.message);
    }
  };

  const getUserDataDepositlenght = async () => {
    if (
      !isLoaded &&
      accounts != '000000000000000000000000000000000000000000000'
    )
      return;
    const [load, contract] = await fANTOM;
    if (!load) return;
    const data = await contract.getUserAmountOfDeposits(accounts);

    const length = data.toNumber();
    // console.log(data.toNumber(),accounts);
    if (length == 0) return;
    setdeposit(length);

    let plans_ = [];

    for (let index = 0; index < length; index++) {
      const { plan, percent, amount, start, finish } =
        await contract.getUserDepositInfo(accounts, index);
      // console.log(amount,"lenghtlenght");
      plans_.push({
        plan,
        percent: percent.toNumber(),
        amount: utils.formatEther(amount),
        start: start.toNumber(),
        finish: finish.toNumber(),
        wallet: accounts,
      });
    }

    setuserPlans(plans_);
  };

  const getUserDataDeposit = async (id) => {
    if (
      !isLoaded &&
      accounts != '000000000000000000000000000000000000000000000'
    )
      return;
    const [load, contract] = await fANTOM;
    if (!load) return;
    // const { plan, withdrawn, amount, start } = await contract.getUserPlans(accounts,);
    const planas = await contract.getUserPlans(accounts);
    let plans_ = [];
    const days = [10, 15, 20, 30];
    if (planas.length > 0) {
      planas.map((value) => {
        const id = value.plan.toString();
        plans_.push({
          plan: id,
          withdrawn: utils.formatEther(value.withdrawn),
          amount: utils.formatEther(value.amount),
          start: value.start.toNumber(),
          finish: days[id],
          wallet: accounts,
        });
      });
    }
    setuserPlans(plans_);

    // plans_.push({
    //   plan,
    //   percent: percent.toNumber(),
    //   amount: utils.formatEther(amount),
    //   start: start.toNumber(),
    //   finish: finish.toNumber(),
    //   wallet: accounts,
    // });
  };
  const getUserData = async (pool) => {
    if (
      !isLoaded &&
      accounts != '000000000000000000000000000000000000000000000'
    )
      return;
    

    try {

      const [data,balance_] = await Stake.getUserData(accounts,pool);
      const users = await Stake.users(accounts,pool);
      const referrer_ = await Stake.getRefData(accounts);
      // address user;
      // address referrer;
      // uint investment;
      // uint stakingValue;
      // uint rewardLockedUp;
      // uint totalDeposit;
      // uint totalWithdrawn;
      // uint nextWithdraw;
      // uint unlockDate;
      // uint depositCheckpoint;
      // uint debAmount;
      // bool hasNft;

      // const user_ = await contract.users(accounts,);

      

      // const date = await contract.getDate();
      // // const getMyBonus = await contract.getMyBonus(accounts,false);

      // const dateNumber = date.toNumber();
      // let nextNumber = data.checkpoint.toNumber();
      // nextNumber = nextNumber + 86400;
      // let interval = dateNumber > nextNumber ? 0 : nextNumber - dateNumber;
      // let time_ = interval / 3600;

      const data_ = {
        totalWithdrawn_: Number(utils.formatEther(data.totalWithdrawn)).toFixed(4),
        totalDeposits_: Number(utils.formatEther(data.investment)).toFixed(4),
        totalEarnings_:
          (-Number(utils.formatEther(data.investment)) +
          Number(utils.formatEther(data.totalWithdrawn))).toFixed(6),
        // totalBonus_: Number(utils.formatEther(data.totalBonus_)).toFixed(7),
        // // totalreinvest_: pausa?0:utils.formatEther(data.totalreinvest_),
        hold_: Number(utils.formatEther(data.rewardLockedUp)).toFixed(
          4,
        ),
        balance_: Number(utils.formatEther(balance_)).toFixed(4),
        hasNft: data.hasNft,
        //       hatcheryMiners:data.hatcheryMiners_.toString(),
        // sellEggs_: utils.formatEther(data.sellEggs_),
        // eggsMiners_: Number(utils.formatEther(data.busdTotalDeposit)).toFixed(4),
        debAmount: Number(utils.formatEther(users.debAmount)).toFixed(3),
        premiumBonus:Number(utils.formatEther(data.rewardLockedUp)).toFixed(4),
        // nextAssignment_: pausa ? 0 : data.nextAssignment_.toString(),
        // amountOfDeposits: data.amountOfDeposits.toString(),
        // checkpoint: pausa ? 0 : data.checkpoint.toString(),
        // isUser_: data.isUser_,
        referrer_: data.referrer,
        referrerCount_: referrer_.refLevels.map((value) => value.toString()),
        // referrerBonus: [0, 0, 0],
        // referrerCount_: data._referrerCounts.map((value) => value.toString()),
        referrerAmount:ethers.utils.formatEther(referrer_.bonus),
        timeLock_ : Number(data.unlockDate.toString()),
        time_: Number(data.nextWithdraw.toString()),
        
        // referrerBonus: utils.formatEther(_referrerBonus),
      };
      // console.log(data,"userData");
      console.log(data_, 'userData');
      const res = Object.assign({}, userData, data_);
      setuserData(res);
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
      

      // returns (uint256 _totalInvest, uint256 _balance)
      // const pausa = await contract.isPaused();

      const data = await Stake.getPublicData();
      // uint totalUsers_,
      // uint totalInvested_,
      // uint totalDeposits_,
      // uint totalReinvested_,
      // uint totalReinvestCount_,
      // uint totalWithdrawn_,
      // bool isPaused_
      // const getPlayers = await contract.getPlayers();

      // const data = await contract.getBalance();
      console.log(utils.formatEther(data.totalInvested_), 'getPublicData');

      const data_ = {
        totalUsers_: data.totalUsers_.toString(),
        totalInvested_: utils.formatEther(data.totalInvested_),
        // totalReinvested_: utils.formatEther(data.totalReinvested_.toString()),
        // totalWithdrawn_: utils.formatEther(data.totalWithdrawn_.toString()),
        // totalDeposits_: data.totalDeposits_.toString(),
        balance_: utils.formatEther(data.totalInvested_),
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
    getUserData,
    harvest,
    setpool_,
    pool_,
    payBonus,
    withdrawTokens,
    getRewardByWallet,
    withdrawRewards,
    rewards,
    userRoi,
  };

  return (
    <TonkenContext.Provider value={datas}>{children}</TonkenContext.Provider>
  );
};

export { TokenProvider };
export default TonkenContext;


const parse6Decimals = (value) => {
  return Number(ethers.utils.formatUnits(value, 6)).toFixed(2);
};
