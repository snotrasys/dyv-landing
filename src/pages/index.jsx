import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Footer from "@/views/Footer";

function LandingPage() {
  // State for interactive elements
  const [isHoveredCTA, setIsHoveredCTA] = useState(false);
  const [activeTab, setActiveTab] = useState("mission");
  const [showParticles, setShowParticles] = useState(false);
  
  // Scroll-based animations
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  
  // Show particles after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowParticles(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const childVariants = {
    initial: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const floatingAnimation = {
    hidden: { y: 0 },
    visible: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      }
    }
  };

  const pulseAnimation = {
    hidden: { scale: 1 },
    visible: {
      scale: [1, 1.03, 1],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      }
    }
  };

  const glowAnimation = {
    hidden: { opacity: 0.5 },
    visible: {
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      }
    }
  };

  // Particle effect component
  const Particles = () => {
    // Detect if we're on mobile (used for conditional rendering)
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      // Check initial size
      checkMobile();
      
      // Add event listener for window resize
      window.addEventListener('resize', checkMobile);
      
      // Cleanup
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!showParticles) return null;
    
    return (
      <>
        {/* Main floating particles - responsive count based on device */}
        <div className="absolute inset-0 overflow-hidden -z-5 pointer-events-none">
          {[...Array(isMobile ? 30 : 150)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * (isMobile ? 3 : 6) + (isMobile ? 1 : 3)}px`,
                height: `${Math.random() * (isMobile ? 3 : 6) + (isMobile ? 1 : 3)}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 5 === 0 
                  ? "radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(96, 165, 250, 0.5) 100%)" 
                  : "radial-gradient(circle, rgba(96, 165, 250, 0.9) 0%, rgba(59, 130, 246, 0.5) 100%)",
                boxShadow: i % 5 === 0 
                  ? `0 0 ${isMobile ? '8px' : '15px'} ${isMobile ? '2px' : '5px'} rgba(255, 255, 255, ${isMobile ? '0.3' : '0.6'})`
                  : `0 0 ${isMobile ? '8px' : '15px'} ${isMobile ? '2px' : '5px'} rgba(59, 130, 246, ${isMobile ? '0.3' : '0.6'})`
              }}
              animate={{
                y: [0, Math.random() * (isMobile ? -150 : -300) - (isMobile ? 50 : 100)],
                x: [0, (Math.random() - 0.5) * (isMobile ? 75 : 150)],
                opacity: [0, isMobile ? 0.7 : 0.9, 0],
                scale: [0, isMobile ? 1.1 : 1.2, 0],
              }}
              transition={{
                duration: 6 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Larger particles - only show few on mobile */}
        <div className="absolute inset-0 overflow-hidden -z-5 pointer-events-none">
          {[...Array(isMobile ? 8 : 25)].map((_, i) => (
            <motion.div
              key={`large-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * (isMobile ? 8 : 12) + (isMobile ? 4 : 8)}px`,
                height: `${Math.random() * (isMobile ? 8 : 12) + (isMobile ? 4 : 8)}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: "radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(147, 197, 253, 0.6) 50%, transparent 100%)",
                boxShadow: `0 0 ${isMobile ? '12px' : '25px'} ${isMobile ? '6px' : '15px'} rgba(147, 197, 253, ${isMobile ? '0.4' : '0.7'})`
              }}
              animate={{
                y: [0, Math.random() * (isMobile ? -75 : -150) - (isMobile ? 25 : 50)],
                x: [0, (Math.random() - 0.5) * (isMobile ? 40 : 80)],
                opacity: [0, isMobile ? 0.6 : 0.8, 0],
                scale: [0.2, isMobile ? 1.2 : 1.5, 0.2],
              }}
              transition={{
                duration: 8 + Math.random() * 15,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Connection lines - fewer on mobile */}
        {!isMobile && (
          <svg className="absolute inset-0 w-full h-full -z-6 opacity-30 pointer-events-none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
                <stop offset="50%" stopColor="rgba(59, 130, 246, 0.5)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
              </linearGradient>
            </defs>
            {[...Array(15)].map((_, i) => {
              const x1 = `${Math.random() * 100}%`;
              const y1 = `${Math.random() * 100}%`;
              const x2 = `${Math.random() * 100}%`;
              const y2 = `${Math.random() * 100}%`;
              
              return (
                <motion.line
                  key={`line-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="url(#lineGradient)"
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 0.8, 0],
                    pathLength: [0, 1, 0]
                  }}
                  transition={{
                    duration: 8 + Math.random() * 10,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                  }}
                />
              );
            })}
          </svg>
        )}
      </>
    );
  };


  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-black via-[#050e28] to-black text-white relative overflow-hidden">
        {/* Particles Effect */}
        <Particles />

{/* Additional ambient glowing dots */}
<div className="absolute inset-0 overflow-hidden -z-4 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`glow-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: "radial-gradient(circle, rgba(96, 165, 250, 0.8) 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%)",
                boxShadow: "0 0 15px 5px rgba(59, 130, 246, 0.5)"
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        {/* Abstract circle - Enhanced positioning */}
        <motion.div 
          className="absolute top-0 right-0 -z-5 pointer-events-none"
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{ opacity: 0.8, scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <motion.img 
            src="/circulo.png" 
            className="w-3/4 md:w-1/2 lg:w-full max-w-4xl object-contain"
            alt="Abstract shape" 
            style={{ transform: "translateX(20%) translateY(-15%)" }}
            animate={{
              filter: ["blur(0px)", "blur(1px)", "blur(0px)"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </motion.div>

        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 -z-10 bg-gradient-radial from-blue-900/20 via-transparent to-transparent"
          variants={glowAnimation}
          initial="hidden"
          animate="visible"
        />

        {/* Hero Section */}
        <motion.div
          className="relative"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          style={{ opacity, scale }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-24 lg:flex lg:items-center lg:gap-x-10 lg:px-8">
            {/* Left content area */}
            <motion.div 
              className="mx-auto max-w-2xl mt-20 lg:mx-0 lg:flex-auto z-10 relative"
              initial="initial"
              animate="visible"
              variants={{
                initial: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
              }}
            >
              {/* Logo with glow effect */}
              <motion.div 
                variants={childVariants}
                className="relative"
              >
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur opacity-30"
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                <img 
                  src="/logo-text.png" 
                  alt="D&V GROUP BLOCKCHAIN" 
                  className="relative h-12 sm:h-16 mb-6 sm:mb-8" 
                />
              </motion.div>
              
              {/* Main heading */}
              <motion.div variants={childVariants}>
                <h1 className="text-lg font-bold tracking-tight sm:text-2xl md:text-3xl mb-2 bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent">
                  TRANSFORMING INVESTMENT 
                  <br />
                  AND COMMUNITY DEVELOPMENT WITH
                </h1>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
                  BLOCKCHAIN AND
                  <br />
                  TOKENIZATION
                </h2>
              </motion.div>
              
              {/* Interactive Mission and Vision tabs */}
              <motion.div 
                variants={childVariants}
                className="mt-8 md:mt-12"
              >
                <div className="flex mb-4 border-b border-blue-800/40">
                  <button
                    onClick={() => setActiveTab("mission")}
                    className={`py-2 px-4 font-medium ${
                      activeTab === "mission"
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    MISSION
                  </button>
                  <button
                    onClick={() => setActiveTab("vision")}
                    className={`py-2 px-4 font-medium ${
                      activeTab === "vision"
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    VISION
                  </button>
                </div>
                
                <AnimatePresence mode="wait">
                  {activeTab === "mission" ? (
                    <motion.div
                      key="mission"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-blue-900/30 backdrop-blur-sm p-4 md:p-6 rounded-lg border border-blue-500/30 relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-blue-400/20 rounded-lg blur-xl"
                        animate={{
                          opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      />
                      <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-blue-300 relative">MISSION</h3>
                      <p className="text-xs sm:text-sm md:text-base relative">
                        Promote sustainable community growth through responsible investment and 
                        management practices, strengthening ourselves with the implementation
                        of blockchain technology.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="vision"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-blue-900/30 backdrop-blur-sm p-4 md:p-6 rounded-lg border border-blue-500/30 relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-lg blur-xl"
                        animate={{
                          opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      />
                      <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-blue-300 relative">VISION</h3>
                      <p className="text-xs sm:text-sm md:text-base relative">
                        To be a leading investment firm in the development of local
                        communities, promoting sustainable and innovative projects that
                        generate a positive impact on the economy and social well-being.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Enhanced CTA Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 md:mt-10 flex items-center gap-x-6"
              >
                <motion.a
                  href="/presale"
                  className="relative px-6 md:px-8 py-2 md:py-3 text-lg md:text-xl font-semibold text-black rounded-md overflow-hidden group"
                  onMouseEnter={() => setIsHoveredCTA(true)}
                  onMouseLeave={() => setIsHoveredCTA(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-blue-400 via-white to-blue-300"
                    initial={{ x: "100%" }}
                    animate={{ x: isHoveredCTA ? "0%" : "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.span
                    className="absolute inset-0 bg-white"
                    animate={{ opacity: isHoveredCTA ? 0 : 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative flex items-center">
                    Presale
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      initial={{ x: 0 }}
                      animate={{ x: isHoveredCTA ? 5 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </motion.svg>
                  </span>
                </motion.a>
              </motion.div>
            </motion.div>
            
            {/* Right area with enhanced animated image */}
            <motion.div
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.75 }}
              className="mt-16 lg:mt-0 lg:flex-shrink-0 hidden lg:block z-10 relative"
              variants={floatingAnimation}
            >
              <motion.div
                className="absolute -inset-8 bg-blue-500/10 rounded-full blur-xl"
                variants={pulseAnimation}
                initial="hidden"
                animate="visible"
              />
              <img
                className="w-full max-w-xl mx-auto relative z-10"
                src="/figura-1.png"
                alt="Blockchain Visualization"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Blockchain Integration Section - Enhanced */}
        <section className="min-h-screen relative pt-12 pb-24 overflow-hidden">
          {/* Dynamic background with animated grid */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[#070b28] opacity-90"></div>
            <motion.div
              className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 50,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>

          {/* Animated floating orbs */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-2xl bg-blue-500/10"
              style={{
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 200 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 50 - 25],
                x: [0, Math.random() * 50 - 25],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}

          <div className="relative z-10">
            {/* Heading Section */}
            <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-white">
                  WE INTEGRATE WITH
                </h2>
                <h1 className="text-6xl sm:text-8xl md:text-9xl font-bold mb-10 bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent tracking-tight">
                  THE BLOCKCHAIN
                </h1>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
                className="max-w-4xl mx-auto"
              >
                <p className="text-lg sm:text-xl md:text-2xl text-white mb-12 leading-relaxed">
                  D&V Group Blockchain is taking a leap into the future with D&V 
                  Token, a cryptocurrency designed to revolutionize investing in real 
                  estate, renewable energy, and decentralized financial services. Our 
                  mission is to integrate Web 3.0 into community development and 
                  sustainable investing.
                </p>
              </motion.div>
            </div>

            {/* Token Hologram - Enhanced with 3D effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="w-full max-w-5xl mx-auto px-4 relative"
            >
              <motion.div
                className="absolute inset-0 bg-blue-500/10 rounded-xl blur-2xl"
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <img 
                src="/token.png" 
                alt="D&V Token Visualization" 
                className="w-full relative z-10"
              />
            </motion.div>

            {/* Additional Images with Parallax effect */}
            <div className="space-y-8 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className="w-full max-w-5xl mx-auto px-4 relative"
              >
                <motion.div
                  className="absolute inset-0 -z-1 bg-gradient-to-b from-blue-500/5 to-transparent rounded-xl"
                  whileInView={{ 
                    background: [
                      "linear-gradient(to bottom, rgba(59, 130, 246, 0.05), transparent)",
                      "linear-gradient(to bottom, rgba(59, 130, 246, 0.1), transparent)",
                      "linear-gradient(to bottom, rgba(59, 130, 246, 0.05), transparent)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  viewport={{ once: true }}
                />
                <img 
                  src="/medio.png" 
                  alt="D&V Ecosystem" 
                  className="w-full relative z-10"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="w-full max-w-5xl mx-auto px-4 relative"
              >
                <motion.div
                  className="absolute inset-0 -z-1 bg-gradient-to-b from-blue-500/5 to-transparent rounded-xl"
                  whileInView={{ 
                    background: [
                      "linear-gradient(to bottom, rgba(59, 130, 246, 0.05), transparent)",
                      "linear-gradient(to bottom, rgba(59, 130, 246, 0.1), transparent)",
                      "linear-gradient(to bottom, rgba(59, 130, 246, 0.05), transparent)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  viewport={{ once: true }}
                />
                <img 
                  src="/final.png" 
                  alt="D&V Benefits" 
                  className="w-full relative z-10"
                />
              </motion.div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default LandingPage;