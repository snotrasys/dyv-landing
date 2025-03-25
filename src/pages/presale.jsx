
import { Layout } from '@/components/app/Layout';
import PresaleSwap from '@/views/PresaleSwap';
import React, { useEffect } from 'react';
import { SwapProvider } from '@/context/SwapHandle';
import { motion } from 'framer-motion';

function Private() {
  return (
    <Layout>
      <SwapProvider>
        <div className="mx-auto pt-12 px-4 grid max-w-7xl items-center lg:pt-16 lg:grid-cols-2">
          <div className="relative flex flex-col items-center lg:mt-0 mt-20">
            {/* Logo and title with animations */}
            <motion.div 
              className="text-center mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.img 
                src="/logo-text.png" 
                alt="D&V GROUP BLOCKCHAIN" 
                className="h-12 sm:h-16 mb-4 mx-auto"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-blue-400 tracking-tight"
                initial={{ opacity: 0, filter: "blur(8px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                TOKEN PRESALE
              </motion.h1>
              <motion.div 
                className="h-1 w-24 sm:w-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mt-3"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "6rem", opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
            </motion.div>
            
            {/* Token image with glow effect and floating animation */}
            <motion.div
              className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            >
              {/* Glow effect behind token */}
              <motion.div 
                className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              />
              
              {/* Animated circles around token */}
              <div className="absolute inset-0 -z-10">
                {[...Array(3)].map((_, index) => (
                  <motion.div
                    key={`circle-${index}`}
                    className="absolute inset-0 rounded-full border border-blue-500/30"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: [0.8, 1.1, 0.8],
                      opacity: [0, 0.5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 1,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
              
              {/* Token image */}
              <motion.img
                loading="lazy"
                src="/token-destello.png"
                alt="D&V Token"
                className="relative mx-auto z-10 drop-shadow-xl w-full"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 1, 0, -1, 0],
                }}
                transition={{ 
                  y: {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  rotate: {
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                whileHover={{ 
                  scale: 1.03,
                  filter: "drop-shadow(0 0 15px rgba(59, 130, 246, 0.8))"
                }}
              />
              
              {/* Floating particles around token - limited for mobile */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`particle-${i}`}
                    className="absolute rounded-full bg-blue-400"
                    style={{
                      width: `${Math.random() * 3 + 2}px`,
                      height: `${Math.random() * 3 + 2}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      boxShadow: `0 0 ${Math.random() * 4 + 2}px rgba(59, 130, 246, 0.7)`
                    }}
                    animate={{
                      y: [0, Math.random() * -60 - 20],
                      x: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20],
                      opacity: [0, Math.random() * 0.5 + 0.3, 0],
                      scale: [0, Math.random() + 0.8, 0]
                    }}
                    transition={{
                      duration: Math.random() * 3 + 3,
                      repeat: Infinity,
                      delay: Math.random() * 3
                    }}
                  />
                ))}
              </div>
            </motion.div>
            
            {/* Informative text */}
            <motion.p 
              className="text-center text-blue-100 max-w-md mx-auto mt-6 text-sm sm:text-base opacity-80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Secure your participation in our tokenized investment project. 
              Acquire D&V tokens for blockchain, real estate, and renewable energy.
            </motion.p>
          </div>
          
          {/* Swap component */}
          <motion.div 
            className="mb-16 mt-8 sm:mt-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <PresaleSwap />
          </motion.div>
        </div>
      </SwapProvider>
    </Layout>
  );
}

export default Private;