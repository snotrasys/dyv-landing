import { useContext, useEffect, useState } from 'react';
import Web3Context from '../context/Web3Context';
import { motion } from 'framer-motion';
import { Wallet, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { accounts, connect } = useContext(Web3Context);
  const [account, setAccount] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (accounts && accounts !== '000000000000000000000000000000000000000000000') {
      const start = accounts.slice(0, 6);
      const end = accounts.slice(-4);
      setAccount(`${start}...${end}`);
    }
  }, [accounts]);

  const buttonVariants = {
    initial: { 
      opacity: 0, 
      y: -20 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: { 
      scale: 0.98
    }
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Presale', href: '/presale' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 bg-gradient-to-r from-[#070b28]/95 to-[#0f1a3a]/95 backdrop-blur-md border-b border-blue-800/30">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <img src='/logo.png' className='h-10 w-auto' alt="D&V Group" />
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium"
            >
              {item.name}
            </motion.a>
          ))}
        </div>

        {/* Wallet Connection */}
        <div className="flex items-center gap-4">
          {accounts !== '000000000000000000000000000000000000000000000' ? (
            <motion.div
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-medium shadow-md border border-blue-500/50"
            >
              <Wallet className="h-4 w-4" />
              <span className="text-sm">{account}</span>

              
              {isHovered && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-16 right-6 bg-[#0f1a3a] border border-blue-800/50 rounded-lg shadow-xl p-3 text-sm text-blue-100"
                >
                  <div className="font-medium mb-1">Connected Wallet</div>
                  <div className="text-xs text-blue-300/70 truncate max-w-[200px]">{accounts}</div>
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
              onClick={() => connect()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-medium shadow-md border border-blue-500/50"
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Connect Wallet</span>
              <span className="sm:hidden">Connect</span>
            </motion.button>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-300 hover:text-blue-400 focus:outline-none"
            >
              {isMenuOpen ? 
                <X className="h-6 w-6" /> : 
                <Menu className="h-6 w-6" />
              }
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden mt-4 pb-4 space-y-3"
        >
          {navItems.map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.05 * index }}
              className="block py-2 px-4 text-gray-300 hover:bg-blue-900/20 hover:text-blue-400 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </motion.a>
          ))}
        </motion.div>
      )}
    </nav>
  );
}