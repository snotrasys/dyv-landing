import React, { useContext, useEffect, useState } from 'react';
import ImgS3 from '../ImgS3';
import { useCountdownV2 } from '@/hooks/useCountdown';
import { useNft } from '@/hooks/UseNFT';
import { toast } from 'react-hot-toast';
import clsx from 'clsx';
import DropdownSelect from './DropdownSelect';
import MultiApproveContext from '@/context/MultiApprove';
import { address } from '@/hooks/useContracts';
import Web3Context from '@/context/Web3Context';
import TonkenContext from '@/context/TokenHandle';
import { useCountdown } from "@/hooks/useCountdown";

export default function InvestStake({
  data,
  balanceOf,
  setamount,
  // invest,
  userTimeUnlock,
  approve,
  isApprove,
  unstake,
  timeShowStake,
  biotic = false,

  setpool,
  amount,
  checkBox,
  setcheckBox,
}) {
  const {
    timerDays,
    timerHours,
    timerMinutes,
    timerSeconds,
    setDate,
    timeShow,
  } = useCountdownV2();
  const {
    userData,
    allData,
    invest,
    withdraw,
    reinvestment,
    pool_,
    // balanceOf,
  } = useContext(TonkenContext);
  const [nft] = useNft('0x23000af0EcCc4BF8454bA6edD882a20B0e2BEef6');
  const [isApproveNft, setisApproveNft] = useState(false);
  const [update, setupdate] = useState(0);
  const { accounts, isLoaded, connect } = useContext(Web3Context);

  const [valueInvest, setvalueInvest] = useState(0);

  const handle = async () => {
    setDate(Number(userData.timeLock_));
  };

  useEffect(() => {
    if (!isLoaded) return;
    console.log(userData, 'userData lock');
    handle();

    return () => {};
  }, [userData, isLoaded,pool_]);
  // const handle = async () => {
  //   // if (userTimeUnlock == 0) return;
  //   // setDate(userTimeUnlock);
  // };

  // useEffect(() => {
  //   handle();
  //   isApproveHandle();

  //   return () => {};
  // }, [userTimeUnlock, isApproveNft, update]);


console.log('pool_', pool_);
  const daysOptions = [
    {
      id: 0,
      name: '16 days',
      nftValue: { type: 'fixed', value: 5 },
      feeUSD: '10% claim and capital, reinvest',
      feeToken: '7% claim and capital, reinvest',
    },
    { id: 1, name: '23 days', nftValue: { type: 'fixed', value: 30 } },
    { id: 2, name: '36 days', nftValue: { type: 'percentage', value: 15 } },
    { id: 3, name: '50 days', nftValue: { type: 'percentage', value: 20 } },
    { id: 4, name: '60 days', nftValue: { type: 'percentage', value: 22 } },
    { id: 5, name: '80 days', nftValue: { type: 'percentage', value: 30 } },
    { id: 6, name: '120 days', nftValue: { type: 'percentage', value: 40 } },
  ];

  return (
    <>
      <div className="col-span-full lg:col-span-4">
        <div className="relative flex h-full w-full flex-col rounded-lg  bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-cover bg-center px-8 py-12 lg:px-12">
          {userData.hasNft && (
            <div className="mb-8 flex items-center justify-center">
              
              <ImgS3 src={`/nft-${pool_}.png`}  className="h-auto w-96" />
            </div>
          )}

          <div
            className={clsx('mb-4 grid grid-cols-1 gap-2', {
              'sm:grid-cols-1': !isApproveNft,
              'sm:grid-cols-1': !isApproveNft,
            })}
          >
            <ButtonSellect
              timeShow={timeShow}
              daysOptions={daysOptions}
              balanceOf={balanceOf}
              data={data}
              invest={invest}
              approve={approve}
              timeShowStake={timeShowStake}
              isApprove={isApprove}
              setpoolMaster={setpool}
              setisApproveNft={setisApproveNft}
              checkBox={checkBox}
              setcheckBox={setcheckBox}
            />
          </div>
        </div>
      </div>
    </>
  );
}

const ButtonSellect = ({
  checkBox,
  setcheckBox,
  timeShow,
  daysOptions,
  data,
  timeShowStake,
  setpoolMaster,
  setisApproveNft,
}) => {
  const { accounts, isLoaded, connect } = useContext(Web3Context);
  const [isApprove, setisApprove] = useState(false);
  const [pool, setpool] = useState(1);
  const {
    userData,
    allData,
    invest,
    withdraw,
    reinvestment,
    balanceOf,
    getUserData,
    setpool_,
  } = useContext(TonkenContext);
  const [amount, setamount] = useState(0);

  useEffect(() => {
    if (!isLoaded) return;
    setpool_(pool);
    setpoolMaster(pool);
    return () => {};
  }, [pool]);
  useEffect(() => {
    setisApproveNft(isApprove);

    return () => {};
  }, [isApprove]);

  const investhandle = async () => {
    if (Number(amount) <= 0) return;
    invest(amount, pool, checkBox);
  };
  const reinvestmenthandle = async () => {
    reinvestment(pool);
  };
  const withdrawhandle = async () => {
    withdraw(pool, false);
  };

  const withdrawhandlToken = async () => {
    withdraw(pool, true);
  };

  function calculateNftValue(depositAmount, nftValueInfo) {
    depositAmount = Number(depositAmount);
    if (nftValueInfo.type === 'fixed') {
      return Number(nftValueInfo.value) + depositAmount;
    } else if (nftValueInfo.type === 'percentage') {
      return depositAmount + depositAmount * (Number(nftValueInfo.value) / 100);
    }
    return 0;
  }

  const { timerDays, timerHours, timerMinutes, timerSeconds } = useCountdown([
    2024, 2, 22, 18,
  ]);

  return (
    <>
      <div className=" mt-2" x-data="beer()" x-init="start()">
        <div className="text-slate-100">
          <h1 className="text-2xl text-center mb-3 font-extralight">Presale - Token TIAFI</h1>
          <div className="text-6xl text-center flex w-full items-center justify-center">
            <div className="w-32 mx-1 p-2 bg-white text-slate-800 rounded-lg lg:text-[42px] text-[28px]">
              <div className="font-mono leading-none" x-text="days">{timerDays}</div>
              <div className="font-mono uppercase text-xs leading-none">Days</div>
            </div>
            <div className="w-24 mx-1 p-2 bg-white text-slate-800 rounded-lg lg:text-[42px] text-[28px]">
              <div className="font-mono leading-none" x-text="hours">{timerHours}</div>
              <div className="font-mono uppercase text-sm leading-none">Hours</div>
            </div>
            <div className="w-24 mx-1 p-2 bg-white text-slate-800 rounded-lg lg:text-[42px] text-[28px]">
              <div className="font-mono leading-none" x-text="minutes">{timerMinutes}</div>
              <div className="font-mono uppercase text-sm leading-none">Minutes</div>
            </div>
         
            <div className="w-24 mx-1 p-2 bg-white text-slate-800 rounded-lg lg:text-[42px] text-[28px]">
              <div className="font-mono leading-none" x-text="seconds">{timerSeconds}</div>
              <div className="font-mono uppercase text-sm leading-none">Seconds</div>
            </div>
          </div>
       
        </div>
      </div>
         <button
           type="button"
            className="focus:shadow-outline-orange my-3 block w-full transform rounded-lg border border-transparent bg-sky-700 px-6 py-3  text-center text-base font-semibold leading-6 text-white transition-all duration-150 ease-in-out hover:scale-105 focus:border-sky-600 focus:outline-none disabled:opacity-30 sm:text-lg"
          >
            PRESALE
          </button>
      <DropdownSelect
        items={daysOptions}
        label="Selecciona un período"
        onItemSelected={(item) => {
          // console.log(`Has seleccionado: ${item.name}`);
          setpool(Number(item.id) + 1);
        }}
      />
      <div className=" rounded-lg bg-white px-4 py-2 text-gray-900 sm:px-6">
        <div className="">
          <div className="flex-card my-2">
            <p className="text-sm font-bold uppercase">Your Wallet</p>
            <p className="text-sm font-bold">{balanceOf} USDT</p>
          </div>
        </div>
        {(typeof userData.debAmount === 'string' &&
          userData.debAmount !== '0.000') ||
        (typeof userData.debAmount === 'number' && userData.debAmount > 0) ? (
          <div>
            <div className="flex-card my-2">
              <p className="text-sm font-bold uppercase">Debts</p>
              <p className="text-sm font-bold">{userData.debAmount} USDT</p>
            </div>
          </div>
        ) : null}
      </div>
      {checkBox && (
        <div className="mt-4 flex justify-between gap-x-4 py-1">
          <dt className="text-sltae-900 text-sm font-bold">VALUE INVEST</dt>
          <dd className="text-sm font-black text-gray-800">
            {calculateNftValue(amount, data.nftValue)}
          </dd>
        </div>
      )}

      <div className="relative mt-4 flex items-start justify-center">
        <div className="flex h-6 items-center">
          <input
            id="candidates"
            aria-describedby="candidates-description"
            name="candidates"
            type="checkbox"
            onChange={() => setcheckBox(!checkBox)}
            className="h-6 w-6 rounded border-gray-800 text-sky-600 focus:ring-sky-600"
          />
        </div>
        <div className="ml-3 text-sm leading-6">
          <label
            htmlFor="candidates"
            className="text-sm font-bold  uppercase text-slate-100"
          >
            CLICK TO ACTIVATE NFT
          </label>{' '}
        </div>
      </div>
      <div>
        <div className="mt-2">
          <label
            htmlFor="number"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {data.range}
          </label>
          <input
            type="number"
            name="stake"
            id="stake"
            onChange={(e) => {
              console.log(e.target.value);
              setamount(e.target.value);
            }}
            className="block w-full rounded-md border-0 bg-black py-3 text-lg text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
            placeholder="0.0"
          />
        </div>
      </div>
      {isApprove ? (
        <>
          <button
            onClick={() => investhandle()}
            className="focus:shadow-outline-orange mt-2 block w-full transform rounded-lg border border-transparent bg-green-700 px-6 py-3  text-center text-base font-semibold leading-6 text-white transition-all duration-150 ease-in-out hover:scale-105 focus:border-purple-600 focus:outline-none disabled:opacity-30 sm:text-lg"
          >
            STAKE
          </button>
          <button
            className=" focus:shadow-outline-orange mt-2 block w-full transform rounded-lg border border-transparent bg-blue-800 px-6  py-3 text-center text-base font-semibold leading-6 text-white transition-all duration-150 ease-in-out hover:scale-105 focus:border-purple-600 focus:outline-none sm:text-lg"
            onClick={() => reinvestmenthandle()}
          >
            REINVEST
          </button>
          <button
            className=" focus:shadow-outline-orange mt-2 block w-full transform rounded-lg border border-transparent bg-yellow-400 px-6  py-3 text-center text-base font-semibold leading-6 text-black transition-all duration-150 ease-in-out hover:scale-105 focus:border-purple-600 focus:outline-none sm:text-lg"
            onClick={() => withdrawhandle()}
          >
            UNSTAKE
          </button>
          <button
            className="hidden focus:shadow-outline-orange mt-2 block w-full transform rounded-lg border border-transparent bg-yellow-400 px-6  py-3 text-center text-base font-semibold leading-6 text-black transition-all duration-150 ease-in-out hover:scale-105 focus:border-purple-600 focus:outline-none sm:text-lg"
            onClick={() => withdrawhandlToken()}
          >
            UNSTAKE TIAFI
          </button>
        </>
      ) : (
        <Approvebutton setisApprove={setisApprove} />
      )}

      {timeShowStake !== true && (
        <p className="mt-1 text-center text-xs text-white">
          There is a {timeShow} deposit lock
        </p>
      )}
    </>
  );
};

const Approvebutton = ({ setisApprove }) => {
  const { accounts, isLoaded, connect } = useContext(Web3Context);
  const [isApproveToken1, setisApproveToken1] = useState(false);
  const [isApproveToken2, setisApproveToken2] = useState(false);
  const {
    isApprove,
    currentBalance_,
    changeToken,
    setchangeToken,
    approveHandlePlus,
    allowanceHandlePlus,
    balanceOfHandlePlus,
    update,
  } = useContext(MultiApproveContext);

  useEffect(() => {
    if (!isLoaded) return;
    allowance();
  }, [update, isLoaded]);

  const allowance = async () => {
    const rest = await allowanceHandlePlus(address.btc);
    const rest2 = await allowanceHandlePlus(address.celestia);
    setisApproveToken1(rest);
    setisApproveToken2(rest2);
    setisApprove(rest && rest2);
  };
  console.log();

  return (
    <>
      {!isApproveToken1 ? (
        <button
          onClick={() => {
            approveHandlePlus(address.btc);
          }}
          className="focus:shadow-outline-orange mt-2 block w-full transform rounded-lg border border-transparent bg-blue-700 px-6  py-3 text-center text-base font-semibold leading-6 text-white transition-all duration-150 ease-in-out hover:scale-105 focus:border-purple-600 focus:outline-none sm:text-lg"
        >
          Approve invest
        </button>
      ) : null}
      {!isApproveToken2 ? (
        <button
          onClick={() => {
            approveHandlePlus(address.celestia);
          }}
          className="focus:shadow-outline-orange mt-2 block w-full transform rounded-lg border border-transparent bg-blue-700 px-6  py-3 text-center text-base font-semibold leading-6 text-white transition-all duration-150 ease-in-out hover:scale-105 focus:border-purple-600 focus:outline-none sm:text-lg"
        >
          Approve Fee
        </button>
      ) : null}
    </>
  );
};
