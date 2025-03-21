import React from 'react';
import clsx from 'clsx';
import ButtonPopover from '../ButtonPopover';
import Dropdown from '../../../components/Dropdown';
import Web3Context from '../../../context/Web3Context';
import { useEffect, useContext, useState, useRef } from 'react';
import {
  IBEP20,
  MasterChefV2,
  Vault,
  PancakeRouter,
  Pair,
} from '../../../hooks/abiHelpers';
import { constants, BigNumber, ethers, utils } from 'ethers';
import { motion } from 'framer-motion';
import ImgS3 from '@/components/ImgS3';
import { useMasterChef, useToken } from '@/hooks/useContracts';
import ApproveCardpool2 from './ApproveCardFarm2';
import { DateTime } from 'luxon';
import { UsePool } from './UsePool';
import { toast } from 'react-hot-toast';

const ApproveCardpool = ({ pool }) => {
  const Token = useToken(pool.address);
  const MasterChef = useMasterChef();
  const Todo = UsePool(pool);
  const { accounts, isLoaded, connect } = useContext(Web3Context);
  const [youStake, setyouStake] = useState(0);
  const [liquidity, setliquidity] = useState(0);
  const [canHarvest, setcanHarvest] = useState(false);
  const [canWithdraw, setcanWithdraw] = useState(false);
  const [aprView, setaprView] = useState('10000');
  const [update, setupdate] = useState(1);
  const [getPrice, setgetPrice] = useState(0);
  const [tokenPrice, settokenPrice] = useState(0);
  const [pendingview, setpendingview] = useState(0);
  const [youStakeView, setyouStakeView] = useState(0);
  const [decimal, setdecimal] = useState(18);
  
  const [totalLiquidity, settotalLiquidity] = useState(0);

  const ref = useRef(0);
  const [LOLLIPRICE, setLOLLIPRICE] = useState(
    BigNumber.from(ethers.utils.parseEther('0.005')),
  );


  useEffect(() => {
    const test = async () => {};
    if (isLoaded) test();

    return () => {};
  }, [getPrice]);

  useEffect(() => {
    const test = async () => {
      handle();
      apr();
    };
    if (isLoaded) test();
    return () => {};
  }, [isLoaded, accounts, update]);

  const handle = async () => {
    try {
      const [todo] = Todo;
      const {
        poolInfo_,
        canDepost,
        poolIsActive,
        returnPoolPerSecond,
        getTokenAddressBalance,
        liquidity,
      } = await todo.poolInfo();
      const { userInfo, canHarvest, pendingToken } = await todo.poolUSerInfo();

      settotalLiquidity(getTokenAddressBalance);
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
    } catch (error) {
      console.log(error);
    }
  };

  const apr = async () => {
    const [todo] = Todo;
    const apr_ = await todo.aprLP();
    setaprView(apr_);


  };

  return (
    <>
      {pool.name != undefined ? (
        <motion.div
          key={pool.id}
          className={clsx(
            'pt-8 sm:inline-block sm:w-full sm:px-4',
            pool.rainbow === true && 'shadowRainbo',
          )}
        >
          <div
            className={clsx(
              'overflow-hidden rounded-lg bg-gradient-to-t from-[#9900cb] via-[#6b01ad] to-[#480194] p-5 shadow-sm sm:p-4   ',
            )}
          >
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 ">
              <div>
                <ImgS3
                  src={pool.image || '/farm/ximbia-bnb.png'}
                  className="w-28"
                  alt="lolli"
                />
              </div>
              <div className="">
                {' '}
                <h1 className="text-md text-hero-gradient text-right font-bold lg:text-[24px] ">
                  {pool.name}
                </h1>
                <div className="mt-3 flex justify-end">
                  <span className="  inline-flex rounded-md shadow-sm">
                    <ButtonPopover />
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
              <div className="text-md font-semibold text-gray-100">APR</div>
              <div className="text-md flex justify-end space-x-2 font-semibold text-gray-100">
                <p>{aprView}%</p>{' '}
              </div>
            </div>
            {pool.bloqueo && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
                <div className="text-md font-semibold text-gray-100">Lock</div>
                <div className="text-md flex justify-end space-x-2 font-semibold text-gray-100">
                  <p>{pool.bloqueo} days</p>{' '}
                </div>
              </div>
            )}
            {pool.bonus && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
                <div className="text-md font-semibold text-gray-100">
                  BTIC bonus
                </div>
                <div className="text-md flex justify-end space-x-2 font-semibold text-gray-100">
                  <p>{pool.bonus} %</p>{' '}
                </div>
              </div>
            )}
            <div className="mt-2 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
              <div className="text-md font-semibold text-gray-100">Stake</div>
              <div className="text-md flex justify-end space-x-2 font-semibold text-gray-100">
                <p>{pool.name}</p>
              </div>
            </div>
            <div className="mt-3 flex justify-between">
              <div className="mt-1 flex space-x-2 ">
                <p className="text-sm font-semibold text-white">Biotic</p>
                <p className="text-sm font-semibold text-gray-100">Earned</p>
              </div>
              <p className="text-sm font-semibold text-white">
                Deposit Fee {pool.fee ? pool.fee : 0}%
              </p>
            </div>

            <ApproveCardpool2
              pool={pool}
              update={update}
              setupdate={setupdate}
              pendingview={pendingview}
              youStakeView={youStakeView}
              youStake={youStake}
              canHarvest={canHarvest}
              canWithdraw={canWithdraw}
            />
            <div className="lg:text-md mt-6 text-center text-sm font-bold leading-tight text-white">
              <h1>
                {' '}
                Total Liquidity:{'    '}
                {Number(
                  ethers.utils.formatUnits(totalLiquidity, decimal).toString(),
                ).toFixed(4)}{' '}
                {pool.name}
              </h1>
            </div>
          </div>
        </motion.div>
      ) : null}
    </>
  );
};
export default ApproveCardpool;
