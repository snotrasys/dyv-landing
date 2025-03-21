import React, { useState, useContext, useEffect } from 'react';
import Web3Context from '@/context/Web3Context';
import { motion, useReducedMotion } from 'framer-motion';
import { BigNumber, Contract, ethers, utils } from 'ethers';
import { useCountdown } from '@/hooks/useCountdown';
import ImgS3 from '@/components/ImgS3';
import { useSPresale } from '@/context/PresaleHandle';
import PriceXimbia from '@/components/PriceXimbia';
import {useSwap_} from '@/context/SwapHandle';
import { toast } from 'react-hot-toast';
function SwapToken() {
  const { userData,
    allData,
    invest,
    isApprove,
    approveHandle,
    balanceOf,
    withdraw,
    balanceOfConctract

  }=useSwap_();
  const shouldReduceMotion = useReducedMotion();
  const { timerDays, timerHours, timerMinutes, timerSeconds } = useCountdown([
    2023, 4, 15, 20,
  ]);
  useEffect(() => {
    return () => {};
  }, [timerDays]);

  
  const [recaudacion, setRecaudacion] = useState(0);
  const maxValue = 1.5;
  const [amount, setamount] = useState(0);
  const [bbh, setbbh] = useState(0);
  const HARCAP = 200;

 
  const { accounts, isLoaded, setupdate, update1,connect } = useContext(Web3Context);
  const [investAmount, setinvestAmount] = useState(BigNumber.from(0));
  const [tokenAmount, settokenAmount] = useState(BigNumber.from(0));

  useEffect(() => {

    setRecaudacion(allData?.totalDeposits_);

    return () => {};
  }, [allData]);

  useEffect(() => {
    // console.log(amount);
    setbbh(amount * 1);
    return () => {};
  }, [amount]);

  function percentage(input) {
    return (input * 100) / 200;
  }

  function buyToken(amount_) {
    invest(amount_,false);
  }
 

  const [acount_, setacount_] = useState('0x');

  useEffect(() => {
    const start = '0X...';
    const end = accounts.slice(38);
    setacount_(`${start}...${end}`);
    return () => {};
  }, [accounts]);

  const swapV2 = async () => {
    try {
    if(!isLoaded) return;
    // throw new Error("Not yet available")
    const web3Provider = await connect();
    const provider =web3Provider
    const signer = provider.getSigner()    
    
    const contract = new Contract(
      "0x083dB6EFE9FA94a16C0F1D7d7252d3Fe1952688E",
      [`function withdraw() external`,
      `function TOKEN_OLD() external view returns(address)`,
      `function TOKEN_NEW() external view returns(address)`,
    `function getTokensInStaking(address _user) external view returns(uint)`,],
      signer
      )      
    const tx = await contract.withdraw();
    // console.log((await contract.getTokensInStaking("0x398FB8F04e77f06ac32D56a30f9f6D0D374F7d75")).toString());
    // console.log(await contract. TOKEN_NEW()   );
    if(tx.wait(1))
    toast.success("Success")
    
    } catch (error) {
      // toast.error(error);
      console.log(error);
    }
  }
  return (
    <>
      <div className="">
        <motion.div>
          <div>
            <div className="my-6 flex justify-center">
              <ImgS3 src="/public-presale.png" className="h-auto lg:w-96 w-60" />
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className=" px-12 pb-8 sm:px-3">
                <div>
                  <div>
                    <label
                      htmlFor="number"
                      className="block text-sm font-medium leading-5  text-purple-100"
                    >
                      Enter your XMB amount
                    </label>

                    <div className="mt-1 rounded-md shadow-sm">
                      <input
                        autoFocus
                        id="number"
                        type="number"
                        placeholder="0"
                        onChange={(e) => {
                          if (
                            e.target.value == '' ||
                            Number(e.target.value) < 0.05
                          )
                            setamount(0.05);
                          else setamount(e.target.value);
                        }}
                        aria-describedby="price-currency"
                        className="block w-full rounded-md border-gray-200 bg-purple-700 pl-7 text-2xl text-white shadow-sm placeholder:text-white focus:border-purple-900 focus:ring-purple-700"
                      />
                      <div className="mt-0.5 text-slate-200">
                        XMB Amount: {balanceOf}
                      </div>
                    </div>
                  </div>
          {true?        <div className="mt-10 hidden">                    
                    <button className="block w-full rounded-lg  bg-blue-800 px-2 py-2 text-center font-bold text-white sm:text-sm"
                    onClick={() => buyToken(amount)}
                    >
                      Change
                    </button>
                  </div>:        <div className="mt-10">                    
                    <button className="block w-full rounded-lg  bg-blue-800 px-2 py-2 text-center font-bold text-white sm:text-sm"
                    onClick={() => approveHandle()}
                    >
                      Approve
                    </button>
                  </div>}
                  <div className="mt-6">                    
                    <button className="block w-full rounded-lg  bg-slate-900 px-2 py-2 text-center font-bold text-white sm:text-sm"
                    onClick={() => withdraw(false)}
                    >
                      Claim Swap
                    </button>
                  </div>
                  <div className="mt-6 ">                    
                    <button className="block w-full rounded-lg  bg-slate-900 px-2 py-2 text-center font-bold text-white sm:text-sm"
                    onClick={() => swapV2()}
                    >
                      Claim SuperXstake
                    </button>
                  </div>

                  <div className="mt-6 flex w-full justify-center shadow-sm">
                  </div>
                  <p className="mt-4 text-xl text-[#3d0070] text-center font-bold">
                    XMB New price: 0.35 <br /> Participation: 1 XMB - 1
                    New Token <br />
                  </p>
                  <div className="mt-10">
                    <label
                      htmlFor="number"
                      className=" text-md my-2 block text-center font-medium leading-5 text-black"
                    >
                  Contract Balance
                    </label>
                    <p className="block w-full rounded-lg  bg-slate-900 px-2 py-2 text-center font-bold text-white sm:text-sm">
                      {Number(balanceOfConctract).toFixed(4)} XMB
                    </p>
                    <p className="block w-full rounded-lg mt-2  bg-slate-900 px-2 py-2 text-center font-bold text-white sm:text-sm">
                     <PriceXimbia value={balanceOfConctract}/> USD
                    </p>
                  </div>
                  <div className="-mt-px flex divide-x divide-[#8f80ba]">
                    <div className="flex w-0 flex-1 flex-col justify-center">
                      <a className="items-center justify-center rounded-bl-lg border border-transparent py-4  text-center text-sm font-medium text-slate-100 ">
                        <span className="">Your Invest:</span>
                        <p>{userData?.invest}</p>
                      </a>
                    </div>
                    <div className="-ml-px flex w-0 flex-1 flex-col justify-center">
                      <a className="items-center justify-center rounded-bl-lg border border-transparent py-4  text-center text-sm font-medium text-slate-100 ">
                        <span className="">Your Tokens:</span>
                        <p>{userData?.toWithdraw}</p>
                      </a>
                    </div>
                  </div>
                  <span className="mt-6 flex justify-center text-sm font-semibold leading-tight text-slate-100 md:text-base">
                    Collect: {recaudacion} {'XMB'}
                  </span>
                  <div className="mt-1 flex justify-center">
                    <div className="flex h-full w-60 items-center lg:flex-row ">
                      <div className="text-md mb-0 flex items-center justify-center uppercase text-gray-500">
                        {/* <span className="mr-2">completed</span> */}
                      </div>
                      <div className="relative h-1 w-full max-w-lg rounded-full bg-slate-800">
                        <motion.div
                          animate={{
                            width: `${percentage(
                              Number.parseInt(recaudacion),
                            )}%`,
                          }}
                          initial={{
                            width: `${percentage(
                              Number.parseInt(recaudacion),
                            )}%`,
                          }}
                          transition={{
                            duration: 0.5,
                            type: 'spring',
                            mass: 0.5,
                          }}
                          className="h-1 bg-green-600 transition-transform duration-75 ease-in-out"
                        />
                        {/* <div
          css={{left: '75%'}}
          className={`w-5 h-5 -mt-3 rounded-full absolute border-2 border-gray-300 bg-background ${
            moduleProgress.percentComplete >= 75 ? 'border-blue-500' : ''
          }`}
        /> */}
                        <div
                          style={{ left: '99%' }}
                          className={`absolute -mt-3 h-5 w-5 rounded-full border-2  bg-white `}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default SwapToken;