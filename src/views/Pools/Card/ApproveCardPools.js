import clsx from 'clsx';
import React from 'react';
import { useEffect, useContext, useState, useRef } from 'react';
import Web3Context from '../../../context/Web3Context';
import {
  IBEP20,
  MasterChefV2,
  Vault,
  PancakeRouter,
} from '../../../hooks/abiHelpers';
import { constants, BigNumber, ethers } from 'ethers';
import { useToasts } from 'react-toast-notifications';
import ApproveCardPools2 from './ApproveCardPools2';
import { UsePool } from '@/views/Farms/Card/UsePool';
import { DateTime } from 'luxon';

const ApproveCardPools = ({ pool, pricesLolli }) => {
  const { accounts, isLoaded, setupdate, update } = useContext(Web3Context);
  const Todo = UsePool(pool);
  const [youStake, setyouStake] = useState(0);
  const [youStakeView, setyouStakeView] = useState(0);
  const [approve, setapprove] = useState(false);
  const [allowance, setallowance] = useState(0);
  const [pending, setpending] = useState(0);
  const [pendingview, setpendingview] = useState(0);
  const [liquidity, setliquidity] = useState(0);
  const [reward, setreward] = useState(0);
  const [symbol, setsymbol] = useState('');
  const [canDepost, setcanDepost] = useState(false);
  const [canHarvest, setcanHarvest] = useState(false);
  const [canWithdraw, setcanWithdraw] = useState(false);
  const [balanceOf, setbalanceOf] = useState(0);
  const [aprView, setaprView] = useState('100000');
  const [update_, setupdate_] = useState(1);
  const [tokenPrice, settokenPrice] = useState(0);
  const [getPrice, setgetPrice] = useState(0);
  const [decimal, setdecimal] = useState(18);
  const [LOLLIPRICE, setLOLLIPRICE] = useState(
    BigNumber.from(ethers.utils.parseEther('0.005')),
  );
  const address = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82';

  const ref = useRef(0);


  useEffect(() => {
    const test = async () => {
      await apr();
    };
    if (isLoaded) test();

    return () => {};
  }, [getPrice]);

  useEffect(() => {
    const test = async () => {      
      // await handle();
      
      await apr();
    };
    if (isLoaded) test();

    return () => {};
  }, [isLoaded, accounts, update_]);


  const handle = async () => {
    try {
      const [todo] = await Todo;      
      const {
        poolInfo_,
        canDepost,
        poolIsActive,
        returnPoolPerSecond,
        getTokenAddressBalance,
      } = await todo.poolInfo();
      const { userInfo, canHarvest, pendingToken } = await todo.poolUSerInfo();

      setcanHarvest(canHarvest);
      setcanWithdraw(
        parseInt(userInfo.unlockDate.toString()) < DateTime.now().toSeconds() &&
          canHarvest,
      );
      // canHarvest()
      setyouStake(userInfo.amount.toString());
      setyouStakeView(
        parseFloat(ethers.utils.formatEther(userInfo.amount)).toFixed(4),
      );
      setpendingview(
        parseFloat(ethers.utils.formatEther(pendingToken.toString())).toFixed(
          4,
        ),
      );      
      setliquidity(       getTokenAddressBalance)    } catch (error) {
      console.log(error);
    }
  };  

  const apr = async () => {
   const [todo] =  Todo;
   console.log("handle");
   const apr_ = await todo.aprLP();
    // setaprView(apr_);
  };
 

  return (
    <>
      {pool.name != undefined ? (
        <div className={clsx('', pool.rainbow === true && 'shadowRainbo')}>
          <div
            className={clsx(
              'overflow-hidden rounded-lg bg-gradient-to-t from-[#9900cb] via-[#6b01ad] to-[#480194] p-5  shadow-sm sm:p-4 lg:h-[490px] ',
            )}
          >
            <ApproveCardPools2 pool={pool} 
            update={update}
            setupdate={setupdate}
            pendingview={pendingview}
            youStakeView={youStakeView}
            youStake={youStake}
            canHarvest={canHarvest}
            canWithdraw={canWithdraw}
            />

            <div className="mt-4 grid grid-cols-2 px-2 text-gray-100 md:grid-cols-2 lg:grid-cols-2">
              <div className=" text-md font-semibold">APR:</div>
              <div className="text-md flex justify-end space-x-2 font-semibold ">
                <p>{aprView}%</p>
              </div>
            </div>
            {pool.bloqueo && (
              <div className="mt-2 grid grid-cols-2 px-2 text-gray-100 md:grid-cols-2 lg:grid-cols-2">
                <div className=" text-md font-semibold">Lock:</div>
                <div className="text-md flex justify-end space-x-2 font-semibold ">
                  <p>{pool.bloqueo} days</p>
                </div>
              </div>
            )}
            {pool.bonus && (
              <div className="mt-2 grid grid-cols-2 px-2 text-gray-100 md:grid-cols-2 lg:grid-cols-2">
                <div className=" text-md font-semibold">BTIC bonus:</div>
                <div className="text-md flex justify-end space-x-2 font-semibold ">
                  <p>{pool.bonus} %</p>
                </div>
              </div>
            )}

            <div className="mt-2 grid grid-cols-2 px-2 text-gray-100 md:grid-cols-2 lg:grid-cols-2">
              <p className=" text-md font-semibold">Your harvest:</p>
              <p className="text-md flex justify-end space-x-2 font-semibold ">
                {pendingview}
              </p>
            </div>
            <div className="mt-2 grid grid-cols-2 px-2 text-gray-100 md:grid-cols-2 lg:grid-cols-2">
              <p className="text-md font-semibold">Stake value:</p>
              <p className="text-md flex justify-end space-x-2 font-semibold ">
                {youStakeView} {symbol}
              </p>
            </div>
            <div className="mt-5 flex flex-wrap space-y-3 sm:space-x-3 sm:space-y-0">
              <div className="inline-flex w-full flex-shrink-0 items-center justify-center rounded-full border border border-pink-400 py-2 text-sm font-medium  text-pink-500 shadow-sm sm:flex-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Core
              </div>
            </div>
            <div className="lg:text-md mt-6 text-center text-sm font-bold leading-tight text-white">
              <h1>
                {' '}
                Total Liquidity:{'    '}
                {Number(
                  ethers.utils.formatUnits(liquidity, decimal).toString(),
                ).toFixed(4)}{' '}
                {pool.name}
              </h1>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
export default ApproveCardPools;
