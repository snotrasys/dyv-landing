import React, { useContext, useEffect, useState } from 'react';
import ImgS3 from '../ImgS3';
import { useCountdownV2 } from '@/hooks/useCountdown';
import clsx from 'clsx';
import TonkenContext from '@/context/TokenHandle';
import Web3Context from '@/context/Web3Context';
import CardRef from '@/views/CardRef';

export default function ClaimStake({
  data,
  Earned,
  reWardsUSD,
  youStake,
  youStakeUSD,
  pendingRewards,
  pendingRewardsUSD,
  claim,
  userTimeUnlock,
  stakingValue,
  stakingValue1,
  stakingValue1USD,
  investmentUSD,
  investment,
  earnedXMB,
  forceWithdraw,
  biotic = false,
  poolMaster
}) {
  const {
    timerDays,
    timerHours,
    timerMinutes,
    timerSeconds,
    setDate,
    timeShow,
    isNotActive,
  } = useCountdownV2();
  const {userData,
    allData,
    // invest,
    withdraw,
    reinvestment,    
    harvest,
    // balanceOf,    
    } = useContext(TonkenContext)
  const [valueInvest, setvalueInvest] = useState(0);
  const { accounts, isLoaded, connect } = useContext(Web3Context);
  const handle = async () => {
    
    setDate(Number(userData.time_));
  };

  useEffect(() => {
    
    if(!isLoaded) return;
    console.log(userData,"userData lock");
    handle();

    return () => {};
  }, [userData,isLoaded]);
  return (
    <div className="col-span-full lg:col-span-8">
      <div
        style={{ backgroundImage: `url(/bg-2.png)` }}
        className="relative flex h-full w-full flex-col bg-cover bg-center   rounded-lg bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 px-8 py-12 lg:px-12"
      >
        <div className="text-primar mb-8 flex justify-center">
          <img src={`/dibujo.png`} className="h-60 w-auto" />
        </div>

        <div
          className={clsx(
            '',
            'fmb-4 mb-3 rounded-lg bg-black px-4 py-2 text-gray-100 sm:px-6',
          
          )}
        >
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <h3 className="text-base font-semibold leading-6 ">
                Value of your investment:
              </h3>
            </div>
            <div className="ml-4 mt-2 flex-shrink-0">
              <div className="flex items-center space-x-1">
                <p>{userData.totalDeposits_} USDT</p>
              </div>
            </div>
          </div>
        </div>

        {earnedXMB !== true && (
          <div className="hidden rounded-lg bg-black px-4 py-2 text-gray-100 sm:px-6">
            <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="ml-4 mt-2">
                <h3 className="text-base font-semibold leading-6 ">
                  Earned 
                </h3>
              </div>
              <div className="ml-4 mt-2 flex-shrink-0">
                <div className="flex items-center space-x-1">
                  <img
                    src={`/usdt.png`}
                    className="h-6 w-6 rounded-full bg-black "
                  />
                  <p>
                    {userData.totalEarnings_} USDT
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {!investment && (
          <div className=" mt-4 rounded-lg bg-black px-4 py-2 text-gray-100 sm:px-6">
            <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="ml-4 mt-2">
                <h3 className="text-base font-semibold leading-6 ">
                  Staked 
                </h3>
              </div>
              <div className="ml-4 mt-2 flex-shrink-0">
                <div className="flex items-center space-x-1">
                  <img
               src={`/usdt.png`}
                    className="h-6 w-6 rounded-full bg-black "
                  />
                  <p>
                    {Number(youStake).toFixed(2)} USDT
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}


        <p className="mt-5  text-xs text-white">
          Distribution date: {timeShow}
        </p>

        <div className=" mt-4 rounded-lg bg-black px-4 py-2 text-gray-100 sm:px-6">
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <h3 className="text-base font-semibold leading-6 ">
                Pending USDT
              </h3>
            </div>
            <div className="ml-4 mt-2 flex-shrink-0">
              <div className="flex items-center space-x-1">
                <img
               src={`/usdt.png`}
                  className="h-6 w-6 rounded-full bg-black"
                />
                <p>
                  {userData.balance_} USDT
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() =>     harvest(poolMaster,false)}
          className={clsx(
            'focus:shadow-outline-orange mt-3 block w-full transform rounded-lg border border-transparent bg-red-700 px-6  py-3 text-center text-base font-semibold leading-6 text-white  hover:scale-105 focus:border-purple-600 focus:outline-none sm:text-lg',
          )}
        >
          CLAIM USDT
        </button>
        <button
          onClick={() =>     harvest(poolMaster,true)}
          className={clsx(
            'hidden focus:shadow-outline-orange mt-3 block w-full transform rounded-lg border border-transparent bg-red-700 px-6  py-3 text-center text-base font-semibold leading-6 text-white  hover:scale-105 focus:border-purple-600 focus:outline-none sm:text-lg',
          )}
        >
          CLAIM TIAFI
        </button>
        {/*
               <button
          onClick={() => forceWithdraw()}
          className={clsx(
            '',
            'focus:shadow-outline-orange mt-3 block w-full transform rounded-lg border border-transparent bg-[#9900cd] px-6  py-3 text-center text-base font-semibold leading-6 text-white  hover:scale-105 focus:border-purple-600 focus:outline-none sm:text-lg',
          )}
        >
          FORCE WITHDRAW
        </button>
        */}
      </div>
      <div className='mt-3 flex-col bg-cover bg-center   rounded-lg bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400'>
      <CardRef />
      </div>
    </div>
  );
}
