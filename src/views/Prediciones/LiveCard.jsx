import { ArrowSmallDownIcon, ArrowSmallUpIcon } from '@heroicons/react/20/solid';
import React from 'react';

function LiveCard({
    numberSerie = 0,
    closesPrice= 0,
    priceUp = true,
    lockedPrice = 0,
    pricePool = 0,
    valueUp = 3,
    valueDown = 0,

}) {
  return (
    <div>
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
                        Live
                      </div>
                    </div>
                    <div className="sc-b1def301-1 ggUjvU">
                      <div
                        fontSize="12px"
                        color="textDisabled"
                        className="sc-daa4d312-0 jeXusl"
                      >
                        #{numberSerie}
                      </div>
                    </div>
                  </div>
                  <div
                    className="sc-7199f2b4-0 flLQI "
                    style={{ position: 'relative' }}
                  >
                    <div className="sc-3a5c8d1f-1 iQDxM cursor-pointer">
                      <div className="sc-b0205416-0 cGCWyQ cursor-pointer">
                        {
                            priceUp ? (
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
                                    fill="#38C434"
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
                                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
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
                            ) : (
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
                            )
                        }
                      
                       
                        <div className="sc-b0205416-1 giGtSP cursor-pointer text-white">
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
                              className="sc-3a5c8d1f-1 sc-32d5f017-0 cboqpi ieaVLn ml-1"
                            >
                              <div
                                fontSize="14px"
                                color="textSubtle"
                                className="sc-daa4d312-0 fPRZRD mr-1"
                              >
                                {valueUp}x{' '}
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
                            <p className="text-xs font-semibold leading-6 ">
                              $0.00
                            </p>
                          </div>
                          <div className="ml-4 mt-2 flex-shrink-0">
                            {
                                priceUp ? (
                                    <button
                                    type="button"
                                    className="bg-gradient-green inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                  >
                                    <ArrowSmallUpIcon
                                      className="-ml-0.5 h-5 w-5"
                                      aria-hidden="true"
                                    />
                                    $ {closesPrice}
                                  </button>
                                ) : (
                                    <button
                                    type="button"
                                    className="bg-gradient-red inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                  >
                                      <ArrowSmallDownIcon
                                          className="-ml-0.5 h-5 w-5"
                                          aria-hidden="true"
                                      />
                                    $ 0.00
                                  </button>
                                )
                            }
                         
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-white">
                          <dt>Locked Price:</dt>
                          <dd>${lockedPrice}</dd>
                        </div>
                        <div className="mt-1 flex items-center  justify-between text-xs text-white">
                          <dt>Prize Pool:</dt>
                          <dd>{pricePool} XMB</dd>
                        </div>
                      </div>
                    </div>
                    <div className="sc-3a5c8d1f-1 cfWdbc">
                      <div className="sc-b0205416-0 cGCWyQ">
                    {
                        priceUp ? (
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
                                <feFlood floodOpacity={0} result="BackgroundImageFix" />
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
                        ) : (
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
                                fill="#DD0F0D"
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
                        )
                    }

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
                                {valueDown}x
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
    </div>
  );
}

export default LiveCard;
