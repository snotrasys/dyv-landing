import React from "react";

function LaterCard({
    numberSerie = 0,
    entryTime = `0:00`,

}) {
  return       <figure className="__slide w-[80vw] shrink-0  sm:p-10 md:w-[43vw] xl:w-[30rem]">
  <div className="relative">
    <div className="  relative overflow-hidden rounded-lg bg-gradient-to-b from-gray-400 to-purple-700 px-px pb-[3px] pt-px text-slate-500">
      <div className="sc-3a5c8d1f-1 sc-69ac18f9-1 glwDJB gzciwb">
        <div className="sc-b1def301-0 fHGznP">
          <div className="sc-3a5c8d1f-1 sc-32d5f017-0 glwDJB chfQFH text-white">
            <svg
              viewBox="0 0 24 24"
              width="21px"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
              className="sc-231a1e38-0 mr-2"
            >
              <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7.75C12.5 7.33579 12.1642 7 11.75 7C11.3358 7 11 7.33579 11 7.75V13L15.5537 15.8022C15.9106 16.0219 16.3781 15.9106 16.5978 15.5537C16.8192 15.1938 16.7041 14.7225 16.3419 14.5051L12.5 12.2V7.75Z"></path>
            </svg>
            <div
              color="textDisabled"
              fontSize="16px"
              className="sc-daa4d312-0 ipHAGF"
            >
              Later
            </div>
          </div>
          <div className="sc-b1def301-1 ggUjvU">
            <div
              fontSize="12px"
              color="textDisabled"
              className="sc-daa4d312-0 jeXusl"
            >
              # {numberSerie}
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
              <div className="sc-b0205416-1 giGtSP cursor-pointer text-white">
                <div
                  fontSize="20px"
                  color="success"
                  className="sc-daa4d312-0 cKWrye"
                >
                  Up
                </div>
               
              </div>
            </div>
          </div>
          <div className="sc-3a5c8d1f-1 sc-8d651315-0 glwDJB rounded-lg bg-white">
            <div className="sc-8d651315-1 dztVmP">
              <div className="py-5 text-center">
                <h1 className="text-xl font-black text-[#989898]">
                  ENTRY STARTS
                </h1>
                <h1 className="text-xl font-black text-[#989898]">
                  ~{entryTime}
                </h1>
              </div>
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
</figure>;
}

export default LaterCard;
