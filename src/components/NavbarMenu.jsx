import React, { useContext, useEffect, useState } from "react";
import Web3Context from "@/context/Web3Context";
import { Menu, X, LogOut, ChevronDown, Wallet } from "lucide-react";
import { Link } from "react-scroll";
import NextLink from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const NavbarMenu = () => {
  const { accounts, isLoaded, connectWallet, disconnectWallet } = useContext(Web3Context);
  const [isOpen, setIsOpen] = useState(false);
  const [account, setAccount] = useState("0x");
  const [isHovered, setIsHovered] = useState(false);
  const [learnExpanded, setLearnExpanded] = useState(false);
  const [ecosystemExpanded, setEcosystemExpanded] = useState(false);
  const [communityExpanded, setCommunityExpanded] = useState(false);

  // Define menu sections
  const learnSection = [
    { imgSrc: "/icons/token.png", text: "DVV Token", href: "/token", type: "redirect" },
    { imgSrc: "/icons/defi.png", text: "DeFi", href: "/defi", type: "redirect" },
    { imgSrc: "/icons/tokenization.png", text: "Tokenization", href: "/tokenization", type: "redirect" },
  ];

  const ecosystemSection = [
    { imgSrc: "/icons/lend.png", text: "D&V Lend", href: "/lend", type: "redirect" },
    { imgSrc: "/icons/habi.png", text: "Habi", href: "/habi", type: "redirect" },
    { imgSrc: "/icons/card.png", text: "D&V Card", href: "/card", type: "redirect" },
  ];

  const communityLinks = [
    { imgSrc: "/icons/twitter.png", text: "Twitter", href: "https://twitter.com" },
    { imgSrc: "/icons/instagram.png", text: "Instagram", href: "https://instagram.com" },
  ];

  useEffect(() => {
    if (accounts) {
      const start = accounts.slice(0, 4);
      const end = accounts.slice(-4);
      setAccount(`${start}...${end}`);
    }
  }, [accounts]);

  const handleLogout = () => {
    if (disconnectWallet) {
      disconnectWallet();
    }
    setIsOpen(false);
  };

  // Animations variants - Changed to open from right
  const menuVariants = {
    hidden: {
      x: "100%", // Change from -100% to 100% to open from right
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: 20 // Changed from -20 to 20 for right-to-left animation
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  const sectionVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Render section items for learn, ecosystem, etc.
  const renderSectionItems = (items) => {
    return (
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="overflow-hidden pl-2"
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }} // Changed from -20 to 20
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <NextLink
              href={item.href}
              className="flex items-center space-x-5 text-gray-800 p-4 pl-8 rounded-xl hover:bg-black/5 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              {/* Mostramos el ícono directamente sin fondo negro */}
              <div className="w-12 h-12 flex items-center justify-center">
                <img src={item.imgSrc} alt={item.text} className="w-11 h-11" />
              </div>
              <span className="text-lg font-medium">{item.text}</span>
            </NextLink>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <>
      {/* Header Actions Group */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-black/10 backdrop-blur-md z-40 transition-all duration-300">
        {/* Header Actions Group - Positioned absolutely within the header */}
        <div className="absolute top-3 right-4 md:right-8 lg:right-16 z-50 flex items-center gap-4">
          {/* Menu Toggle Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-8 h-8 text-white" />
          </motion.button>

          {/* Connect Wallet Button */}
          {isLoaded ? (
            <motion.div
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-medium shadow-md border border-blue-500/50"
              whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
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
              onClick={connectWallet}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-medium shadow-md border border-blue-500/50"
              whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.98 }}
            >
              <Wallet className="h-4 w-4" />
              <span className="text-sm">Connect Wallet</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Backdrop with blur */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Changed position from left to right */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={{ backgroundImage: `url(/bg-menu.png)` }}
            className="fixed bg-center bg-no-repeat bg-cover top-0 right-0 h-full w-full md:w-96 bg-white/90 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]
            transform z-50 overflow-y-auto"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Close Button */}
            <motion.button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 p-2 hover:bg-black/5 rounded-lg transition-all duration-300" // Changed from right to left
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-8 h-8 text-gray-800" />
            </motion.button>

            {/* Logo */}
            <motion.div 
              className="flex justify-center pt-8 pb-10"
              variants={itemVariants}
            >
              <motion.div className="w-auto h-16 mt-16  ">
                <img src="/logo-black-2.png" alt="Logo" className="w-full h-full object-contain" />
              </motion.div>
            </motion.div>

            {/* Menu Items */}
            <nav className="px-6 space-y-6">
              {/* Learn Section */}
              <motion.div variants={itemVariants}>
                <div 
                  className="flex items-center justify-between text-gray-800 p-3 rounded-xl 
                  hover:bg-black/5 transition-all duration-300 cursor-pointer"
                  onClick={() => setLearnExpanded(!learnExpanded)}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-bold tracking-wider">LEARN</span>
                  </div>
                  <motion.div
                    animate={{ rotate: learnExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-6 h-6" />
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Learn Sub-Items */}
              <AnimatePresence>
                {learnExpanded && renderSectionItems(learnSection)}
              </AnimatePresence>

              {/* Ecosystem Section */}
              <motion.div variants={itemVariants}>
                <div 
                  className="flex items-center justify-between text-gray-800 p-3 rounded-xl 
                  hover:bg-black/5 transition-all duration-300 cursor-pointer"
                  onClick={() => setEcosystemExpanded(!ecosystemExpanded)}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-bold tracking-wider">ECOSYSTEM</span>
                  </div>
                  <motion.div
                    animate={{ rotate: ecosystemExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-6 h-6" />
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Ecosystem Sub-Items */}
              <AnimatePresence>
                {ecosystemExpanded && renderSectionItems(ecosystemSection)}
              </AnimatePresence>

              {/* Community Section */}
              <motion.div variants={itemVariants}>
                <div 
                  className="flex items-center justify-between text-gray-800 p-3 rounded-xl 
                  hover:bg-black/5 transition-all duration-300 cursor-pointer"
                  onClick={() => setCommunityExpanded(!communityExpanded)}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-bold tracking-wider">COMMUNITY</span>
                  </div>
                  <motion.div
                    animate={{ rotate: communityExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-6 h-6" />
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Community Links */}
              <AnimatePresence>
                {communityExpanded && (
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="overflow-hidden"
                  >
                    <div className="flex justify-evenly pt-4">
                      {communityLinks.map((item, index) => (
                        <motion.a
                          key={index}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center p-3 rounded-xl
                          hover:bg-black/5 transition-all duration-300 text-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {/* Usar íconos directamente sin el círculo negro */}
                          <div className="w-14 h-14 flex items-center justify-center mb-2">
                            <img src={item.imgSrc} alt={item.text} className="w-10 h-10" />
                          </div>
                          <span className="text-sm font-medium">{item.text}</span>
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </nav>

            {/* Background blur effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-800/10 to-gray-900/20 backdrop-blur-sm -z-10" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavbarMenu;