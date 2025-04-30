import React, { useState, useContext, useEffect } from 'react';
import Web3Context from '@/context/Web3Context';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import { motion, useReducedMotion } from 'framer-motion';
import TonkenContext from '@/context/TokenHandle';
import { Clipboard, Check, Users } from 'lucide-react';

const dataRef_ = [
  { level: 1, porcentaje: '7%', amount: 0 },
  { level: 2, porcentaje: '3.5%', amount: 0 },
  { level: 3, porcentaje: '1.5%', amount: 0 },
  { level: 4, porcentaje: '0.5%', amount: 0 },
  { level: 5, porcentaje: '0.3%', amount: 0 },
  { level: 6, porcentaje: '0.2%', amount: 0 }
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
        <div className="p-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              animate={{ 
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.05, 1, 1.05, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            >
              <Users className="h-8 w-8 text-blue-400" />
            </motion.div>
            <motion.h1 
              className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
              style={{ backgroundSize: "200% auto" }}
            >
              Your Referral Link
            </motion.h1>
          </div>
          
          <p className="text-center text-blue-200/70 mb-6">
            Share your referral link and earn rewards when people join through it
          </p>
          
          <div className="relative rounded-lg border border-blue-500/30 bg-gradient-to-br from-blue-900/10 to-blue-800/5 p-1 mb-6">
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
          
       
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CardRef;