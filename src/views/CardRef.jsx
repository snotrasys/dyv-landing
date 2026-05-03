import React, { useState, useContext, useEffect } from 'react';
import Web3Context from '@/context/Web3Context';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import { motion, useReducedMotion } from 'framer-motion';
import TonkenContext from '@/context/TokenHandle';
import { Clipboard, Check, Users, TrendingUp, Award } from 'lucide-react';

const dataRef_ = [
  { level: 1, porcentaje: '10%', amount: 0 },
  { level: 2, porcentaje: '5%', amount: 0 },
  { level: 3, porcentaje: '3%', amount: 0 },
  { level: 4, porcentaje: '2%', amount: 0 },
  { level: 5, porcentaje: '2%', amount: 0 },
  { level: 6, porcentaje: '2%', amount: 0 },
  { level: 7, porcentaje: '1%', amount: 0 }
];

function CardRef() {
  const { accounts, isLoaded } = useContext(Web3Context);
  const {
    userData,
    allData,
    invest,
    withdraw,
    reinvestment,
    pool_,
    payBonus
  } = useContext(TonkenContext);
  
  const [amount, setamount] = useState(0.1);
  const [dataRef, setdataRef_] = useState(dataRef_);
  const shouldReduceMotion = useReducedMotion();
  const [copyText, setcopyText] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Fixed Next.js window reference issue by checking if window exists
    if (typeof window !== 'undefined' && isLoaded && accounts) {
      const link = `${window.location.origin}/presale?ref=${accounts}`;
      setcopyText(link);
    }
  }, [accounts, isLoaded]);

  useEffect(() => {
    if (!userData || !isLoaded) return;
    
    let data_ = [...dataRef_];
    data_ = data_.map((item, i) => {
      if (
        userData.referrerCount_?.[i] === undefined ||
        Number(userData.referrerCount_[i]) === 0
      ) return item;
      
      return { ...item, amount: userData.referrerCount_[i] };
    });
    
    setdataRef_(data_);
  }, [userData, isLoaded]);

  // Total de referidos (suma de todos los niveles)
  const totalReferrals = dataRef.reduce((acc, item) => acc + Number(item.amount || 0), 0);

  const onCopy = () => {
    setIsCopied(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  const containerMotion = {
    initial: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 40,
      transition: { duration: 0 },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.5 },
    },
  };

  const cardMotion = {
    initial: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial="initial"
      whileInView="visible"
      variants={containerMotion}
      viewport={{ once: true }}
      id="referral"
      className="py-6"
    >
      <motion.div 
        variants={cardMotion}
        className="max-w-4xl mx-auto  overflow-hidden"
      >
        <div className="p-2 sm:p-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              animate={{ 
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.05, 1, 1.05, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            >
              <Users className="h-7 w-7 text-blue-400" />
            </motion.div>
            <motion.h1 
              className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
              style={{ backgroundSize: "200% auto" }}
            >
              Your Referral Link
            </motion.h1>
          </div>
          
          <p className="text-center text-blue-200/70 text-sm mb-5">
            Share your referral link and earn rewards across 7 levels
          </p>
          
          {/* Referral link box */}
          <div className="relative rounded-lg border border-blue-500/30 bg-gradient-to-br from-blue-900/10 to-blue-800/5 p-1 mb-5">
            <div className="flex overflow-hidden rounded-md bg-[#121c2b] p-2">
              <div className="w-full overflow-x-auto whitespace-nowrap text-blue-100 py-2 px-3 text-sm font-mono">
                {copyText || "Connect your wallet to generate a referral link"}
              </div>
              
              <CopyToClipboard text={copyText} onCopy={onCopy}>
                <motion.button
                  className="ml-2 flex items-center justify-center rounded-md bg-blue-600 px-3 transition-colors hover:bg-blue-700 disabled:opacity-50"
                  disabled={!copyText}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isCopied ? (
                    <Check className="h-5 w-5 text-white" />
                  ) : (
                    <Clipboard className="h-5 w-5 text-white" />
                  )}
                </motion.button>
              </CopyToClipboard>
            </div>
          </div>

          {/* Stats compactos */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-lg bg-blue-900/30 border border-blue-500/20 p-3 flex items-center gap-3">
              <div className="rounded-md bg-blue-500/20 p-2">
                <Users className="h-4 w-4 text-blue-300" />
              </div>
              <div>
                <div className="text-xs text-blue-300/70">Total Referrals</div>
                <div className="text-base font-bold text-blue-100">{totalReferrals}</div>
              </div>
            </div>
            <div className="rounded-lg bg-blue-900/30 border border-blue-500/20 p-3 flex items-center gap-3">
              <div className="rounded-md bg-blue-500/20 p-2">
                <Award className="h-4 w-4 text-blue-300" />
              </div>
              <div>
                <div className="text-xs text-blue-300/70">Levels</div>
                <div className="text-base font-bold text-blue-100">7 Available</div>
              </div>
            </div>
          </div>

          {/* Referral Levels */}
          <div className="rounded-lg bg-blue-900/20 border border-blue-500/20 p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-blue-200">Referral Levels</h3>
              </div>
              <span className="text-xs text-blue-300/70">Bonus per level</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {dataRef.map((item) => (
                <div
                  key={item.level}
                  className="rounded-md bg-[#0a1428] border border-blue-900/40 p-2.5 flex items-center gap-2"
                >
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white">
                    {item.level}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-blue-300/70 leading-tight">
                      Level {item.level}
                    </div>
                    <div className="text-sm font-bold text-blue-100 leading-tight">
                      {item.porcentaje}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-blue-300/70 leading-tight">Refs</div>
                    <div className="text-xs font-semibold text-blue-200 leading-tight">
                      {item.amount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CardRef;