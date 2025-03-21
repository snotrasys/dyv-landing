import { Fragment, use } from 'react';
import { Tab } from '@headlessui/react';
import { Layout } from '@/components/app/Layout';
import Web3Context from '@/context/Web3Context';
import { useToken } from '@/hooks/UseToken';
import { address } from '@/hooks/useContracts';
// import UseStake from '@/pages/stake/UseStake';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { ethers } from 'ethers';
import Link from 'next/link';
import { userInfo } from 'os';
import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import PriceBIOTIC from '../PriceBIOTIC';
import { DateTime } from 'luxon';

import { useCountdownV2 } from '@/hooks/useCountdown';
import InvestStake from './InvestStake';
import ClaimStake from './ClaimStake';
import UseStakePlus from '@/hooks/UseStakeNFT';
import { UsePrice } from '../UsePrice';
import TonkenContext from '@/context/TokenHandle';

function Stake({}) {
  const [data, setdata] = useState(  {
    id: 0,
    duration: 16,
    range: "10 to 99 USDT",
    roiWithoutNFT: "1%",
    roiWithNFT: "1.5%",
    nftValue: { type: "fixed", value: 5 }, 
    feeUSD: "10% claim and capital, reinvest",
    feeToken: "7% claim and capital, reinvest",
  },);
  // const [stake]=
  const {userData,
    allData,
    // invest,
    withdraw,
    reinvestment,    
    balanceOf,    
    } = useContext(TonkenContext)
  const [pool, setpool] = useState(1);
  const [totalStakedLocked, setTotalStakedLocked] = React.useState(20);
  const [totalStakedLockedUSD, setTotalStakedLockedUSD] = React.useState(10000);
  const [stakingValue, setStakingValue] = React.useState(0);
  const [totalethClaimed, setTotalethClaimed] = React.useState(200);
  const [totalethClaimedUSD, setTotalethClaimedUSD] = React.useState(10000);
  const [isApprove, setisApprove] = useState(false);
  const [amount, setamount] = useState(0);
  const StakeHandle = UseStakePlus(pool);
  const { isLoaded, accounts } = useContext(Web3Context);
  const Biotic = useToken(address.Biotic);
  const ximbia = useToken(address.ximbia);
  const [pendingRewards, setpendingRewards] = useState(0);
  const [Earned, setEarned] = useState(0);
  const [youStake, setyouStake] = useState(0);
  const [update, setupdate] = useState(0);
  const [userTime, setUserTime] = useState(30);
  const [userTimeUnlock, setUserTimeUnlock] = useState(0);
  const ximbiaPrice = UsePrice(address.ximbia);
  // 0xaEa17458b517D37Fd504c500cfFF0c3aA8ea7b33
  // const bioticPrice = UsePrice(address.Biotic);
  const [reWardsUSD, setreWardsUSD] = useState(0);
  const [youStakeUSD, setyouStakeUSD] = useState(0);
  const [pendingRewardsUSD, setpendingRewardsUSD] = useState(0);
  const [checkBox, setcheckBox] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    setdata(stakeType[pool-1]);
    // handle();
    // userhandle();
    // allowance();

    return () => {};
  }, [
    pool,
    isLoaded,
    accounts,
    update,
    data,
    totalStakedLocked,
    totalethClaimed,
    // StakeHandle,
    isApprove,
  ]);


  
  useEffect(() => {
    if (!isLoaded) return;
    calculateRewards();

    return () => {};
  }, [isLoaded, data, totalStakedLocked, totalethClaimed,checkBox ]);

  const calculateRewards = async () => {
    try {
      const [stake] = StakeHandle;
      const user = await stake.users(pool);
      const data_ = await stake.dataStake(pool);
      const price_ = ximbiaPrice; // data.invest == 'XMB' ? ximbiaPrice : bioticPrice;
      const totalDeposit_ = user.userInfo_.totalDeposit;
      let youStakeUSD_ =
        parseFloat(ethers.utils.formatEther(totalDeposit_)) * price_.price;
      setyouStakeUSD(youStakeUSD_.toFixed(2));
      if (data.reward == 'BNB') {
        // console.log(price_.priceBnb );
        const pendingRewards_ = user.pendingRewards;
        let pendingRewardsUSD_ =
          parseFloat(ethers.utils.formatEther(pendingRewards_)) *
          price_.priceBnb;
        let totalWithdrawn = user.userInfo_.totalWithdrawn;
        let totalInvestBNB = user.userInfo_.stakingValue;
        setStakingValue(
          parseFloat(ethers.utils.formatEther(totalInvestBNB)).toFixed(2),
        );
        let totalWithdrawnUSD_ =
          parseFloat(ethers.utils.formatEther(totalWithdrawn)) *
          price_.priceBnb;
        let totalethClaimedUSD_ = parseFloat(totalethClaimed) * price_.priceBnb;
        setTotalethClaimedUSD(totalethClaimedUSD_.toFixed(2));
        setreWardsUSD(totalWithdrawnUSD_.toFixed(2));
        setpendingRewardsUSD(pendingRewardsUSD_.toFixed(2));
      } else {
        const pendingRewards_ = user.pendingRewards;
        // console.log(price_.price);
        let pendingRewardsUSD_ =
          parseFloat(ethers.utils.formatEther(pendingRewards_)) * price_.price;
        let totalWithdrawn = user.userInfo_.totalWithdrawn;
        let totalWithdrawnUSD_ =
          parseFloat(ethers.utils.formatEther(totalWithdrawn)) * price_.price;
        setreWardsUSD(totalWithdrawnUSD_.toFixed(2));
        setpendingRewardsUSD(pendingRewardsUSD_.toFixed(2));
      }
      let totalethClaimedUSD_ = parseFloat(totalethClaimed) * price_.price;
      let totalStakedLockedUSD_ = parseFloat(totalStakedLocked) * price_.price;
      setTotalStakedLockedUSD(totalStakedLockedUSD_.toFixed(2));
      setTotalethClaimedUSD(totalethClaimedUSD_.toFixed(2));
    } catch (error) {
      console.log('err calculateRewards', error);
      //console.log(error);
    }
  };



  const payBonus = async () => {
    console.log('invest');
    try {
      const [stake] = StakeHandle;
      const rest = await stake.payBonus(pool);
      rest.wait().then(() => {
        setupdate((e) => e + 1);
        toast.success('Success Invest');
      });
    } catch (err) {
      if (err.data != undefined) toast.error(err.data.message);
      else toast.error(err.message);
      // else toast.error(err.message.split('reason="')[1].split('",')[0]);
    }
  };

  const invest = async () => {
    console.log('invest');
    try {
      const [stake] = StakeHandle;
      const rest = await stake.invest(amount, pool);
      rest.wait().then(() => {
        setupdate((e) => e + 1);
        toast.success('Success Invest');
      });
    } catch (err) {
      if (err.data != undefined) toast.error(err.data.message);
      // else toast.error(err.message);
      else toast.error(err.message.split('reason="')[1].split('",')[0]);
    }
  };

  const unstake = async () => {
    console.log('unstake');
    try {
      const [stake] = StakeHandle;
      const rest = await stake.withdraw(pool);
      rest.wait().then(() => {
        setupdate((e) => e + 1);
        toast.success('Success Unstake');
      });
    } catch (err) {
      if (err.data != undefined) toast.error(err.data.message);
      // else toast.error(err.message);
      else toast.error(err.message.split('reason="')[1].split('",')[0]);
    }
  };

  const forceWithdraw = async () => {
    console.log('unstake');
    try {
      const [stake] = StakeHandle;
      const rest = await stake.forceWithdraw(pool);
      rest.wait().then(() => {
        setupdate((e) => e + 1);
        toast.success('Success Force Withdraw');
      });
    } catch (err) {
      if (err.data != undefined) toast.error(err.data.message);
      // else toast.error(err.message);
      else toast.error(err.message.split('reason="')[1].split('",')[0]);
    }
  };

  const claim = async () => {
    console.log('claim');
    try {
      const [stake] = StakeHandle;
      const rest = await stake.harvest(pool);
      rest.wait().then(() => {
        setupdate((e) => e + 1);
        toast.success('Success Claim');
      });
    } catch (err) {
      if (err.data != undefined) toast.error(err.data.message);
      // else toast.error(err.message);
      else toast.error(err.message.split('reason="')[1].split('",')[0]);
    }
  };
  const approve = async () => {
    try {
      let token;
      const [token_] = ximbia; //data.invest == 'XMB' ? ximbia : Biotic;
      token = token_;
      const rest = await token.approve(StakeHandle[0].address_);
      rest.wait().then(() => {
        setupdate((e) => e + 1);
        toast.success('Success Approve');
      });
    } catch (err) {
      if (err.data != undefined) toast.error(err.data.message);
      else toast.error(err.message);
    }
  };

  console.log('data', data.roiWithNFT);
  console.log('checkBox', checkBox);

  return (
    <div className="py-24 sm:py-12">
      <div className="relative mx-10vw">
        <div className="flex justify-center my-12">
          <img src="/logo.png" className="h-20 w-auto" />
        </div>
        <div className="relative mx-auto mb-24 grid max-w-7xl grid-cols-4 gap-x-4 md:grid-cols-8 lg:mb-48 lg:grid-cols-12 lg:gap-x-6">
          <div className="col-span-full">
            <div className="relative w-full">
              <div className="relative grid grid-cols-4 gap-x-4 gap-y-4 md:grid-cols-8 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-6">
                <div className="col-span-full lg:col-span-4">
                  <div className="relative flex h-32 w-full flex-col items-start rounded-lg bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 px-8 py-6 lg:px-4">
                    <div className="flex text-white">
                      <div className="mr-4 flex-shrink-0 self-center">
                        <img
                          src="/moneda_usdt.png"
                          className="h-20 w-20  p-3 "
                        />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold">
                          Total Value Locked
                        </h4>
                        <p className="mt-1 text-lg">
                          {allData.balance_}{' '}
                          <span className="text-slate-900">
                            ($ {totalStakedLockedUSD})
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-full lg:col-span-4">
                  <div className="relative flex h-32 w-full flex-col items-center rounded-lg  bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 px-8 py-6 lg:px-4">
                    <div className="text-center text-white">
                      <h4 className="text-lg font-bold uppercase">Daily Roí</h4>
                      <p className="mt-1 text-4xl">
                        {' '}
                        <span className="text-slate-900">{checkBox ? data.roiWithNFT : data.roiWithoutNFT}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-full lg:col-span-4">
                  <div className="relative flex h-32 w-full flex-col items-start rounded-lg  bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 px-8 py-6 lg:px-4">
                    <div className="flex text-white">
                      <div className="mr-4 flex-shrink-0 self-center">
                        <img src="/moneda_usdt_2.png" className="h-20 w-20 " />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold">
                          Total USDT Claimed
                        </h4>
                        <p className="mt-1 text-lg">
                          {allData.balance_}{' '}
                          <span className="text-slate-900">
                            ($ {totalethClaimedUSD})
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <InvestStake
                  data={data}
                  balanceOf={balanceOf}
                  setamount={setamount}
                  amount={amount}
                  invest={invest}
                  userTimeUnlock={userTimeUnlock}
                  approve={approve}
                  isApprove={isApprove}
                  unstake={unstake}
                  payBonus={payBonus}
                  setpool={setpool}
                  checkBox={checkBox}
                  setcheckBox={setcheckBox}
                />
                <div className="col-span-full lg:col-span-8">
                  <ClaimStake
                    data={data}
                    Earned={Earned}
                    reWardsUSD={reWardsUSD}
                    youStake={youStake}
                    youStakeUSD={youStakeUSD}
                    pendingRewards={pendingRewards}
                    pendingRewardsUSD={pendingRewardsUSD}
                    claim={claim}
                    userTimeUnlock={userTime}
                    stakingValue={stakingValue}
                    forceWithdraw={forceWithdraw}
                    poolMaster={pool}
                    checkBox={checkBox}
                    setcheckBox={setcheckBox}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stake;

const stakeType = [
  {
    id: 0,
    duration: 16,
    range: "10 to 99 USDT",
    roiWithoutNFT: "1%",
    roiWithNFT: "1.5%",
    nftValue: { type: "fixed", value: 5 }, 
    feeUSD: "10% claim and capital, reinvest",
    feeToken: "7% claim and capital, reinvest",
  },
  {
    id: 1,
    duration: 23,
    range: "100 to 499 USDT",
    roiWithoutNFT: "1.1%",
    roiWithNFT: "1.6%",
    nftValue: { type: "fixed", value: 30 }, 
    feeUSD: "13% claim and capital, reinvest",
    feeToken: "7% claim and capital, reinvest",
  },
  {
    id: 2,
    duration: 36,
    range: "500 to 999 USDT",
    roiWithoutNFT: "1.15%",
    roiWithNFT: "1.85%",
    nftValue: { type: "percentage", value: 15 },
    feeUSD: "15% claim and capital",
    feeToken: "8% claim and capital",
  },
  {
    id: 3,
    duration: 50,
    range: "1000 to 2499 USDT",
    roiWithoutNFT: "1.4%",
    roiWithNFT: "2.0%",
    nftValue: { type: "percentage", value: 20 }, 
    feeUSD: "15% claim and capital",
    feeToken: "8% claim and capital",
  },
  {
    id: 4,
    duration: 60,
    range: "2500 to 5999 USDT",
    roiWithoutNFT: "1.6%",
    roiWithNFT: "2.2%",
    nftValue: { type: "percentage", value: 22 }, 
    feeUSD: "16% claim and capital",
    feeToken: "9% claim and capital",
  },
  {
    id: 5,
    duration: 80,
    range: "6000 to 9999 USDT",
    roiWithoutNFT: "1.7%",
    roiWithNFT: "2.5%",
    nftValue: { type: "percentage", value: 30 }, 
    feeUSD: "25% claim and capital",
    feeToken: "12% claim and capital",
  },
  {
    id: 6,
    duration: 120,
    range: "10000 to 50000 USDT",
    roiWithoutNFT: "2.5%",
    roiWithNFT: "3.5%",
    nftValue: { type: "percentage", value: 40 },
    feeUSD: "33% claim and capital",
    feeToken: "25% claim and capital",
  }
];
