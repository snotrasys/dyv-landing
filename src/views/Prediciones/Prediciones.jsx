import Modal from '@/components/Modal';
import { Layout } from '@/components/app/Layout';
import {
    ArrowPathIcon,
  ArrowSmallDownIcon,
  InformationCircleIcon,
} from '@heroicons/react/20/solid';
import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import ExpireUp from './ExpireUp';
import ExpireDown from './ExpireDown';
import ModalUp from './ModalUp';
import ModalDown from './ModalDown';
import LaterCard from './LaterCard';
import LiveCard from './LiveCard';
import CollectWinner from './CollectWinner';
import { UsePrediction } from '@/hooks/UsePrediction';
import { useToken } from '@/hooks/UseToken';
import { BigNumber } from 'ethers';
import Web3Context from '@/context/Web3Context';
import { address } from '@/hooks/useContracts';


function Prediciones() {
  const [openModalUp, setOpenModalUp] = useState(false);
  const [openModalDown, setOpenModalDown] = useState(false);
  const [openCollectWinner, setOpenCollectWinner] = useState(false)
  const [Prediction] = UsePrediction();
  const [token] = useToken(address.ximbia);
  const [currentBalance, setcurrentBalance] = useState(BigNumber.from(0))
  
  const { accounts, isLoaded, connect } = useContext(Web3Context);

  useEffect(() => {
    if(!isLoaded) return
    balanceHandle();
    return () => {
    
    }
  }, [isLoaded])

  const balanceHandle=async ()=> {
    const balance =await  token.balanceOf();
    console.log(balance.toString());
    setcurrentBalance(balance.toString());
  }
  
  const get2=async ()=> {
    const prediction =await  Prediction.currentEpoch();
    console.log(prediction.toString());

  }

  const up =async (epoch,  _amount) => {
    // const preiction =await e Prediction.betBull(epoch,_amount);
await     Prediction.roundView()
// console.log("epoch");

  }
  const down =async () => {
    const prediction =await  Prediction.betBear();
        
  }
  return (
    <Layout>
      <div className="h-screen">
        <div className=" px-4 py-5 sm:px-6">
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <div className="flex">
                <div className="mr-4 flex-shrink-0 self-center ">
                  <img className="h-20 w-20 " src="/prediccion.png" />
                </div>
                <div className="items-center">
                  <h4 className="font-redthinker text-3xl font-bold text-[#9000C0]">
                    PREDICTION
                  </h4>
                  <p className="mt-1 font-redthinker text-2xl text-white">
                    CRYPTO PRICE
                  </p>
                </div>
              </div>
            </div>
            <div className="ml-4 my-6 flex-shrink-0">
              <button
                type="button"
                className="relative mr-20 inline-flex items-center rounded-md bg-white px-5 py-2 text-sm font-semibold text-[#9000C0] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                02:00 | 5 min
                <img
                  className="absolute ml-[90px] h-16 w-16"
                  src="/reloj.png"
                />
              </button>
              <button
                type="button"
                className="bg-gradient-green inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <InformationCircleIcon
                  className="-ml-0.5 h-5 w-5"
                  aria-hidden="true"
                />
              </button>
              <button
                type="button"
                onClick={() => {
                    // setOpenCollectWinner(true);
                    up(1, 1);
                  }}
                className="bg-gradient-green ml-3 inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-slate-600  shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 512 512"
                  className="-ml-0.5 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M98.398 21.146a17.092 17.092 0 0 0-4.636.521c-20.49 5.262-33.163 20.63-36.116 38.649-2.952 18.019 2.168 38.346 12.676 58.193 20.695 39.086 63.262 77.08 117.852 85.85-5.61-6.72-11.05-14.246-16.274-22.375-39.008-12.57-70.021-42.344-85.67-71.899-9.206-17.387-12.846-34.491-10.82-46.857C77.437 50.862 83.482 42.89 98.238 39.1c.065-.017.068-.034.092-.053-.065-.143.105-.08 0 0 .022.049.061.11.176.217.527.493 1.689 2.24 2.207 5.14 1.036 5.804-.413 15.593-8.135 25.68l14.293 10.942c10.418-13.61 13.65-28.086 11.56-39.785-1.044-5.85-3.396-11.165-7.628-15.124-3.174-2.969-7.747-4.868-12.405-4.972zm315.204 0c-4.658.104-9.23 2.003-12.405 4.972-4.232 3.96-6.584 9.274-7.629 15.124-2.089 11.699 1.143 26.174 11.56 39.785l14.294-10.942c-7.722-10.087-9.171-19.876-8.135-25.68.518-2.9 1.68-4.647 2.207-5.14a.695.695 0 0 0 .176-.217c-.105-.08.065-.143 0 0 .024.019.027.036.092.053 14.756 3.79 20.801 11.76 22.828 24.127 2.026 12.366-1.614 29.47-10.82 46.857-15.649 29.555-46.662 59.33-85.67 71.899-5.223 8.129-10.665 15.655-16.274 22.375 54.59-8.77 97.157-46.764 117.852-85.85 10.508-19.847 15.628-40.174 12.676-58.193-2.953-18.02-15.626-33.387-36.116-38.649a17.092 17.092 0 0 0-4.636-.521zm-276.166 7.713c2.146 36.533 16.76 83.07 36.537 120.824 10.707 20.442 22.876 38.334 34.761 50.685C220.62 212.72 232 218.858 240 218.858h32c8 0 19.38-6.138 31.266-18.49 11.885-12.351 24.054-30.243 34.761-50.685 19.777-37.755 34.39-84.29 36.537-120.824H137.436zm95.564 208v16h46v-16h-46zm6.445 34c-2.458 25.967-12.796 57.873-24.437 76h81.984c-11.64-18.127-21.979-50.033-24.437-76h-33.11zm-38.445 94v14h110v-14H201zm-32 32v94h174v-94H169zm23 23h128v48H192v-48z"></path>
                </svg>
              </button>
              <button
                type="button"
              
                className="bg-[#E5E5E5] ml-3 inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-slate-900  shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <ArrowPathIcon
                  className="-ml-0.5 h-5 w-5"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
        <ModalUp open={openModalUp} setOpen={setOpenModalUp} handle={up} currentBalance={currentBalance} />
        <ModalDown open={openModalDown} setOpen={setOpenModalDown} handle={down} currentBalance={currentBalance} />
        <CollectWinner open={openCollectWinner} setOpen={setOpenCollectWinner}/>
        <div className="mx-auto max-w-max">
          <div className="__carousel flex gap-6 overflow-x-scroll md:pb-4">
            <ExpireUp />
            <ExpireDown />
            <LiveCard />

            <figure className="__slide w-[80vw] shrink-0  sm:p-10 md:w-[43vw] xl:w-[30rem]">
              <div className="relative">
                <div className="  bg-card-live relative overflow-hidden rounded-lg px-px pb-[3px] pt-px text-slate-500">
                  <div className="sc-3a5c8d1f-1 sc-69ac18f9-1 glwDJB gzciwb">
                    <div className="sc-b1def301-0 fHGznP">
                      <div className="sc-3a5c8d1f-1 sc-32d5f017-0 glwDJB chfQFH text-white">
                        <svg
                          viewBox="0 0 24 24"
                          width="24px"
                          color="white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="white"
                          className="sc-231a1e38-0 mr-2"
                        >
                          <path d="M9 14.7902C9 15.555 9.82366 16.0367 10.4903 15.6617L15.4505 12.8716C16.1302 12.4893 16.1302 11.5107 15.4505 11.1284L10.4903 8.33827C9.82366 7.96331 9 8.44502 9 9.20985V14.7902ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"></path>
                        </svg>
                        <div
                          color="textDisabled"
                          fontSize="16px"
                          className="sc-daa4d312-0 ipHAGF"
                        >
                          Next
                        </div>
                      </div>
                      <div className="sc-b1def301-1 ggUjvU">
                        <div
                          fontSize="12px"
                          color="textDisabled"
                          className="sc-daa4d312-0 jeXusl"
                        >
                          #003
                        </div>
                      </div>
                    </div>
                    <div
                      className="sc-7199f2b4-0 flLQI "
                      style={{ position: 'relative' }}
                    >
                      <div className="sc-3a5c8d1f-1 iQDxM cursor-pointer">
                        <div className="sc-b0205416-0 cGCWyQ cursor-pointer">
                          <svg
                            height="65px"
                            width="240px"
                            viewBox="0 0 240 65"
                            xmlns="http://www.w3.org/2000/svg"
                            className="sc-231a1e38-0 dPwWVs"
                          >
                            <g filter="url(#filter0_i)">
                              <path
                                d="M10.0001 49.2757L10.0003 64H234L234 49.2753C234 42.5136 229.749 36.4819 223.381 34.2077L138.48 3.8859C127.823 0.0796983 116.177 0.0796931 105.519 3.8859L20.6188 34.2076C14.2508 36.4819 10.0001 42.5138 10.0001 49.2757Z"
                                fill="#969696"
                              />
                            </g>
                            <defs>
                              <filter
                                id="filter0_i"
                                x="10.0001"
                                y="1.03125"
                                width={224}
                                height="62.9688"
                                filterUnits="userSpaceOnUse"
                                colorInterpolationFilters="sRGB"
                              >
                                <feFlood
                                  floodOpacity={0}
                                  result="BackgroundImageFix"
                                />
                                <feBlend
                                  mode="normal"
                                  in="SourceGraphic"
                                  in2="BackgroundImageFix"
                                  result="shape"
                                />
                                <feColorMatrix
                                  in="SourceAlpha"
                                  type="matrix"
                                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                  result="hardAlpha"
                                />
                                <feOffset />
                                <feGaussianBlur stdDeviation={1} />
                                <feComposite
                                  in2="hardAlpha"
                                  operator="arithmetic"
                                  k2={-1}
                                  k3={1}
                                />
                                <feColorMatrix
                                  type="matrix"
                                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
                                />
                                <feBlend
                                  mode="normal"
                                  in2="shape"
                                  result="effect1_innerShadow"
                                />
                              </filter>
                            </defs>
                          </svg>
                          <div className="sc-b0205416-1 giGtSP cursor-pointer text-white"
                          onClick={up}
                          >
                            <div
                              fontSize="20px"
                              color="success"
                              className="sc-daa4d312-0 cKWrye"
                            >
                              Up
                            </div>
                            <div className="sc-3a5c8d1f-1 glwDJB">
                              <div
                                height="14px"
                                className="sc-3a5c8d1f-1 sc-32d5f017-0 cboqpi ieaVLn"
                              >
                                <div
                                  fontSize="14px"
                                  color="textSubtle"
                                  className="sc-daa4d312-0 fPRZRD "
                                >
                                  0x{' '}
                                </div>
                                <div
                                  fontSize="14px"
                                  color="textSubtle"
                                  className="sc-daa4d312-0 kmaGkw"
                                >
                                  Payout
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="sc-3a5c8d1f-1 sc-8d651315-0 glwDJB bg-gradient-blue  rounded-lg">
                        <div className="sc-8d651315-1 dztVmP ">
                          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between text-white sm:flex-nowrap">
                            <div className="ml-4 mt-2">
                              <h3 className="leading-2 text- text-xs font-semibold">
                                CLOSED PRICE
                              </h3>
                            </div>
                            <div className="ml-4 mt-2 flex-shrink-0">
                              <h3 className="leading-2 text- text-xs font-semibold">
                                {`<`} 0.00 BTC
                              </h3>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setOpenModalUp(true);
                            }}
                            className="focus:shadow-outline-orange bg-gradient-green mt-1 block w-full transform rounded-lg border border-transparent px-6  py-1 text-center text-sm font-semibold leading-6 text-white transition-all duration-150 ease-in-out hover:scale-105 focus:border-green-600 focus:outline-none"
                          >
                            ENTER UP
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOpenModalDown(true);
                            }}
                            className="focus:shadow-outline-orange bg-gradient-red mt-2 block w-full transform rounded-lg border border-transparent px-6  py-1 text-center text-sm font-semibold leading-6 text-white transition-all duration-150 ease-in-out hover:scale-105 focus:border-red-600 focus:outline-none"
                          >
                            ENTER DOWN
                          </button>
                        </div>
                      </div>
                      <div className="sc-3a5c8d1f-1 cfWdbc">
                        <div className="sc-b0205416-0 cGCWyQ">
                          <svg
                            height="65px"
                            width="240px"
                            viewBox="0 0 240 65"
                            color="text"
                            xmlns="http://www.w3.org/2000/svg"
                            className="sc-231a1e38-0 dPwWVs"
                          >
                            <g filter="url(#filter0_i)">
                              <path
                                d="M10.0001 15.7243L10.0003 1H234L234 15.7247C234 22.4864 229.749 28.5181 223.381 30.7923L138.48 61.1141C127.823 64.9203 116.177 64.9203 105.519 61.1141L20.6188 30.7924C14.2508 28.5181 10.0001 22.4862 10.0001 15.7243Z"
                                fill="#969696"
                              />
                            </g>
                            <defs>
                              <filter
                                id="filter0_i"
                                x="10.0001"
                                y={1}
                                width={224}
                                height="62.9688"
                                filterUnits="userSpaceOnUse"
                                colorInterpolationFilters="sRGB"
                              >
                                <feFlood
                                  floodOpacity={0}
                                  result="BackgroundImageFix"
                                />
                                <feBlend
                                  mode="normal"
                                  in="SourceGraphic"
                                  in2="BackgroundImageFix"
                                  result="shape"
                                />
                                <feColorMatrix
                                  in="SourceAlpha"
                                  type="matrix"
                                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                  result="hardAlpha"
                                />
                                <feOffset />
                                <feGaussianBlur stdDeviation={1} />
                                <feComposite
                                  in2="hardAlpha"
                                  operator="arithmetic"
                                  k2={-1}
                                  k3={1}
                                />
                                <feColorMatrix
                                  type="matrix"
                                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
                                />
                                <feBlend
                                  mode="normal"
                                  in2="shape"
                                  result="effect1_innerShadow"
                                />
                              </filter>
                            </defs>
                          </svg>
                          <div className="sc-b0205416-1 giGtSP text-white">
                            <div className="sc-3a5c8d1f-1 glwDJB">
                              <div
                                height="14px"
                                className="sc-3a5c8d1f-1 sc-32d5f017-0 cboqpi ieaVLn"
                              >
                                <div
                                  fontSize="14px"
                                  color="white"
                                  className="sc-daa4d312-0 gxfCcI"
                                >
                                  2.18x
                                </div>
                                <div
                                  fontSize="14px"
                                  color="white"
                                  className="sc-daa4d312-0 kftbyn"
                                >
                                  Payout
                                </div>
                              </div>
                            </div>
                            <div
                              fontSize="20px"
                              color="white"
                              className="sc-daa4d312-0 jvBUtp"
                            >
                              Down
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </figure>
            <LaterCard />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Prediciones;
