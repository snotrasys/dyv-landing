import ImgS3 from '@/components/ImgS3';
import { Layout } from '@/components/app/Layout';
import Web3Context from '@/context/Web3Context';
import { useToken } from '@/hooks/UseToken';
import { address } from '@/hooks/useContracts';
import UseStake from '@/pages/stake/UseStake';
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
import { UsePrice } from '../UsePrice';
import { useCountdownV2 } from '@/hooks/useCountdown';
import InvestStake from './InvestStake';
import ClaimStake from './ClaimStake';
import UseStakePlus from '@/pages/stake/UseStakePlus';

function StakePlus({ pool }) {
  const [data, setdata] = useState({
    name: 'BTIC',
    invest: 'BTIC',
    reward: 'BTIC',
    imgMoney: '/moneda-biotic.png',
    imgLogo: '/xmb-icon.png',
  });

  const [totalStakedLocked, setTotalStakedLocked] = React.useState(200);
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
  const [balanceOf, setbalanceOf] = useState(0);
  const [youStake, setyouStake] = useState(0);
  const [update, setupdate] = useState(0);
  const [userTime, setUserTime] = useState(30);
  const [userTimeUnlock, setUserTimeUnlock] = useState(0);
  const ximbiaPrice = UsePrice(address.ximbia);
  const bioticPrice = UsePrice(address.Biotic);
  const [reWardsUSD, setreWardsUSD] = useState(0);
  const [youStakeUSD, setyouStakeUSD] = useState(0);
  const [pendingRewardsUSD, setpendingRewardsUSD] = useState(0);

  useEffect(() => {
    if (!isLoaded) return;
    setdata(stakeType[pool]);
    handle();
    userhandle();
    allowance();

    return () => {};
  }, [
    pool,
    isLoaded,
    accounts,
    update,
    data,
    totalStakedLocked,
    totalethClaimed,
  ]);

  useEffect(() => {
    if (!isLoaded) return;
    calculateRewards();

    return () => {};
  }, [isLoaded, data, totalStakedLocked, totalethClaimed]);

  const calculateRewards = async () => {
    try {
      const [stake] = StakeHandle;
      const user = await stake.users(pool + 1);
      // const data_ = await stake.dataStake(pool + 1);
      const price_ = data.invest == 'XMB' ? ximbiaPrice : bioticPrice;
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
        let totalInvestBNB = user.userInfo_.stakingValue
        setStakingValue(parseFloat(ethers.utils.formatEther(totalInvestBNB)).toFixed(2))
        let totalWithdrawnUSD_ = parseFloat(ethers.utils.formatEther(totalWithdrawn)) * price_.priceBnb;
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
        let totalWithdrawnUSD_ = parseFloat(ethers.utils.formatEther(totalWithdrawn)) * price_.price;
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

  const handle = async () => {
    const [stake] = StakeHandle;
    const data_ = await stake.dataStake(pool + 1);
    const [token] = data.invest == 'XMB' ? ximbia : Biotic;
    const balance = await token.balanceOf();

    let totalStakedLocked = await token.balanceOf("0xF16aee070D212cf11b1BCC852C1852DF3Ffe497a");
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
      setyouStake(ethers.utils.formatEther(user.userInfo_.investment));

      if (Number(user.userInfo_.nextWithdraw.toString()) != 0) {
        setUserTimeUnlock(Number(user.userInfo_.unlockDate.toString()));
        setUserTime(Number(user.userInfo_.nextWithdraw.toString()));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const invest = async () => {
    console.log('invest');
    try {
      const [stake] = StakeHandle;
      const rest = await stake.invest(amount, pool + 1);
      rest.wait().then(() => {
        setupdate((e) => e + 1);
        toast.success('Success Invest');
      });
    } catch (err) {  
      if (err.data != undefined) toast.error(err.data.message);
      // else toast.error(err.message);
      else toast.error(err.message.split("reason=\"")[1].split("\",")[0])
    }
  };

  const unstake = async () => {
    console.log('unstake');
    try {
      const [stake] = StakeHandle;
      const rest = await stake.withdraw(pool + 1);
      rest.wait().then(() => {
        setupdate((e) => e + 1);
        toast.success('Success Unstake');
      });
    } catch (err) {
      if (err.data != undefined) toast.error(err.data.message);
      // else toast.error(err.message);
      else toast.error(err.message.split("reason=\"")[1].split("\",")[0])
    }
  };

  const forceWithdraw = async () => {
    console.log('unstake');
    try {
      const [stake] = StakeHandle;
      const rest = await stake.forceWithdraw(pool + 1);
      rest.wait().then(() => {
        setupdate((e) => e + 1);
        toast.success('Success Force Withdraw');
      });
    } catch (err) {
      if (err.data != undefined) toast.error(err.data.message);
      // else toast.error(err.message);
      else toast.error(err.message.split("reason=\"")[1].split("\",")[0])
    }
  };

  
  const claim = async () => {
    console.log('claim');
    try {
      const [stake] = StakeHandle;
      const rest = await stake.harvest(pool + 1);
      rest.wait().then(() => {
        setupdate((e) => e + 1);
        toast.success('Success Claim');
      });
    } catch (err) {
      if (err.data != undefined) toast.error(err.data.message);
      // else toast.error(err.message);
      else toast.error(err.message.split("reason=\"")[1].split("\",")[0])
    }
  };
  const approve = async () => {
    try {
      let token;
      const [token_] = data.invest == 'XMB' ? ximbia : Biotic;
      token = token_;
      const [stake] = StakeHandle;
      // console.log(data.invest == 'XMB');
      // return
      console.log(token);
      const rest = await token.approve(stake.address_);
      rest.wait().then(() => {
        setupdate((e) => e + 1);
        toast.success('Success Approve');
      });
    } catch (err) {
      if (err.data != undefined) toast.error(err.data.message);
      else toast.error(err.message);
    }
  };
  const allowance = async () => {
    try {
      let token;
      const [token_] = data.invest == 'XMB' ? ximbia : Biotic;
      const [stake] = StakeHandle;


      
      // console.log(data);
      // console.log(data.invest == 'XMB', 'data.invest == XMB');
      token = token_;
      const allowance = await token.allowanceHandle(stake.address_);

      setisApprove(allowance);
    } catch (err) {
      if (err.data != undefined) toast.error(err.data.message);
      else toast.error(err.message);
    }
  };

  return (
    <div className="py-24 sm:py-32">
      <div className="relative mx-10vw">
        <div className="relative mx-auto mb-24 grid max-w-7xl grid-cols-4 gap-x-4 md:grid-cols-8 lg:mb-48 lg:grid-cols-12 lg:gap-x-6">
          <div className="col-span-full">
            <h2 className="mb-6 flex  items-center font-redthinker text-3xl leading-tight text-primary md:text-5xl lg:mt-6">
              <Link href="/stake">
                <ArrowLeftIcon className="mr-4 h-6 w-6 text-white" />
              </Link>
              EARN BTIC
            </h2>
          </div>
          <div className="col-span-full">
            <div className="relative w-full">
              <div className="relative grid grid-cols-4 gap-x-4 gap-y-4 md:grid-cols-8 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-6">
                <div className="col-span-full lg:col-span-4">
                  <div className="relative flex h-32 w-full flex-col items-start rounded-lg bg-[#3F008E] px-8 py-6 lg:px-4">
                    <div className="flex text-white">
                      <div className="mr-4 flex-shrink-0 self-center">
                        <ImgS3
                          src={`/moneda-biotic.png`}
                          className="h-16 w-16 rounded-full bg-black p-3 "
                        />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold">
                          Total Value Locked
                        </h4>
                        <p className="mt-1 text-lg">
                          {totalStakedLocked}{' '}
                          <span className="text-primary">
                            ($ {totalStakedLockedUSD})
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-full lg:col-span-4">
                  <div className="relative flex h-32 w-full flex-col items-center rounded-lg bg-[#3F008E] px-8 py-6 lg:px-4">
                    <div className="text-center text-white">
                      <h4 className="text-lg font-bold uppercase">Roi Daily</h4>
                      <p className="mt-1 text-4xl">
                        {' '}
                        <span className="text-primary"> 0.16%</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-full lg:col-span-4">
                  <div className="relative flex h-32 w-full flex-col items-start rounded-lg bg-[#3F008E] px-8 py-6 lg:px-4">
                    <div className="flex text-white">
                      <div className="mr-4 flex-shrink-0 self-center">
                        <ImgS3
                          src={`/moneda-biotic.png`}
                          className="h-16 w-16 rounded-full bg-black "
                        />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold">
                          Total BTIC Claimed
                        </h4>
                        <p className="mt-1 text-lg">
                          {totalethClaimed}{' '}
                          <span className="text-primary">
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
                  invest={invest}
                  userTimeUnlock={userTimeUnlock}
                  approve={approve}
                  isApprove={isApprove}
                  unstake={unstake}
                  biotic={true}
                />
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
                  biotic={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StakePlus;

const stakeType = [
  {
    name: 'BTIC',
    invest: 'BTIC',
    reward: 'BTIC',
    imgMoney: '/moneda-biotic.png',
    imgLogo: '/pool/biotic.png',
    roi: '1',
  },
  {
    name: 'BTIC',
    invest: 'BTIC',
    reward: 'BTIC',
    imgMoney: '/moneda-biotic.png',
    imgLogo: '/pool/biotic.png',
    roi: '1.5',
  },
  {
    name: 'BNB',
    invest: 'XMB',
    reward: 'BNB',
    imgMoney: '/pool/bnb.png',
    imgLogo: '/moneda-ximbia.png',
    roi: '0.5',
  },
  {
    name: 'BNB',
    invest: 'BTIC',
    reward: 'BNB',
    imgMoney: '/pool/bnb.png',
    imgLogo: '/pool/biotic.png',
    roi: '0.7',
  },
  {
    name: 'XMB',
    invest: 'XMB',
    reward: 'XMB',
    imgMoney: '/moneda-ximbia.png',
    imgLogo: '/xmb-icon.png',
    roi: '0.3',
  },
];
