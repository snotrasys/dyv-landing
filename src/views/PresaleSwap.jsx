import React, { useState, useContext, useEffect } from 'react';
import Web3Context from '@/context/Web3Context';
import { motion } from 'framer-motion';
import { BigNumber } from 'ethers';
import { useCountdown } from '@/hooks/useCountdown';
import { useSPresale } from '@/context/PresaleHandle';
import { useSwap_ } from '@/context/SwapHandle';
import MultiApproveContext from '@/context/MultiApprove';
import { address } from '@/hooks/useContracts';
import { Wallet, Timer, ArrowRightCircle, DollarSign, BadgeCheck, Gem, ChevronDown, ChevronUp, PieChart, Coins, CheckCircle2, Clock, Globe, User } from 'lucide-react';
import CardRef from './CardRef';
import UsePresaleVesting from '@/hooks/UsePresaleVesting';
import clsx from 'clsx';
import TokenHandle from '@/context/TokenHandle';

function PresaleSwap() {
  const { userData, allData, invest, withdraw,withdrawData } = useSwap_();
  const { accounts, isLoaded, connect } = useContext(Web3Context);
  const { 
    isApprove,
    currentBalance_,
    setchangeToken,
    approveHandlePlus,
    allowanceHandlePlus,
    balanceOfHandlePlus,
    update
  } = useContext(MultiApproveContext);

    const {
   withdrawTokens,
   balanceOf,
  } = useContext(TokenHandle);


  const { timerDays, timerHours, timerMinutes, timerSeconds } = useCountdown([2025, 6, 30, 20]);
  const [amount, setAmount] = useState(50);
  const [recaudacion, setRecaudacion] = useState(0);
  const [showTokenomics, setShowTokenomics] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [percentage, setpercentage] = useState(0);
  const [withdrawPercentage, setWithdrawPercentage] = useState(0); 
  const Presale = UsePresaleVesting();

  // useEffect(() => {
  //   setchangeToken(address.busd);
  // }, []);

  useEffect(() => {
    if (!isLoaded) return;
    allowanceHandlePlus(undefined, address.privateSale);
    balanceOfHandlePlus();
  }, [isLoaded, update]);

  useEffect(() => {
    setRecaudacion(allData?.totalInvested_);
  }, [allData]);
  useEffect(() => {
    if(!isLoaded) return;
    if(userData.tokenAmount==0);
    const percentage = (userData.totalWithdrawn/ Number(userData.tokenAmount) ) * 100 ;
    console.log(percentage, 'percentage');
    setWithdrawPercentage(percentage);
    // setpercentage(percentage);
  }, [userData]);

  useEffect(() => {
    setpercentage(percentage_(Number(recaudacion || 0)));
  }, [recaudacion]);

  function percentage_(input) {
    return (input * 100) / 4000000; // Hardcap is 4,000,000 USDC
  }

  function buyToken(amount_) {
    invest(amount_);
  }

  function calculateTokens(usdcAmount) {
    return usdcAmount * 50;
  }



const tokenData = [
    { amount: "200,000,000", allocation: "Presale (33% monthly vesting)", percentage: "20%" },
    { amount: "300,000,000", allocation: "Ecosystem Development", percentage: "30%" },
    { amount: "200,000,000", allocation: "Staking Rewards", percentage: "20%" },
    { amount: "100,000,000", allocation: "DEX Liquidity", percentage: "10%" },
    { amount: "100,000,000", allocation: "CEX Listings", percentage: "10%" },
    { amount: "50,000,000", allocation: "Marketing", percentage: "5%" },
    { amount: "50,000,000", allocation: "Development", percentage: "5%" }
];



  function isInControlPanel(address) {
    const res = [
  '0x6f939365081E8F97b9E490BF3EDAdb62F2DEC136'
    ].some((item) => item?.toLowerCase() === address?.toLowerCase());
    // console.log('ControlPanel', address, res);
    return res;
  }

  

  return (
    <div className="flex justify-center p-1">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-gradient-to-br from-[#070b28] via-[#0f1a3a] to-[#0a142f] shadow-2xl border border-blue-900/30">
        {/* Header Section */}
        <div className="px-6 py-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <img src="/logo.png" alt="D&V Token" className="h-10 w-10" />
          </div>
          
     
        </div>

        {/* Presale Info Card */}
        <div className="mx-6 mb-6">
          <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-blue-300">Presale Details</h3>
              <Coins className="h-5 w-5 text-blue-400" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-200/70">Price</p>
                <p className="font-medium text-blue-100">0.02 USDC</p>
              </div>
              <div>
                <p className="text-blue-200/70">Network</p>
                <p className="font-medium text-blue-100">BASE</p>
              </div>
              <div>
                <p className="text-blue-200/70">Hard Cap</p>
                <p className="font-medium text-blue-100">4,000,000 USDC</p>
              </div>
              <div>
                <p className="text-blue-200/70">Soft Cap</p>
                <p className="font-medium text-blue-100">100,000 USDC</p>
              </div>
              <div>
                <p className="text-blue-200/70">Min Purchase</p>
                <p className="font-medium text-blue-100">50 USDC</p>
              </div>
              <div>
                <p className="text-blue-200/70">Max Purchase</p>
                <p className="font-medium text-blue-100">2,000 USDC</p>
              </div>
            </div>
          </div>
        </div>

        {/* Token Withdrawal Progress Bar */}
        <div className="mx-6 mb-6">
          <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-semibold text-blue-300">Token Withdrawal Progress</h3>
              <Wallet className="h-5 w-5 text-blue-400" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-blue-300/80">
                <span>Vesting Progress</span>
                <span>{withdrawPercentage}% Released</span>
              </div>
              
              <div className="h-6 overflow-hidden rounded-full bg-[#0a1428] border border-blue-900/30 relative">
                {/* Marcadores en 33% y 66% */}
                <div className="absolute h-full w-px bg-blue-200 left-1/3 z-10"></div>
                <div className="absolute h-full w-px bg-blue-200 left-2/3 z-10"></div>
                
                {/* Pequeños textos encima de los marcadores */}
                <div className="absolute -top-5 left-1/3 transform -translate-x-1/2 text-xs text-blue-300">33%</div>
                <div className="absolute -top-5 left-2/3 transform -translate-x-1/2 text-xs text-blue-300">66%</div>
                
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${withdrawPercentage}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-end relative z-0"
                >
                  {withdrawPercentage > 8 && (
                    <span className="text-xs font-medium text-white mr-2">{withdrawPercentage}%</span>
                  )}
                </motion.div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="rounded-lg bg-blue-900/30 p-3">
                  <div className="text-sm text-blue-300/80">Available for Withdrawn</div>
                  <div className="font-semibold text-blue-100">
                    {userData.currentUserBalance} D&V
                  </div>
                </div>
                
                <div className="rounded-lg bg-blue-900/30 p-3">
                  <div className="text-sm text-blue-300/80">Total Withdraw</div>
                  <div className="font-semibold text-blue-100">
                    {userData.totalWithdrawn} D&V
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards Section */}
        <div className="mx-6 mb-6">
          <div className="rounded-xl bg-blue-900/20 overflow-hidden backdrop-blur-sm">
            <button 
              onClick={() => setShowRewards(!showRewards)}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-blue-400" />
                <span className="font-medium text-blue-100">HISTORICAL REWARDS</span>
              </div>
              {showRewards ? 
                <ChevronUp className="h-5 w-5 text-blue-400" /> : 
                <ChevronDown className="h-5 w-5 text-blue-400" />
              }
            </button>
            
            {showRewards && (
              <div className="px-4 pb-4 space-y-4">
                {/* Historical Rewards - Replicando exactamente la imagen */}
                <div className="bg-[#0a1428] rounded-lg p-4">
                  <div className="mb-2 font-medium text-gray-400">
                    HISTORICAL REWARDS - TOTAL {userData.totalWithdrawn} D&V
                  </div>
                 {withdrawData.length > 0 && withdrawData.map((item, index) => (
                    
                  <div className="mb-2 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-100 font-medium">ID { index +1} -</span>
                      <div className="flex items-center">
                        <div className="h-5 w-5 flex items-center justify-center">
                          <img src="/dyv.png" alt="D&V Token" className="h-5 w-5" />
                        </div>
                        <span className="ml-1 text-blue-100">{item.tokenAmount}</span>
                      </div>
                    </div>
                    <div className="text-gray-400 flex items-center">
                      {item.date}
                      <span className="ml-1 text-blue-500">↗</span>
                    </div>
                  </div>)

                )}
                  
                 
                  
                  
                </div>
                
                
                
                {/* Sección para Historial de Liberación */}
                <div className={clsx(userData?.nextDates.length==0?"hidden":"bg-[#0a1428] rounded-lg p-4",
                )
                }>
                  <div className="mb-2 font-medium text-blue-300 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    HISTORIAL DE LIBERACIÓN
                  </div>
                  
                  <div className="relative mt-6 mb-20">
                    <div className="h-1 bg-blue-900 absolute w-full top-2"></div>
                    
                    {/* Primer punto (33%) */}
                    <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center z-10">
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                      <div className="mt-2 text-xs text-blue-300">{userData?.nextDates[1]}</div>
                      <div className="text-xs text-blue-100">66%</div>
                    </div>
                    
                  
                    
                    {/* Tercer punto (100%) */}
                    <div className="absolute right-0 flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center z-10">
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                      <div className="mt-2 text-xs text-blue-300">[{userData?.nextDates[2]}]</div>
                      <div className="text-xs text-blue-100">100%</div>
                    </div>
                    
                    {/* Punto inicial (0%) */}
                    <div className="absolute left-0 flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center z-10">
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                      <div className="mt-2 text-xs text-blue-300">{userData?.nextDates[0]}</div>
                      <div className="text-xs text-blue-100">33%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 p-6">
          {/* Investment Input */}
          <div className="rounded-xl bg-blue-900/20 p-4 backdrop-blur-sm">
            <label className="mb-2 block text-sm font-medium text-blue-200">
              Investment Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
              <input
                type="number"
                onChange={(e) => {
                  if (e.target.value === '') {
                    setAmount(0);
                  } else if (e.target.value < 1) {
                    setAmount(1);
                  } else if (e.target.value > 2000000000000) {
                    setAmount(20000000000000000);
                  } else {
                    setAmount(Number(e.target.value));
                  }
                }}
                className="w-full rounded-lg border border-blue-800/50 bg-[#0a1428] p-3 pl-10 text-xl text-blue-100 placeholder-blue-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter USDC amount"
              />
            </div>
            <div className="mt-2 text-sm text-blue-300/80">
              Balance: {currentBalance_ || '0'} USDC
            </div>
            <div className="mt-2 text-sm text-blue-300/80">
              You will receive: {calculateTokens(amount).toLocaleString('en-US', {maximumFractionDigits: 0})} D&V
            </div>
                <div className="mt-2 text-sm text-blue-300/80">
             Token test: {balanceOf} D&V
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
  {/* Botón principal de compra/aprobación */}
  {isApprove ? (
    <button
      onClick={() => buyToken(amount)}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 p-3 font-semibold text-white transition-all hover:from-indigo-700 hover:to-blue-600 shadow-lg"
    >
      <ArrowRightCircle className="h-5 w-5" />
      Buy D&V Token
    </button>
  ) : (
    <button
      onClick={() => approveHandlePlus(undefined, address.privateSale)}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 p-3 font-semibold text-white transition-all hover:from-purple-600 hover:to-indigo-600 shadow-lg"
    >
      <BadgeCheck className="h-5 w-5" />
      Approve USDC
    </button>
  )}
  
  {/* Botón de reclamación (destacado) */}
  <button
    onClick={() => withdraw()}
    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 p-3 font-semibold text-white transition-all hover:from-emerald-600 hover:to-teal-600 shadow-md"
  >
    <Wallet className="h-5 w-5" />
    Claim D&V Token
  </button>



    <button
    onClick={() => withdrawTokens()}
    className="hidden flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 p-3 font-semibold text-white transition-all hover:from-emerald-600 hover:to-teal-600 shadow-md"
  >
    <Wallet className="h-5 w-5" />
    Claim D&V Token (TEST)
  </button>

  <CardRef />
  
  {/* Sección de controles administrativos */}
  {
    isInControlPanel(accounts) && (
      <div className="mt-6 pt-4 border-t border-blue-800/30">
      <h4 className="text-sm font-medium text-blue-300 mb-3">Admin Controls</h4>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => Presale.start()}
          className="flex items-center justify-center gap-2 rounded-lg bg-green-900/40 p-3 font-medium text-green-100 transition-all hover:bg-green-800/50 border border-green-700/30"
        >
          <ArrowRightCircle className="h-4 w-4 text-green-400" />
          Start Sales
        </button>
        <button
          onClick={() => Presale.stop()}
          className="flex items-center justify-center gap-2 rounded-lg bg-red-900/40 p-3 font-medium text-red-100 transition-all hover:bg-red-800/50 border border-red-700/30"
        >
          <CheckCircle2 className="h-4 w-4 text-red-400" />
          Stop Sales
        </button>
        <button
          onClick={() => Presale.starTWithDrawHandle()}
          className="flex items-center justify-center gap-2 rounded-lg bg-amber-900/40 p-3 font-medium text-amber-100 transition-all hover:bg-amber-800/50 border border-amber-700/30"
        >
          <DollarSign className="h-4 w-4 text-amber-400" />
          Start Withdrawals
        </button>
        <button
          onClick={() => Presale.stopWithDraw()}
          className="flex items-center justify-center gap-2 rounded-lg bg-orange-900/40 p-3 font-medium text-orange-100 transition-all hover:bg-orange-800/50 border border-orange-700/30"
        >
          <Timer className="h-4 w-4 text-orange-400" />
          Stop Withdrawals
        </button>
        <button
        onClick={() => Presale.Claim()}
        className="flex items-center justify-center gap-2 rounded-lg bg-orange-900/40 p-3 font-medium text-orange-100 transition-all hover:bg-orange-800/50 border border-orange-700/30"
      >
        <Timer className="h-4 w-4 text-orange-400" />
        Claim Fee
      </button>

       <button
        onClick={() => Presale.Claim2()}
        className="flex items-center justify-center gap-2 rounded-lg bg-orange-900/40 p-3 font-medium text-orange-100 transition-all hover:bg-orange-800/50 border border-orange-700/30"
      >
        <Timer className="h-4 w-4 text-orange-400" />
        Claim Fee 2
      </button>
      </div>
    </div>
    )
  }

</div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-blue-900/20 p-4 text-center backdrop-blur-sm">
              <div className="text-sm text-blue-300/80">Your Investment</div>
              <div className="text-lg font-semibold text-blue-100">
                {userData?.invest || '0'} USDC
              </div>
            </div>
            <div className="rounded-xl bg-blue-900/20 p-4 text-center backdrop-blur-sm">
              <div className="text-sm text-blue-300/80">Your Tokens</div>
              <div className="text-lg font-semibold text-blue-100">
           <div className="text-lg font-semibold text-blue-100">
  {userData?.tokenAmount ? 
    Number(userData.tokenAmount > 0 ? userData.tokenAmount : 0)
      .toLocaleString('en-US', {maximumFractionDigits: 0}) : 
    '0'} D&V
</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="rounded-xl bg-blue-900/20 p-4 backdrop-blur-sm">
            <div className="hidden space-y-2">
              <div className="flex justify-between text-sm text-blue-300/80">
                <span>Progress</span>
                <span>{percentage.toFixed(2)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#0a1428]">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg bg-blue-900/30 p-3">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-blue-400" />
                <span className="text-sm text-blue-300/80">Total Raised</span>
              </div>
              <div className="font-semibold text-blue-100">
     {(allData?.totalInvested_ && allData?.totalInvested_ !== 0 
  ? (Number(allData?.totalInvested_) + 105740) 
  : 0
).toLocaleString('en-US', {maximumFractionDigits: 2})} USDC
              </div>
            </div>
          </div>

          {/* Listing Info */}
          <div className="rounded-xl bg-blue-900/20 p-4 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-semibold text-blue-300">Listing Information</h3>
              <Globe className="h-5 w-5 text-blue-400" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-300/80">Listing Price:</span>
                </div>
                <div className="font-semibold text-blue-100">0.033 USDC</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-300/80">Price Increase:</span>
                </div>
                <div className="font-semibold text-blue-100">+65%</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-300/80">Initial Market Cap:</span>
                </div>
                <div className="font-semibold text-blue-100">20,000,000 USDC</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-300/80">DEX:</span>
                </div>
                <div className="font-semibold text-blue-100">Aerodrome & Uniswap</div>
              </div>
            </div>
          </div>



          {/* Tokenomics Section */}
          <div className="rounded-xl bg-blue-900/20 overflow-hidden backdrop-blur-sm">
            <button 
              onClick={() => setShowTokenomics(!showTokenomics)}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-blue-400" />
                <span className="font-medium text-blue-100">TOKENOMICS</span>
              </div>
              {showTokenomics ? 
                <ChevronUp className="h-5 w-5 text-blue-400" /> : 
                <ChevronDown className="h-5 w-5 text-blue-400" />
              }
            </button>
            
            {showTokenomics && (
        <div className="px-4 pb-4 space-y-4">
          <div className="bg-[#0a1428] rounded-lg p-4">
            <h4 className="text-lg font-semibold text-blue-300 mb-3">D&V Token</h4>
            <p className="text-sm text-blue-100 font-semibold mb-1">Total Supply: 1.000.000.000</p>
            <p className="text-xs text-blue-300/80 mb-3">Standard BASE Token</p>
            
            {/* Cabecera responsiva */}
            <div className="grid grid-cols-3 sm:grid-cols-5 text-xs sm:text-sm mb-1">
              <span className="sm:col-span-2 text-blue-300/80">Amount</span>
              <span className="sm:col-span-2 text-blue-300/80">Allocation</span>
              <span className="text-right text-blue-300/80">%</span>
            </div>
            
            {/* Filas de datos */}
            {tokenData.map((row, index) => (
              <div key={index} className="grid grid-cols-3 sm:grid-cols-5 text-xs sm:text-sm py-2 border-t border-blue-900/30">
                <span className="sm:col-span-2 text-blue-100 truncate pr-1">{row.amount}</span>
                <span className="sm:col-span-2 text-blue-200 pr-1">{row.allocation}</span>
                <span className="text-right text-blue-100">{row.percentage}</span>
              </div>
            ))}
          </div>
        </div>
      )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PresaleSwap;
