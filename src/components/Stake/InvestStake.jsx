import React, { useContext, useEffect } from 'react';
import ImgS3 from '../ImgS3';
import { useCountdownV2 } from '@/hooks/useCountdown';
import Web3Context from '@/context/Web3Context';
import TonkenContext from '@/context/TokenHandle';

export default function InvestStake({
  data,
  balanceOf,
  setamount,
  invest,
  userTimeUnlock,
  approve,
  isApprove,
  unstake,
  timeShowStake,
  biotic = false,
}) {
  const {
    timerDays,
    timerHours,
    timerMinutes,
    timerSeconds,
    setDate,
    timeShow,
  } = useCountdownV2();
  const { accounts, isLoaded, connect } = useContext(Web3Context);
  const {userData,
    allData,
    // invest,
    withdraw,
    reinvestment,    
    balanceOf,    
    } = useContext(TonkenContext)

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
    <>
      <div className="col-span-full lg:col-span-4">
        <div className="relative flex h-full w-full flex-col rounded-lg bg-[#3F008E] px-8 py-12 lg:px-12">
          <div className="mb-8 flex items-center justify-center">
            <ImgS3
              src={biotic ? `/moneda-biotic.png` : data.imgMoney}
              className="h-40 w-40"
            />
          </div>
          <div className=" rounded-lg bg-[#7d21ff] px-4 py-2 text-gray-100 sm:px-6">
            <div className="">
              <div className="ml-4 mt-2">
                <h3 className="text-base font-semibold leading-6 ">
                  ${biotic ? 'BTIC' : data.invest} Balance
                </h3>
              </div>
              <div className="ml-4 mt-2 flex-shrink-0">
                <div className="flex items-center space-x-1">
                  <ImgS3
                    src={biotic ? `/moneda-biotic.png` : data.imgLogo}
                    className="h-6 w-6 rounded-full bg-black p-1 "
                  />
                  <p>
                    {balanceOf} {biotic ? `BTIC` : data.invest}{' '}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            {biotic && (
              <>
                <div className="mt-2">
                  <input
                    type="number"
                    name="stake"
                    id="stake"
                    onChange={(e) => setamount(e.target.value)}
                    className="block w-full rounded-md border-0 bg-[#7d21ff] py-3 text-lg text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
                    placeholder="0.0"
                  />
                </div>
              </>
            )}
          </div>
          {isApprove ? (
            <>
              {biotic && (
                <>
                  <button
                    onClick={() => invest()}
                    className="focus:shadow-outline-orange mt-2 block w-full transform rounded-lg border border-transparent bg-[#9900cd] px-6  py-3 text-center text-base font-semibold leading-6 text-white transition-all duration-150 ease-in-out hover:scale-105 focus:border-purple-600 focus:outline-none sm:text-lg"
                  >
                    XSTAKE
                  </button>
                  <button
                    onClick={() => unstake()}
                    className=" focus:shadow-outline-orange mt-2 block w-full transform rounded-lg border border-transparent bg-[#9900cd] px-6  py-3 text-center text-base font-semibold leading-6 text-white transition-all duration-150 ease-in-out hover:scale-105 focus:border-purple-600 focus:outline-none sm:text-lg"
                  >
                    UNXSTAKE
                  </button>
                </>
              )}
            </>
          ) : (
            <button
              onClick={() => approve()}
              className="focus:shadow-outline-orange mt-2 block w-full transform rounded-lg border border-transparent bg-[#9900cd] px-6  py-3 text-center text-base font-semibold leading-6 text-white transition-all duration-150 ease-in-out hover:scale-105 focus:border-purple-600 focus:outline-none sm:text-lg"
            >
              Approve
            </button>
          )}
          {timeShowStake !== true && (
            <p className="mt-1 text-center text-xs text-white">
              There is a {timeShow} deposit lock
            </p>
          )}
        </div>
      </div>
    </>
  );
}
