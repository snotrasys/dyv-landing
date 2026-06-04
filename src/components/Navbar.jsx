import { useContext, useEffect, useState } from 'react';
import Web3Context from '../context/Web3Context';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

export default function Navbar() {
  const { accounts, connectWallet } = useContext(Web3Context);
  const [account, setAccount] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (accounts && accounts !== '000000000000000000000000000000000000000000000') {
      const start = accounts.slice(0, 6);
      const end = accounts.slice(-4);
      setAccount(`${start}...${end}`);
    }
  }, [accounts]);

  const buttonVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    tap: { scale: 0.98 }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 bg-gradient-to-r from-[#0d0a1a]/95 to-[#130e2a]/95 backdrop-blur-md border-b border-purple-800/30">
      <div className="max-w-7xl mx-auto flex justify-end items-center">

        {/* Wallet Connection */}
        {accounts !== '000000000000000000000000000000000000000000000' ? (
          <motion.div
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-violet-400 text-white font-medium shadow-md border border-purple-500/50"
          >
            <Wallet className="h-4 w-4" />
            <span className="text-sm">{account}</span>

            {isHovered && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-12 right-0 bg-[#130e2a] border border-purple-800/50 rounded-lg shadow-xl p-3 text-sm text-purple-100"
              >
                <div className="font-medium mb-1">Connected Wallet</div>
                <div className="text-xs text-purple-300/70 truncate max-w-[200px]">{accounts}</div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.button
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            onClick={() => connectWallet()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-violet-400 text-white font-medium shadow-md border border-purple-500/50"
          >
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Connect Wallet</span>
            <span className="sm:hidden">Connect</span>
          </motion.button>
        )}

      </div>
    </nav>
  );
}