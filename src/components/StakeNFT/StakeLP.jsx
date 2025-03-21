import ImgS3 from '@/components/ImgS3';
import { Layout } from '@/components/app/Layout';
import Web3Context from '@/context/Web3Context';
import { useToken } from '@/hooks/UseToken';
import { address } from '@/hooks/useContracts';
import UseStake from '@/pages/stake/UseStakeLP';
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


const address_ = {
  tokenInvest:"0x9aD9f995BdDDcd3D4D442fF7fdC75EfAfc7dBbCB",
  tokenreward:"0x3bdeECae844b96A133F98e54e36eB85414ffe5c9",
  stake:"0x9DA40a8f7c706d61991Ac3BfF57f8BcCB85950D6",
  vaul:"0x10acc27f4c6b805247a5458a8c288a46956ccd19"
}
function StakeLP({ pool }) {
  const [data, setdata] = useState({
    name: 'XMB',
    invest: 'XMB',
    reward: 'XMB',
    imgMoney: '/moneda-ximbia.png',
    imgLogo: '/xmb-icon.png',
    tokenInvest:"0x9aD9f995BdDDcd3D4D442fF7fdC75EfAfc7dBbCB",
    tokenreward:"0x3bdeECae844b96A133F98e54e36eB85414ffe5c9",
  });

  const [totalStakedLocked, setTotalStakedLocked] = React.useState(200);
  const [totalStakedLockedUSD, setTotalStakedLockedUSD] = React.useState(10000);
  const [stakingValue, setStakingValue] = React.useState(0);
  const [totalethClaimed, setTotalethClaimed] = React.useState(200);
  const [totalethClaimedUSD, setTotalethClaimedUSD] = React.useState(10000);
  const [isApprove, setisApprove] = useState(false);
  const [amount, setamount] = useState(0);
  const StakeHandle = UseStake(pool);
  const { isLoaded, accounts } = useContext(Web3Context);
  const Biotic = useToken(address_.tokenInvest);
  const ximbia = useToken(address_.tokenreward);
  const [pendingRewards, setpendingRewards] = useState(0);
  const [Earned, setEarned] = useState(0);
  const [balanceOf, setbalanceOf] = useState(0);
  const [youStake, setyouStake] = useState(0);
  const [update, setupdate] = useState(0);
  const [userTime, setUserTime] = useState(30);
  const [userTimeUnlock, setUserTimeUnlock] = useState(0);
  const ximbiaPrice = UsePrice(address_.tokenreward);
  const bioticPrice = UsePrice(address_.tokenInvest);
  const [reWardsUSD, setreWardsUSD] = useState(0);
  const [youStakeUSD, setyouStakeUSD] = useState(0);
  const [pendingRewardsUSD, setpendingRewardsUSD] = useState(0);
  const [stakingValue1, setStakingValue1] = useState(0);
  const [investment, setInvestment] = useState(0);
  const [stakingValue1USD, setStakingValue1USD] = useState(0);
  const [investmentUSD, setInvestmentUSD] = useState(0);

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
      const price_ = ximbiaPrice 
      const priceInvest_ = bioticPrice      
      const LPprice =(await priceInvest_.getLpPrice(data.tokenInvest)).toString()


      const totalDeposit_ = user.userInfo_.totalDeposit;
      let youStakeUSD_ =
        parseFloat(ethers.utils.formatEther(totalDeposit_)) * parseFloat(ethers.utils.formatEther(LPprice));
      setyouStakeUSD(youStakeUSD_.toFixed(7));
      const stakingValue_ = user.userInfo_.stakingValue;
      setStakingValue1(parseFloat(ethers.utils.formatEther(stakingValue_)).toFixed(2))
      setStakingValue1USD(parseFloat(ethers.utils.formatEther(stakingValue_)) * price_.price)
   
      const investmet1 = user.userInfo_.investment
      setInvestment(parseFloat(ethers.utils.formatEther(investmet1)).toFixed(2))
      setInvestmentUSD(parseFloat(ethers.utils.formatEther(investmet1)) * price_.price)

      
      // if (data.reward == 'BNB') {
      //   // console.log(price_.priceBnb );
      //   const pendingRewards_ = user.pendingRewards;
      //   let pendingRewardsUSD_ =
      //     parseFloat(ethers.utils.formatEther(pendingRewards_)) *
      //     price_.priceBnb;
      //   let totalWithdrawn = user.userInfo_.totalWithdrawn;
      //   let totalInvestBNB = user.userInfo_.stakingValue
        setStakingValue(parseFloat(ethers.utils.formatEther(totalDeposit_)).toFixed(2))
      //   let totalWithdrawnUSD_ = parseFloat(ethers.utils.formatEther(totalWithdrawn)) * price_.priceBnb;
      //   let totalethClaimedUSD_ = parseFloat(totalethClaimed) * price_.priceBnb;
      //   setTotalethClaimedUSD(totalethClaimedUSD_.toFixed(2));
      //   setreWardsUSD(totalWithdrawnUSD_.toFixed(2));
      //   setpendingRewardsUSD(pendingRewardsUSD_.toFixed(2));
      // } else {
        const pendingRewards_ = user.pendingRewards;
        // console.log(price_.price);
        let pendingRewardsUSD_ =
          parseFloat(ethers.utils.formatEther(pendingRewards_)) * price_.price;
        let totalWithdrawn = user.userInfo_.totalWithdrawn;
        let totalWithdrawnUSD_ = parseFloat(ethers.utils.formatEther(totalWithdrawn)) * price_.price;
        setreWardsUSD(totalWithdrawnUSD_.toFixed(4));
        setpendingRewardsUSD(pendingRewardsUSD_.toFixed(4));
      // }
      let totalethClaimedUSD_ = parseFloat(totalethClaimed) * price_.price;
      let totalStakedLockedUSD_ = parseFloat(totalStakedLocked) * parseFloat(ethers.utils.formatEther(LPprice));
      setTotalStakedLockedUSD(totalStakedLockedUSD_.toFixed(4));
      setTotalethClaimedUSD(totalethClaimedUSD_.toFixed(4));
    } catch (error) {
      console.log('err calculateRewards', error);
      //console.log(error);

    }
  };

  const handle = async () => {
    try {
      
    
    const [stake] = StakeHandle;
    const data_ = await stake.dataStake(pool + 1);
    const [token] =Biotic;
    const [token2] =  ximbia
    const balance = await token.balanceOf();

    let totalStakedLocked = await token.balanceOf(address_.vaul);
    totalStakedLocked = totalStakedLocked.add(
      await token.balanceOf(address_.tokenInvest),
    );
    setTotalethClaimed(
      parseFloat(ethers.utils.formatEther(data_.totalWithdrawn_)).toFixed(4),
    );
    setbalanceOf(parseFloat(ethers.utils.formatEther(balance)).toFixed(4));
    setTotalStakedLocked(
      parseFloat(ethers.utils.formatEther(totalStakedLocked)).toFixed(4),
    );

    // console.log(await stake.users(), 'users );
  } catch (error) {
    console.log(error);
      
  }
  };
  const userhandle = async () => {
    try {
      const [stake] = StakeHandle;
      const user = await stake.users(pool + 1);
// console.log(user, 'user');
      console.log(ethers.utils.formatEther(user.userInfo_.stakingValue), 'user');


      


      console.log(user, 'user');

      setpendingRewards(ethers.utils.formatEther(user.pendingRewards));
      setEarned(ethers.utils.formatEther(user.userInfo_.totalWithdrawn));
      setyouStake(ethers.utils.formatEther(user.userInfo_.totalDeposit));

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
      const rest = await stake.forceWithdraw(pool + 1);
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
      const [token_] =  Biotic;
      token = token_;
      const rest = await token.approve(address_.stake);
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
      const [token_] =Biotic;
      // console.log(data);
      // console.log(data.invest == 'XMB', 'data.invest == XMB');
      token = token_;
      const allowance = await token.allowanceHandle(address_.stake);

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
              EARN {data.name} 
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
                          src={data.imgLogo}
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
                        <span className="text-primary">{data.roi}%</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-full lg:col-span-4">
                  <div className="relative flex h-32 w-full flex-col items-start rounded-lg bg-[#3F008E] px-8 py-6 lg:px-4">
                    <div className="flex text-white">
                      <div className="mr-4 flex-shrink-0 self-center">
                        <ImgS3
                          src={data.imgMoney}
                          className="h-16 w-16 rounded-full bg-black "
                        />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold">
                          Total {data.reward} Claimed
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
                  timeShowStake={true}
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
                  stakingValue1={stakingValue1}
                  investment={investment}
                  stakingValue1USD={stakingValue1USD}
                  investmentUSD={investmentUSD}
                  earnedXMB={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StakeLP;

const stakeType = [
  {
    name: 'XMB/BNB LP earn XMB',
    invest: 'XMB LP',
    reward: 'XMB',
    imgMoney: '/moneda-ximbia.png',
    imgLogo: '/xmb-icon.png',
    roi: '0.25',
    tokenInvest:"0x9aD9f995BdDDcd3D4D442fF7fdC75EfAfc7dBbCB",
    tokenreward:"0x3bdeECae844b96A133F98e54e36eB85414ffe5c9",
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
