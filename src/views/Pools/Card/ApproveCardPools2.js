import clsx from 'clsx';
import React from 'react';
import Dropdown from '../../../components/Dropdown';
import { useEffect, useContext, useState, useRef } from 'react';
import Web3Context from '../../../context/Web3Context';
import { constants, BigNumber, ethers } from 'ethers';

import ImgS3 from '@/components/ImgS3';
import refHandler from '@/hooks/utils';
import { useMasterChef, useToken } from '@/hooks/useContracts';
import { toast } from 'react-hot-toast';

const ApproveCardPools2 = ({
  pool,
  pendingview,
  youStakeView,
  canHarvest,
  canWithdraw,
  youStake,
}) => {
  const { accounts, isLoaded, setupdate, update } = useContext(Web3Context);
  const Token = useToken(pool.address);
  const MasterChef = useMasterChef();

  const [approve, setapprove] = useState(false);

  const [reward, setreward] = useState(0);
  const [symbol, setsymbol] = useState('');

  const [balanceOf, setbalanceOf] = useState(0);
  const [decimal, setdecimal] = useState(18);

  const ref = useRef(0);
  
  useEffect(() => {
    const test = async () => {
      // await allowanceHandle();
      // await balanceOfH();
    };
    if (isLoaded) test();
    return () => {};
  }, [isLoaded, accounts, update]);

  const balanceOfHandle = async () => {
    ref.current.value = Number(
      ethers.utils.formatUnits(balanceOf, decimal).toString(),
    ).toFixed(4);

    // depositHandle(true, balanceOf);
  };

  const allowanceHandle = async () => {
    try {
      const [load, iBEP20] = await Token;
      const allowance_ = await iBEP20.allowance(
        accounts,
        process.env.NEXT_PUBLIC_TOKEN_MASTER_CHEF_v2,
      );
      if (!allowance_.lt(constants.MaxUint256.div(5))) setapprove(true);
      return allowance_;
    } catch (error) {
      console.log(error);
    }
  };

  const approveHandle = async (e) => {
    
    e.preventDefault();
    const [load, iBEP20] = await Token;
    if (!load) return;
    try {
      const app = await iBEP20.approve(
        process.env.NEXT_PUBLIC_TOKEN_MASTER_CHEF_v2,
        constants.MaxUint256,
      );
      app.wait(1).then((result) => {
        toast.success('Approve Successfully');
        setapprove(true);
        setupdate(update + 1);
      });
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const balanceOfH = async () => {    
    try {
      const [load, iBEP20] = await Token;
      const balanceOf_ = await iBEP20.balanceOf(accounts);
      console.log(balanceOf_.toString(), 'balanceOf_');
      setbalanceOf(balanceOf_);
      return balanceOf_;
    } catch (error) {
      console.log(error);
    }
  };

  const harvestHandle = async (amount_) => {    
    if (!canHarvest)
      return toast.success('it is not yet time for the next harvest');
    let amount = amount_;

    try {
      const [load, contract] = await MasterChef;
      amount = ethers.utils.parseUnits(amount.toString(), decimal);
      const res = await contract.withdraw(pool.poolID, amount.toString());
      res.wait(1).then((result) => {
        if (amount_ != 0)
          toast.success('Withdraw Successfully');
        else toast.success('Harvest Successfully');
        setupdate(update + 1);
      });
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const withdrawHandle = async () => {    
    try {
      if (!canWithdraw)
        return toast.success('Insufficient balance for withdraw');

      await harvestHandle(youStake);
    } catch (error) {
      console.log(error);
    }
  };

  const depositHandle = async (type, value) => {
    
    try {
      // console.log('depositHandle', type, value, ref.current.value);
      let amount = 0//parseFloat(ref.current.value);
      if (amount <= 0) {
        toast.success('Please enter the amount');
        return;
      }

      const ref_ = refHandler();
      console.log(amount.toString(), 'amount.toString()');
      amount = ethers.utils.parseUnits(amount.toString(), decimal);
      const [load, contract] = await MasterChef;
// console.log(pool.poolID, amount.toString(), ref_);
//       return
      const res = await contract.deposit(pool.poolID, amount.toString(), ref_);
      res.wait(1).then((result) => {
        toast.success('Deposit Successfully');
        setupdate(update + 1);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {pool.name != undefined ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 ">
            <div>
              <h1 className="font-redthinker text-xl font-black uppercase text-purple-500 ">
                {pool.name} pool
              </h1>
              <ImgS3 src={pool.image} className="w-20" alt="lolli" />
            </div>
            <div>
              <div className="mt-4 grid gap-1">
                <button
                  onClick={() => harvestHandle(0)}
                  className={[
                    pool.tokenID == '0' ? 'hidden' : ' ',
                    ' rounded-full   px-3  py-2  text-center font-semibold text-white',
                    canHarvest ? 'bg-purple-500' : 'bg-purple-500',
                  ].join(' ')}
                >
                  {' '}
                  Harvest
                </button>
                <button
                  className={[
                    'mt-2 rounded-full   px-3  py-2  text-center font-semibold text-purple-600',
                    !canWithdraw ? 'bg-white' : 'bg-white',
                  ].join(' ')}
                  onClick={withdrawHandle}
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
          <div className="grid  hidden ">
            <div className="mt-2 flex space-x-2">
              <p className="text-3xl font-black text-gray-500 ">
                {parseInt(reward) / 2}
              </p>
              <p className="text-blue-secondary mt-3 text-sm font-semibold">
                ({symbol})
              </p>
            </div>
          </div>

          <div className="text-md mt-1 flex justify-between font-semibold text-blue-400">
            <p>BTIC earned </p>
            <p>Deposit Fee {pool.earned} %</p>
          </div>
          <div className="mt-5 flex flex-wrap justify-center space-y-3 sm:space-x-3 sm:space-y-0">
            {!approve ? (
              <button
                type="button"
                className=" inline-flex items-center rounded-full border border-transparent bg-[#008d60] px-8 py-2 text-base font-bold text-white shadow-sm  focus:outline-none focus:ring-2  focus:ring-offset-2"
                //onClick={allowanceHandle}
                onClick={approveHandle}
              >
                Approve contract
              </button>
            ) : (
              <>
                <input
                  type="number"
                  className="inline-flex w-full flex-shrink-0 items-center  justify-center rounded-full border border-transparent bg-[#12071f] px-5 py-2 text-sm font-bold text-white  placeholder-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:flex-1"
                  placeholder="Amount"
                  ref={ref}
                  min="0"
                  onChange={() => {
                    console.log(ref.current.value);
                    if (parseInt(ref.current.value) < 0) ref.current.value = 0;
                  }}
                />

                <button
                  type="button"
                  className="inline-flex items-center rounded-full border border-transparent bg-[#008d60] px-4 py-2 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                  onClick={depositHandle}
                >
                  Stake
                </button>
              </>
            )}
          </div>
        </>
      ) : null}
    </>
  );
};
export default ApproveCardPools2;
