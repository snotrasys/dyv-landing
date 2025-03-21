import React, { useContext, useEffect, useState } from 'react'
// import ImgS3 from '@/components/ImgS3';
import { address } from '@/hooks/useContracts';
import { useToken } from '@/hooks/UseToken';
import UseStake from '@/pages/stake/UseStake';
import Web3Context from '@/context/Web3Context';
import { UsePrice } from '../UsePrice';
import { ethers } from 'ethers';
import axios from 'axios';
import dynamic from 'next/dynamic';
const ImgS3 = dynamic(() => import('@/components/ImgS3'),{ssr:false})


export default function Dashboard() {
  const ximbiaPrice = UsePrice(address.ximbia);
    const ximbia = useToken(address.ximbia);    
    const [totalStakedLocked, setTotalStakedLocked] = React.useState(200);
    const [totalStakedLockedUSD, setTotalStakedLockedUSD] = React.useState(10000);
    
    const [totalUser, setTotalUser] = React.useState(392);
    const [totalVolumen, setTotalVolumen] = React.useState((100000+30000*Math.random()).toFixed(2));
    const [totalFee, setTotalFee] = React.useState(3500);

    
    
    const StakeHandle = UseStake(1);
    const { isLoaded, accounts } = useContext(Web3Context);
    // const Biotic = useToken(address.Biotic);        
    
    // const bioticPrice = UsePrice(address.Biotic);     

    useEffect(() => {
        if(!isLoaded)  return

        handle()
        apiXimbia()
    
      return () => {
    
      }
    }, [isLoaded, accounts,StakeHandle])
    
    useEffect(() => {
        if(!isLoaded)  return

        calculateRewards()
    
    
      return () => {
    
      }
    }, [isLoaded, accounts,totalStakedLocked])
    const apiXimbia = async () => {
    
    try {
      const url ="https://xb.api.magic-api.net/v1"
      const data_ =await axios.get(url)
      // console.log(data_, 'data_');
      const {data} = data_  
      let horder_ = data.horder
      let vol_ = parseFloat(data.pairDayDatas[0].dailyVolumeUSD).toFixed(2)
      let fee_ = parseFloat(vol_ * 0.035) .toFixed(2)


      setTotalUser(horder_)
      setTotalVolumen(vol_)
      setTotalFee(fee_)
    } catch (error) {
      console.log('err apiXimbia', error);
      
    }
    }


    const calculateRewards = async () => {
        try {
        //   const [stake] = StakeHandle;

        //   const user = await stake.users( 1);
          // const data_ = await stake.dataStake(pool + 1);
          const price_ = ximbiaPrice 


        //   const totalDeposit_ = user.userInfo_.totalDeposit;
        //   let youStakeUSD_ =
        //     parseFloat(ethers.utils.formatEther(totalDeposit_)) * price_.price;
    
          //   console.log(user, 'youStakeUSD_', pool + 1, feature.invest);
        //   setyouStakeUSD(youStakeUSD_.toFixed(2));
    
        //   if (feature.reward == 'BNB') {
        //     const pendingRewards_ = user.pendingRewards;
        //     let pendingRewardsUSD_ =
        //       parseFloat(ethers.utils.formatEther(pendingRewards_)) *
        //       price_.priceBnb;
        //     let totalWithdrawn = user.userInfo_.totalWithdrawn;
        //     let totalWithdrawnUSD_ =
        //       parseFloat(ethers.utils.formatEther(totalWithdrawn)) *
        //       price_.priceBnb;
    
        //     let totalethClaimedUSD_ = totalethClaimed * price_.priceBnb;
    
        //     // setTotalethClaimedUSD(totalethClaimedUSD_.toFixed(2));
        //     // setreWardsUSD(totalWithdrawnUSD_.toFixed(2));
        //     // setpendingRewardsUSD(pendingRewardsUSD_.toFixed(2));
        //   } else {
        //     const pendingRewards_ = user.pendingRewards;
        //     let pendingRewardsUSD_ =
        //       parseFloat(ethers.utils.formatEther(pendingRewards_)) * price_.price;
        //     let totalWithdrawn = user.userInfo_.totalWithdrawn;
        //     let totalWithdrawnUSD_ = totalWithdrawn * price_.price;
        //     // setreWardsUSD(totalWithdrawnUSD_.toFixed(2));
        //     // setpendingRewardsUSD(pendingRewardsUSD_.toFixed(2));
        //   }
        //   let totalethClaimedUSD_ = parseFloat(totalethClaimed) * price_.price;


            let totalStakedLockedUSD_ =
              parseFloat(totalStakedLocked) * price_.price;

            //   console.log(totalStakedLockedUSD_, 'totalStakedLockedUSD_');
              setTotalStakedLockedUSD(totalStakedLockedUSD_.toFixed(2));
              // setTotalFee((totalStakedLockedUSD_*0.05).toFixed(2));
            // setTotalethClaimedUSD(totalethClaimedUSD_.toFixed(2));
        } catch (error) {
          console.log('err calculateRewards', error,  1);
        }
      };
    
      const handle = async () => {
        const [stake] = StakeHandle;
        const data_ = await stake.dataStake(1);
        const [token] = ximbia
        // const balance = await token.balanceOf();
    console.log(data_, 'data_');
        let totalStakedLocked = await token.balanceOf(address.vaulStake);
        // // totalStakedLocked = totalStakedLocked.add(
        // //   await token.balanceOf(address.stake),
        // // );
        // // setTotalethClaimed(
        // //   parseFloat(ethers.utils.formatEther(data_.totalWithdrawn_)).toFixed(4),
        // // );
        // // setbalanceOf(parseFloat(ethers.utils.formatEther(balance)).toFixed(4));
        setTotalStakedLocked(
          parseFloat(ethers.utils.formatEther(totalStakedLocked)).toFixed(2),
        );

        // setTotalFee(parseFloat(ethers.utils.formatEther(totalStakedLocked.mul(5).div(100))).toFixed(4))
        // console.log(await stake.users(), 'users');
      };
  return (
    <>
      <div className="relative drop-shadow filter">
            <div className="text-hero-gradient text-center text-3xl font-bold text-white md:text-left md:text-5xl">
              Ximbia Dashboard
            </div>
            <div className="text-center text-xs text-white md:text-left md:text-lg">
              Take look at some detailed statistics regarding burns and numbers
              on Ximbia
            </div>
            <div className="mt-10 flex flex-col justify-start gap-5 md:flex-row">



              <div className="text-baseline dark:text-darkprimary hover:text-high-emphesis focus:text-high-emphesis whitespace-nowrap text-primary md:w-1/2">
                <div className="bg-zyberGrey flex cursor-pointer flex-col items-start justify-start border-b border-b-[3px] border-[#81089e] p-5 px-6 transition hover:scale-105">
                  <div className="flex items-center justify-center gap-2">
                    <ImgS3 src="/bagusd.png" className='w-8 h-8' width={32} height={32} />
                    <div className="hero-title-3 text-xl font-bold text-white">
                      TVL
                    </div>
                 
                  </div>
                  <div className="hero-title-3 text-xl font-bold text-white md:text-4xl">
                    $<span>{totalStakedLockedUSD}</span>
                  </div>
                </div>
              </div>
           
              <div
                className="text-baseline dark:text-darkprimary hover:text-high-emphesis focus:text-high-emphesis whitespace-nowrap text-primary md:w-1/2"
              >
                <div className="bg-zyberGrey flex cursor-pointer flex-col items-start justify-start border-b border-b-[3px] border-[#81089e] p-5 px-6 transition hover:scale-105">
                  <div className="flex items-center justify-center gap-2">
                    <ImgS3 src="/users.png" width={32} height={32} />
                    <div className="hero-title-3 text-xl font-bold text-white">
                      Users
                    </div>
                  </div>
                  <div className="hero-title-3 text-xl font-bold text-white md:text-4xl">
                    <span>{totalUser}</span>
                  </div>
                </div>
              </div>
             

              
            </div>
          </div>
    </>
  )
}
