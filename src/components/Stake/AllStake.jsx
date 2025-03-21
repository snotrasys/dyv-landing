import React, { useContext, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';
import Link from 'next/link';
import ImgS3 from '@/components/ImgS3';
import Web3Context from '@/context/Web3Context';
import UseStake from '@/pages/stake/UseStake';

import { address } from '@/hooks/useContracts';
import { ethers } from 'ethers';
import { useToken } from '@/hooks/UseToken';
import { DateTime } from 'luxon';
import { UsePrice } from '../UsePrice';
import { check } from 'prettier';
import { toast } from 'react-hot-toast';

export default function AllStake({ feature, fullUrl, childSequential, pool }) {
  const { accounts, isLoaded } = useContext(Web3Context);
  const [totalStakedLocked, setTotalStakedLocked] = React.useState(200);
  const [totalStakedLockedUSD, setTotalStakedLockedUSD] = React.useState(0);

  const [totalethClaimed, setTotalethClaimed] = React.useState(200);
  const [totalethClaimedUSD, setTotalethClaimedUSD] = React.useState(0);
  const [isApprove, setisApprove] = useState(false);
  const [amount, setamount] = useState(0);
  const StakeHandle = UseStake(pool);
  const Biotic = useToken(address.Biotic);
  const ximbia = useToken(address.ximbia);
  const [pendingRewards, setpendingRewards] = useState(0);
  const [Earned, setEarned] = useState(0);
  const [balanceOf, setbalanceOf] = useState(0);
  const [youStake, setyouStake] = useState(0);
  const [update, setupdate] = useState(0);
  const [userTime, setUserTime] = useState(30);
  const [userTimeUnlock, setUserTimeUnlock] = useState(30);
  const ximbiaPrice = UsePrice(address.ximbia);
  const bioticPrice = UsePrice(address.Biotic);
  const [reWardsUSD, setreWardsUSD] = useState(0);
  const [youStakeUSD, setyouStakeUSD] = useState(0);
  const [pendingRewardsUSD, setpendingRewardsUSD] = useState(0);
  const [feePrecent, setfeePrecent] = useState(0);

  useEffect(() => {
    if (!isLoaded) return;
    calculateRewards();
    handle();
    userhandle();

    return () => {};
  }, [pool, isLoaded, accounts, update, totalStakedLocked, totalethClaimed]);

  const calculateRewards = async () => {
    try {
      const [stake] = StakeHandle;
      const user = await stake.users(pool + 1);
      // const data_ = await stake.dataStake(pool + 1);
      const price_ = feature.invest == 'XMB' ? ximbiaPrice : bioticPrice;
      const totalDeposit_ = user.userInfo_.totalDeposit;
      let youStakeUSD_ =
        parseFloat(ethers.utils.formatEther(totalDeposit_)) * price_.price;

      //   console.log(user, 'youStakeUSD_', pool + 1, feature.invest);
      setyouStakeUSD(youStakeUSD_.toFixed(2));

      if (feature.reward == 'BNB') {
        const pendingRewards_ = user.pendingRewards;
        let pendingRewardsUSD_ =
          parseFloat(ethers.utils.formatEther(pendingRewards_)) *
          price_.priceBnb;
        let totalWithdrawn = user.userInfo_.totalWithdrawn;
        let totalWithdrawnUSD_ =
          parseFloat(ethers.utils.formatEther(totalWithdrawn)) *
          price_.priceBnb;

        let totalethClaimedUSD_ = totalethClaimed * price_.priceBnb;

        setTotalethClaimedUSD(totalethClaimedUSD_.toFixed(2));
        setreWardsUSD(totalWithdrawnUSD_.toFixed(2));
        setpendingRewardsUSD(pendingRewardsUSD_.toFixed(2));
      } else {
        const pendingRewards_ = user.pendingRewards;
        let pendingRewardsUSD_ =
          parseFloat(ethers.utils.formatEther(pendingRewards_)) * price_.price;
        let totalWithdrawn = user.userInfo_.totalWithdrawn;
        let totalWithdrawnUSD_ = totalWithdrawn * price_.price;

        setreWardsUSD(totalWithdrawnUSD_.toFixed(2));
        setpendingRewardsUSD(pendingRewardsUSD_.toFixed(2));
      }
      let totalethClaimedUSD_ = parseFloat(totalethClaimed) * price_.price;
      let totalStakedLockedUSD_ = parseFloat(totalStakedLocked) * price_.price;
      setTotalStakedLockedUSD(totalStakedLockedUSD_.toFixed(2));
      setTotalethClaimedUSD(totalethClaimedUSD_.toFixed(2));
    } catch (error) {
      console.log('err calculateRewards', error, pool + 1);
    }
  };

  const handle = async () => {
    const [stake] = StakeHandle;
    const data_ = await stake.dataStake(pool + 1);
    const [token] = feature.invest == 'XMB' ? ximbia : Biotic;
    const balance = await token.balanceOf();

    let totalStakedLocked = await token.balanceOf(address.vaulStake);
    // totalStakedLocked = totalStakedLocked.add(
    //   await token.balanceOf(address.stake),
    // );
    setTotalethClaimed(
      parseFloat(ethers.utils.formatEther(data_.totalWithdrawn_)).toFixed(4),
    );
    setbalanceOf(parseFloat(ethers.utils.formatEther(balance)).toFixed(4));
    setTotalStakedLocked(
      parseFloat(ethers.utils.formatEther(totalStakedLocked)).toFixed(4),
    );

    // console.log(await stake.users(), 'users');
  };
  const userhandle = async () => {
    try {
      const [stake] = StakeHandle;
      const user = await stake.users(pool + 1);

      setpendingRewards(ethers.utils.formatEther(user.pendingRewards));
      setEarned(ethers.utils.formatEther(user.userInfo_.totalWithdrawn));
      setyouStake(ethers.utils.formatEther(user.userInfo_.totalDeposit));

      const time = DateTime.now();

      if (Number(user.userInfo_.nextWithdraw.toString()) != 0) {
        const nextTime = DateTime.fromSeconds(
          Number(user.userInfo_.nextWithdraw.toString()),
        );
        const diff = nextTime.diff(time, [
          'days',
          'hours',
          'minutes',
          'seconds',
        ]);
        const days = diff.days;
        const hours = diff.hours;
        const minutes = diff.minutes;
        const seconds = diff.seconds;
        const timeLeft = `${days}:${hours}:${minutes}:${seconds}`;
        setUserTime(timeLeft);
      }
      if (Number(user.userInfo_.unlockDate.toString()) != 0) {
        const nextTime = DateTime.fromSeconds(
          Number(user.userInfo_.unlockDate.toString()),
        );
        const diff = nextTime.diff(time, [
          'days',
          'hours',
          'minutes',
          'seconds',
        ]);
        const days = diff.days;
        const hours = diff.hours;
        const minutes = diff.minutes;
        const seconds = diff.seconds;
        const timeLeft = `${days} days  at ${hours}:${minutes}`;
        setUserTimeUnlock(timeLeft);
      }
    } catch (error) {
      console.log('err userhandle', error);
    }
  };

  return (
    <div className="card mb-4 flex flex-col rounded-md bg-[#12071f]  p-4 ">
      <motion.div variants={childSequential}>
        <div className=" ">
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-2 flex items-center space-x-3">
              <ImgS3
                src={feature.icon}
                className={clsx('h-12 w-12 rounded-full bg-black')}
                aria-hidden="true"
              />
              {pool === 6  && (
                <span className="inline-flex items-center gap-x-1.5 rounded-full bg-yellow-100 px-1.5 py-0.5 text-xs font-medium text-yellow-800">
                  <svg
                    className="h-1.5 w-1.5 fill-yellow-500"
                    viewBox="0 0 6 6"
                    aria-hidden="true"
                  >
                    <circle cx={3} cy={3} r={3} />
                  </svg>
                  New
                </span>
              )}

              <h3 className="text-xl font-semibold leading-6 text-gray-100">
                {feature.name}
              </h3>
            </div>
            <div className="ml-4 mt-6 flex-shrink-0 lg:mt-2">
              <div className="inline-block rounded-lg border border-purple-300 shadow-[0_5px_60px_-5px] shadow-purple-500 transition duration-300 hover:scale-105">
                <ButtonCheck
                  feature={feature}
                  fullUrl={fullUrl}
                  pool={pool}
                  StakeHandle={StakeHandle}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:mt-2">
          <div className="grid grid-cols-2 items-center gap-2 overflow-hidden">
            <div>
              <dt className="truncate text-xs font-medium text-gray-100">
                {feature.total_staked_name}
              </dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight text-gray-100">
                {totalStakedLockedUSD} $
              </dd>
            </div>
            <div>
              <dt className="truncate text-xs font-medium text-gray-100">
                {feature.your_staked_name}
              </dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight text-gray-100">
                {youStakeUSD}
              </dd>
            </div>
            <div>
              <dt className="truncate text-sm font-medium text-gray-100">
                {feature.deposit_fee_name}
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-100">
                {feature.deposit_fee_value} %
              </dd>
            </div>
            <div>
              <dt className="truncate text-sm font-medium text-gray-100">
                Roi Daily
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-100">
                {feature.apr_value} %
              </dd>
            </div>
          </div>
          <div>
            <ImgS3 className={clsx('h-full w-full ')} src={feature.image} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const ButtonCheck = ({ pool, feature, fullUrl, youStakeUSD, StakeHandle }) => {
  const [allowCard, setallowCard] = useState(true);

  useEffect(() => {
    check();

    return () => {};
  }, [youStakeUSD, StakeHandle]);

  const check = async () => {
    if (pool == 0 || pool == 1 || pool == 4) return;
    try {
      console.log('pool', pool);
      let stake = StakeHandle;
      if (stake == undefined) return;
      stake = stake[0];
      const user = await stake.users(pool - 1);
      console.log(
        user.userInfo_.totalDeposit.gte(ethers.utils.parseEther('500')),
      );
      setallowCard(
        user.userInfo_.totalDeposit.gte(ethers.utils.parseEther('500')),
      );
    } catch (error) {
      console.log('error', pool);
    }
  };

  const message = () => {
    let message =
      pool == 2
        ? 'You need to stake in XMB Earn XMB pool first'
        : 'You need to stake in BTIC Earn BTIC pool first';
    toast.error(message);
  };

  return (
    <>
      {allowCard ? (
        <Link href={`${feature.href}${fullUrl}`}>
          <button
            type="button"
            className="items-center rounded-md border-purple-500 bg-purple-500 px-7 py-4 text-lg font-semibold text-black transition-colors hover:bg-purple-300 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 active:ring-transparent  "
          >
            Xtake Now
          </button>
        </Link>
      ) : (
        <button
          type="button"
          className="items-center rounded-md border-purple-500 bg-purple-500 px-7 py-4 text-lg font-semibold text-black transition-colors hover:bg-purple-300 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 active:ring-transparent  "
          onClick={() => {
            message();
          }}
        >
          Xtake Now
        </button>
      )}
    </>
  );
};
