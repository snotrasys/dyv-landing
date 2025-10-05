import React, { useState, useContext, useEffect } from 'react';
import Web3Context from '@/context/Web3Context';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Award, Clock } from 'lucide-react';
import TokenHandle from '@/context/TokenHandle';
import { BigNumber, constants, ethers, utils } from 'ethers';

function StakingComponent() {
  const { accounts, isLoaded, connect } = useContext(Web3Context);

  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
      const {
   getRewardByWallet,
   rewards,
   withdrawRewards,
   userRoi,
  } = useContext(TokenHandle);



  useEffect(() => {
    if (isLoaded && accounts) {
      fetchRewards();
    }
  }, [isLoaded, accounts]);

  const fetchRewards = async () => {
    try {
      setIsLoading(true);
      // Llamar a getRewardByWallet(accounts)
      getRewardByWallet()

      
    } catch (error) {
      console.error('Error fetching rewards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawRewards = async () => {
    try {
      setIsLoading(true);
      await withdrawRewards();
      console.log('Withdrawing rewards...');
      // Después del retiro exitoso, actualizar rewards
      await fetchRewards();
    } catch (error) {
      console.error('Error withdrawing rewards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-gradient-to-br from-[#070b28] via-[#0f1a3a] to-[#0a142f] shadow-2xl border border-blue-900/30">
        {/* Header Section */}
        <div className="px-6 py-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src="/logo.png" alt="D&V Token" className="h-10 w-10" />
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
              D&V Blessing
            </h1>
          </div>
          <p className="text-blue-300/70 text-sm">Earn rewards by holding D&V tokens</p>
        </div>

        {/* Main Content */}
        <div className="space-y-6 p-6">
          {/* Rewards Card */}
          <div className="rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 p-6 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Your Blessings
              </h3>
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            
          <div className="text-center mb-6">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-2">
             {rewards}
              </div>
              <div className="text-blue-300/80 text-sm">D&V Tokens Available</div>
            </div>

            {/* Withdraw Button */}
            <button
              onClick={handleWithdrawRewards}
              disabled={isLoading || rewards === 0}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 p-4 font-semibold text-white transition-all hover:from-emerald-600 hover:to-teal-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wallet className="h-5 w-5" />
              {isLoading ? 'Processing...' : 'Withdraw Rewards'}
            </button>
          </div>

          {/* ROI Info */}
          <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-blue-300">ROI Details</h3>
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-200/70">Daily ROI</p>
                <p className="font-medium text-blue-100 text-xl">1%</p>
              </div>
              <div>
                <p className="text-blue-200/70">Total Blessing</p>
                <p className="font-medium text-blue-100">15.000 DYV</p>
              </div>
                <div>
                <p className="text-blue-200/70">Total Claim</p>
                <p className="font-medium text-blue-100">{userRoi.withdrawn_} DYV</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StakingComponent;


const parse6Decimals = (value) => {
  return Number(ethers.utils.formatUnits(value, 3)).toFixed(4);
};