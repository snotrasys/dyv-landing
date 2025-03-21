import React, { useEffect, useState } from 'react';
import ImgS3 from '../ImgS3';
import { useCountdownV2 } from '@/hooks/useCountdown';
import clsx from 'clsx';
import TonkenContext from '@/context/TokenHandle';
import Web3Context from '@/context/Web3Context';

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
  const { accounts, isLoaded, connect } = useContext(Web3Context);
  const {userData,
    allData,
    // invest,
    withdraw,
    reinvestment,    
    balanceOf,    
    } = useContext(TonkenContext)

  const [valueInvest, setvalueInvest] = useState(0);

  const handle = async () => {
    
    setDate(userData.timeLock_);
  };

  useEffect(() => {
    
    if(!isLoaded) return;
    console.log(userData,"userData lock");
    // handle();

    return () => {};
  }, [userData,isLoaded]);


  
  return (
    <div className="col-span-full lg:col-span-8">
      <div className="relative flex h-full w-full flex-col  rounded-lg bg-[#3F008E] px-8 py-12 lg:px-12">
        <div className="text-primar mb-8 flex justify-center">
          <ImgS3
            src={biotic ? `/moneda-biotic.png` : data.imgLogo}
            className="h-40 w-40"
          />
        </div>
        {stakingValue1 && (
          <div className=" mb-4 rounded-lg bg-[#7d21ff] px-4 py-2 text-gray-100 sm:px-6">
            <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="ml-4 mt-2">
                <h3 className="text-base font-semibold leading-6 ">
                  Staking Value:
                </h3>
              </div>
              <div className="ml-4 mt-2 flex-shrink-0">
                <div className="flex items-center space-x-1">
                  <p>
                    {stakingValue1} {biotic ? `BTIC` : data.reward} (
                    {Number(stakingValue1USD).toFixed(4)} USD)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {investment ? (
          <div className=" mb-4 rounded-lg bg-[#7d21ff] px-4 py-2 text-gray-100 sm:px-6">
            <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="ml-4 mt-2">
                <h3 className="text-base font-semibold leading-6 ">
                  STAKED LP:
                </h3>
              </div>
              <div className="ml-4 mt-2 flex-shrink-0">
                <div className="flex items-center space-x-1">
                  <p>
                    {investment} {biotic ? `BTIC` : data.reward} (
                    {Number(investmentUSD).toFixed(4)} USD)
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={clsx(
              '',
              'fmb-4 rounded-lg bg-[#7d21ff] px-4 py-2 text-gray-100 sm:px-6',
              biotic ? 'hidden' : '',
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
                  <p>
                    {stakingValue} {biotic ? `BTIC` : data.reward}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {earnedXMB !== true && (
          <div className=" rounded-lg bg-[#7d21ff] px-4 py-2 text-gray-100 sm:px-6">
            <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="ml-4 mt-2">
                <h3 className="text-base font-semibold leading-6 ">
                  Earned ${biotic ? `BTIC` : data.reward}
                </h3>
              </div>
              <div className="ml-4 mt-2 flex-shrink-0">
                <div className="flex items-center space-x-1">
                  <ImgS3
                    src={biotic ? `/moneda-biotic.png` : data.imgMoney}
                    className="h-6 w-6 rounded-full bg-black "
                  />
                  <p>
                    {Number(Earned).toFixed(4)} {biotic ? `BTIC` : data.reward}(
                    {parseFloat(reWardsUSD)} USD)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {!investment && (
          <div className=" mt-4 rounded-lg bg-[#7d21ff] px-4 py-2 text-gray-100 sm:px-6">
            <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="ml-4 mt-2">
                <h3 className="text-base font-semibold leading-6 ">
                  Xtaked ${biotic ? `BTIC` : data.invest}
                </h3>
              </div>
              <div className="ml-4 mt-2 flex-shrink-0">
                <div className="flex items-center space-x-1">
                  <ImgS3
                    src={biotic ? `/moneda-biotic.png` : data.imgLogo}
                    className="h-6 w-6 rounded-full bg-black p-1"
                  />
                  <p>
                    {Number(youStake).toFixed(2)}{' '}
                    {biotic ? `BTIC` : data.invest}({youStakeUSD} USD)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="mt-5  text-xs text-white">
          Distribution date: {timeShow}
        </p>

        <div className=" mt-4 rounded-lg bg-[#7d21ff] px-4 py-2 text-gray-100 sm:px-6">
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <h3 className="text-base font-semibold leading-6 ">
                Pending {biotic ? `BTIC` : 'XMB'}
              </h3>
            </div>
            <div className="ml-4 mt-2 flex-shrink-0">
              <div className="flex items-center space-x-1">
                <ImgS3
                  src={data.imgMoney}
                  className="h-6 w-6 rounded-full bg-black"
                />
                <p>
                  {Number(pendingRewards).toFixed(4)}{' '}
                  {biotic ? `BTIC` : data.reward}({pendingRewardsUSD} USD)
                </p>
              </div>
            </div>
          </div>
        </div>
        {data.reward == 'BNB' && (
          <>
            <button
              onClick={() => claim()}
              className={clsx(
                'focus:shadow-outline-orange mt-3 block w-full transform rounded-lg border border-transparent bg-[#9900cd] px-6  py-3 text-center text-base font-semibold leading-6 text-white  hover:scale-105 focus:border-purple-600 focus:outline-none sm:text-lg',
              )}
            >
              CLAIM
            </button>
          </>
        )}
        <button
          onClick={() => claim()}
          className={clsx(
            'focus:shadow-outline-orange mt-3 block w-full transform rounded-lg border border-transparent bg-[#9900cd] px-6  py-3 text-center text-base font-semibold leading-6 text-white  hover:scale-105 focus:border-purple-600 focus:outline-none sm:text-lg',
          )}
        >
          CLAIM
        </button>
        <button
          onClick={() => forceWithdraw()}
          className={clsx(
            '',
            'focus:shadow-outline-orange mt-3 block w-full transform rounded-lg border border-transparent bg-[#9900cd] px-6  py-3 text-center text-base font-semibold leading-6 text-white  hover:scale-105 focus:border-purple-600 focus:outline-none sm:text-lg',
          )}
        >
          FORCE WITHDRAW
        </button>
      </div>
    </div>
  );
}
