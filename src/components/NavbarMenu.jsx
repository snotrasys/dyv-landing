import React, { useContext, useEffect, useState } from "react";
import Web3Context from "@/context/Web3Context";
import { Menu, X as XIcon, LogOut, ChevronDown, Wallet } from "lucide-react";
import { Link } from "react-scroll";
import NextLink from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const NavbarMenu = () => {
  const { accounts, isLoaded, connectWallet } = useContext(Web3Context);
  const [isOpen, setIsOpen] = useState(false);
  const [account, setAccount] = useState("0x");
  const [isHovered, setIsHovered] = useState(false);
  const [learnExpanded, setLearnExpanded] = useState(false);
  const [ecosystemExpanded, setEcosystemExpanded] = useState(false);
  const [communityExpanded, setCommunityExpanded] = useState(false);

  // Define menu sections
  const learnSection = [
    { imgSrc: "/icons/token.png", text: "Presale D&V", href: "/presale", type: "redirect" },
    { imgSrc: "/icons/whitepaper.png", text: "Whitepaper", href: "https://Docs.dyvgroup.io" , type: "redirect" },
    { imgSrc: "/icons/roadmap.png", text: "Roadmap", href: "/roadmap", type: "redirect" },
  
  ];

  const ecosystemSection = [
    { imgSrc: "/icons/card.png", text: "D&V Card", href: "https://card.dyvgroup.io/", type: "redirect" },
    { imgSrc: "/icons/habi.png", text: "Habi", href: "https://habi.dyvgroup.io/", type: "redirect" },
    { imgSrc: "/icons/solar.png", text: "Solar", href: "/", type: "redirect", comingSoon: true },
    { imgSrc: "/icons/lend.png", text: "D&V Lend", href: "/lend", type: "redirect", comingSoon: true },
  ];

  // Updated community links to use custom SVG icons
  const communityLinks = [
    { 
      icon: (
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg">
          <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
        </svg>
      ), 
      text: "X", 
      href: "https://x.com/dyvgroup"
    },
    { 
      icon: (
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg">
          <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"></path>
        </svg>
      ), 
      text: "Discord", 
      href: "https://discord.gg/3B9gdBKz"
    },
  ];

  useEffect(() => {
    if (accounts) {
      const start = accounts.slice(0, 4);
      const end = accounts.slice(-4);
      setAccount(`${start}...${end}`);
    }
  }, [accounts]);

  const handleLogout = () => {

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
              <div>
              <span className="text-lg font-medium">{item.text}</span>
              {item.comingSoon && (
                <div className="text-xs font-medium text-blue-600 bg-black rounded-lg p-2 mt-1">Coming soon</div>
              )}
            </div>
              
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
          {accounts !== null ? (
            <motion.div
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-medium shadow-md border border-blue-500/50"
              whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => {
                connectWallet();
              }}
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
            onClick={() => {
              connectWallet();
            }}
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
              <XIcon className="w-8 h-8 text-gray-800" />
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
              
              {/* Community Links - Updated to use custom SVG icons */}
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
                      {communityLinks.map((item, index) => {
                        return (
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
                            {/* Use custom SVG icons with black background and white text */}
                            <div className="w-14 h-14 flex items-center justify-center mb-2 rounded-full bg-black text-white">
                              {item.icon}
                            </div>
                            <span className="text-sm font-medium">{item.text}</span>
                            
                          </motion.a>
                        );
                      })}
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
