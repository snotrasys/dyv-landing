import React from 'react';
import Web3Context from '../../../context/Web3Context';
import { useEffect, useContext, useState, useRef } from 'react';

import { constants, BigNumber, ethers } from 'ethers';
import { useMasterChef, } from '@/hooks/useContracts';
import { useToken } from '@/hooks/UseToken';

import refHandler from '@/hooks/utils';
import { toast } from 'react-hot-toast';

const ApproveCardpool2 = ({
  pool,
  pendingview,
  youStakeView,
  canHarvest,
  canWithdraw,
  youStake,
}) => {
  const Token = useToken(pool.address);
  const MasterChef = useMasterChef();
  const { accounts, isLoaded } = useContext(Web3Context);
  const [approve, setapprove] = useState(false);

  const [balanceOf, setbalanceOf] = useState(0);
  const [update, setupdate] = useState(1);  

  const [decimal, setdecimal] = useState(18);
  const ref = useRef(0);  
  useEffect(() => {
    const test = async () => {
      await allowanceHandle();
      await balanceOfH();
    };
    if (isLoaded) test();
    return () => {};
  }, [isLoaded, accounts, update]);

  const balanceOfHandle = async () => {
    ref.current.value = Number(
      ethers.utils.formatUnits(balanceOf, decimal).toString(),
    )

    // depositHandle(true, balanceOf);
  };

  const allowanceHandle = async () => {
    try {
      const [iBEP20] =  Token;
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
    const [iBEP20] =  Token;    
    try {
      const app = await iBEP20.approve(
        process.env.NEXT_PUBLIC_TOKEN_MASTER_CHEF_v2,        
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
      const [iBEP20] =  Token;
      const balanceOf_ = await iBEP20.balanceOf();
      console.log(balanceOf_.toString(), 'balanceOf_');
      setbalanceOf(balanceOf_);
      return balanceOf_;
    } catch (error) {
      console.log(error);
    }
  };

  const harvestHandle = async (amount_) => {    
    if (!canHarvest)
      return toast.error('it is not yet time for the next harvest');
    const amount = amount_;

    try {
      const [load, contract] = await MasterChef;

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
      let amount =0//parseFloat(ref.current.value)
      if (amount <= 0) {
        toast.success('Please enter the amount');
        return;
      }

      const ref_ = refHandler();
      amount = ethers.utils.parseUnits(amount.toString(), decimal);
      console.log(amount);
      // return
      const [load, contract] = await MasterChef;
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
          <div className="mt-2 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
            <div className="text-md px-3 py-2 font-semibold text-gray-100">
              {pendingview}
            </div>
            <div className=" hiddtext-gray-500 text-md flex justify-end space-x-2 font-semibold">
              <button
                type=" button"
                className={[
                  'rounded-full bg-purple-500 px-8 py-3 text-sm text-white transition-all duration-150 ease-in-out ',
                  canHarvest ? 'bg-blue-secondary' : 'bg-gray-200',
                ].join(' ')}
                onClick={() => harvestHandle(0)}
              >
                Harvest
              </button>{' '}
            </div>
          </div>

          <div className="text-md mt-2 flex w-full font-semibold text-gray-500">
            <button
              type="button"
              className={[
                'w-full rounded-md bg-[#de30b1] px-8 py-3 text-sm text-white transition-all duration-150 ease-in-out ',
                canWithdraw && parseFloat(youStakeView) > 0
                  ? 'bg-red-500'
                  : 'bg-gray-200',
              ].join(' ')}
              onClick={() => withdrawHandle()}
            >
              Withdraw
            </button>{' '}
          </div>

          <div className="mt-3">
            <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="ml-4 mt-2">
                <h3 className="text-base font-semibold leading-6 text-gray-100">
                  {pool.name} LP
                </h3>
              </div>
              <div className="ml-4 mt-2 flex-shrink-0">
                <button
                  type="button"
                  className="relative inline-flex items-center rounded-md bg-purple-700 px-3 py-2 text-sm font-semibold text-white shadow-sm "
                >
                  STAKED: {youStakeView}
                </button>
              </div>
            </div>
          </div>

          {approve ? (
            <div>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-1 lg:grid-cols-1">
                <div className="relative mt-2 flex items-center">
                  <input
                    placeholder="Amount"
                    ref={ref}
                    min="0"
                    type="number"
                    onChange={() => {
                      console.log(ref.current.value);
                      if (parseInt(ref.current.value) < 0)
                        ref.current.value = 0;
                    }}
                    className="block w-full rounded-md border-0 bg-[#12071f] py-3 pl-4 pr-14 text-gray-100 shadow-sm ring-1 ring-inset ring-purple-600 placeholder:text-gray-200 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
                  />
                  <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                    <button
                      type="button"
                      className="text-md rounded-full bg-purple-700 px-5 text-sm text-white transition-all duration-150 ease-in-out hover:bg-purple-800"
                      onClick={balanceOfHandle}
                    >
                      Max
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-md flex justify-end space-x-2 font-semibold text-gray-500">
                <button
                  type="button"
                  className="text-md my-2 w-full rounded-md bg-[#008d60] py-3 text-sm text-white transition-all duration-150 ease-in-out "
                  onClick={depositHandle}
                >
                  Stake
                </button>{' '}
              </div>
            </div>
          ) : (
            <div className="mt-4  w-full justify-center justify-items-center text-center ">
              <button
                type="button"
                className="w-full
            items-center rounded-md border border-transparent bg-[#008d60] px-8 py-2 text-base font-bold text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                onClick={approveHandle}
              >
                Approve
              </button>
            </div>
          )}
        </>
      ) : null}
    </>
  );
};
export default ApproveCardpool2;
