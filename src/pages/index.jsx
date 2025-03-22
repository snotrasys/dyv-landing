import React, { useState, useEffect, useRef } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  AnimatePresence, 
  useInView,
  useMotionValue,
  useSpring,
  MotionConfig
} from "framer-motion";
import Footer from "@/views/Footer";
import FeatureSections from "@/views/FeaturesSection";
import CardSliderSection from "@/views/CardSliderSection";

function LandingPage() {
  // Detect mobile devices
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

  // Refs for scroll animations - using once:true for better performance
  const heroRef = useRef(null);
  const gradientTextRef = useRef(null);
  const integrationRef = useRef(null);
  
  // Check if elements are in viewport with once:true for better performance
  const heroInView = useInView(heroRef, { once: true, amount: 0.2 });
  const gradientTextInView = useInView(gradientTextRef, { once: true, amount: 0.3 });
  const integrationInView = useInView(integrationRef, { once: true, amount: 0.3 });
  
  // Mouse position for parallax effects - only updated on desktop
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // State for interactive elements
  const [showParticles, setShowParticles] = useState(false);
  const [isHoveredExplore, setIsHoveredExplore] = useState(false);
  const [isHoveredPresale, setIsHoveredPresale] = useState(false);
  
  // Scroll-based animations
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.15], [0, -50]);
  
  // Smooth spring animations with lighter settings for better mobile performance
  const smoothY = useSpring(y, { stiffness: isMobile ? 50 : 100, damping: isMobile ? 15 : 30 });
  const smoothOpacity = useSpring(opacity, { stiffness: isMobile ? 50 : 100, damping: isMobile ? 15 : 30 });
  const smoothScale = useSpring(scale, { stiffness: isMobile ? 50 : 100, damping: isMobile ? 15 : 30 });
  
  // Parallax effect for mouse movement - only on desktop
  const parallaxX = useMotionValue(0);
  const parallaxY = useMotionValue(0);
  
  // Update mouse position for parallax effect - only on desktop
  useEffect(() => {
    if (isMobile) return; // Skip on mobile
    
    let lastTime = 0;
    const throttleMs = 50; // Only update every 50ms for better performance
    
    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastTime < throttleMs) return;
      lastTime = now;
      
      const { clientX, clientY } = e;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calculate position as percentage from center
      const xPos = (clientX - windowWidth / 2) / (windowWidth / 2);
      const yPos = (clientY - windowHeight / 2) / (windowHeight / 2);
      
      setMousePosition({ x: xPos, y: yPos });
      parallaxX.set(xPos * 10); // Reduced from 20px to 10px
      parallaxY.set(yPos * 10); // Reduced from 20px to 10px
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);
  
  // Show particles after a delay - fewer particles on mobile
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowParticles(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Animation variants - simplified for mobile
  const heroVariants = {
    hidden: { opacity: 0, y: isMobile ? 50 : 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile ? 0.7 : 1,
        ease: [0.25, 0.1, 0.25, 1],
        when: "beforeChildren",
        staggerChildren: isMobile ? 0.15 : 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      }
    }
  };

  const childVariants = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? 20 : 50, 
      filter: isMobile ? "blur(2px)" : "blur(5px)" 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { 
        duration: isMobile ? 0.5 : 0.8, 
        ease: [0.25, 0.1, 0.25, 1] 
      } 
    },
    hover: {
      scale: 1.03, // Reduced from 1.05
      transition: { duration: 0.3 }
    }
  };

  // Simpler, more performant animations for mobile
  const floatingAnimation = {
    hidden: { y: 0 },
    visible: {
      y: isMobile ? [0, -5, 0] : [0, -15, 0],
      transition: {
        duration: isMobile ? 4 : 6,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      }
    }
  };

  const pulseAnimation = {
    hidden: { scale: 1, opacity: 0.7 },
    visible: {
      scale: isMobile ? [1, 1.02, 1] : [1, 1.05, 1],
      opacity: [0.7, 0.9, 0.7],
      transition: {
        duration: isMobile ? 3 : 4,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      }
    }
  };

  const glowAnimation = {
    hidden: { opacity: 0.5, filter: "blur(2px)" },
    visible: {
      opacity: [0.5, 0.7, 0.5],
      filter: isMobile ? ["blur(2px)", "blur(5px)", "blur(2px)"] : ["blur(5px)", "blur(15px)", "blur(5px)"],
      transition: {
        duration: isMobile ? 3 : 4,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      }
    }
  };
  
  const gradientTextVariants = {
    hidden: { 
      opacity: 0,
      filter: isMobile ? "blur(3px)" : "blur(10px)",
      y: isMobile ? 20 : 50
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: isMobile ? 0.8 : 1.2,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.08 : 0.12,
        delayChildren: isMobile ? 0.1 : 0.3
      }
    }
  };
  
  const staggerItem = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? 10 : 20, 
      filter: isMobile ? "blur(2px)" : "blur(4px)" 
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { 
        duration: isMobile ? 0.5 : 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };
  
  const buttonHoverVariants = {
    rest: { 
      scale: 1,
      backgroundColor: "rgba(255, 255, 255, 0)",
    },
    hover: { 
      scale: 1.03, // Reduced from 1.05
      backgroundColor: "rgba(255, 255, 255, 1)",
      color: "#000000",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: { 
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  // Optimized particle effect component
  const Particles = () => {
    if (!showParticles) return null;
    
    // Use mouse position to affect particle movement - more subtle on mobile
    const particleEffect = isMobile ? {} : {
      x: mousePosition.x * -2, // Reduced from -5
      y: mousePosition.y * -2  // Reduced from -5
    };
    
    // Reduced particle count on mobile
    const particleCount = isMobile ? 15 : 75; // Reduced from 30/150
    const largeParticleCount = isMobile ? 4 : 12; // Reduced from 8/25
    
    return (
      <>
        {/* Main floating particles - responsive count based on device */}
        <motion.div 
          className="absolute inset-0 overflow-hidden -z-5 pointer-events-none"
          animate={particleEffect}
          transition={{ type: "spring", stiffness: 30, damping: 30 }}
        >
          {[...Array(particleCount)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * (isMobile ? 2 : 4) + (isMobile ? 1 : 2)}px`,
                height: `${Math.random() * (isMobile ? 2 : 4) + (isMobile ? 1 : 2)}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 5 === 0 
                  ? "radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, rgba(96, 165, 250, 0.4) 100%)" 
                  : "radial-gradient(circle, rgba(96, 165, 250, 0.7) 0%, rgba(59, 130, 246, 0.4) 100%)",
                boxShadow: i % 5 === 0 
                  ? `0 0 ${isMobile ? '4px' : '8px'} ${isMobile ? '1px' : '2px'} rgba(255, 255, 255, ${isMobile ? '0.2' : '0.4'})`
                  : `0 0 ${isMobile ? '4px' : '8px'} ${isMobile ? '1px' : '2px'} rgba(59, 130, 246, ${isMobile ? '0.2' : '0.4'})`
              }}
              animate={{
                y: [0, Math.random() * (isMobile ? -50 : -150) - (isMobile ? 25 : 50)],
                x: [0, (Math.random() - 0.5) * (isMobile ? 30 : 75)],
                opacity: [0, isMobile ? 0.5 : 0.7, 0],
                scale: [0, isMobile ? 1.05 : 1.1, 0],
              }}
              transition={{
                duration: 6 + Math.random() * 6, // Reduced from 10
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </motion.div>

        {/* Larger particles - reduced count for better performance */}
        <motion.div 
          className="absolute inset-0 overflow-hidden -z-5 pointer-events-none"
          animate={particleEffect}
          transition={{ type: "spring", stiffness: 25, damping: 25 }}
        >
          {[...Array(largeParticleCount)].map((_, i) => (
            <motion.div
              key={`large-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * (isMobile ? 6 : 10) + (isMobile ? 3 : 6)}px`,
                height: `${Math.random() * (isMobile ? 6 : 10) + (isMobile ? 3 : 6)}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: "radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, rgba(147, 197, 253, 0.5) 50%, transparent 100%)",
                boxShadow: `0 0 ${isMobile ? '8px' : '15px'} ${isMobile ? '3px' : '10px'} rgba(147, 197, 253, ${isMobile ? '0.3' : '0.5'})`
              }}
              animate={{
                y: [0, Math.random() * (isMobile ? -50 : -100) - (isMobile ? 15 : 30)],
                x: [0, (Math.random() - 0.5) * (isMobile ? 20 : 40)],
                opacity: [0, isMobile ? 0.5 : 0.7, 0],
                scale: [0.2, isMobile ? 1.1 : 1.3, 0.2],
              }}
              transition={{
                duration: 7 + Math.random() * 8, // Reduced from 15
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </motion.div>

        {/* Connection lines - only on desktop */}
        {!isMobile && (
          <motion.svg 
            className="absolute inset-0 w-full h-full -z-6 opacity-30 pointer-events-none"
            animate={particleEffect}
            transition={{ type: "spring", stiffness: 20, damping: 20 }}
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
                <stop offset="50%" stopColor="rgba(59, 130, 246, 0.5)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
              </linearGradient>
            </defs>
            {[...Array(8)].map((_, i) => { // Reduced from 15
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
                    opacity: [0, 0.6, 0], // Reduced from 0.8
                    pathLength: [0, 1, 0]
                  }}
                  transition={{
                    duration: 8 + Math.random() * 5, // Reduced from 10
                    repeat: Infinity,
                    delay: Math.random() * 5,
                  }}
                />
              );
            })}
          </motion.svg>
        )}
      </>
    );
  };

  return (
    // Apply MotionConfig to set global reduced motion settings for mobile
    <MotionConfig reducedMotion={isMobile ? "user" : "never"}>
      <MotionConfig>
        <div className="min-h-screen bg-gradient-to-b from-black via-[#050e28] to-black text-white relative overflow-hidden">
          {/* Particles Effect */}
          <Particles />

          <section 
            ref={heroRef}
            className="relative flex flex-col-reverse md:block content-center md:min-h-[70vh] lg:min-h-[90vh]"
          >
            {/* Additional ambient glowing dots - reduced for mobile */}
            <motion.div 
              className="absolute inset-0 overflow-hidden -z-4 pointer-events-none"
              animate={isMobile ? {} : {
                x: mousePosition.x * 5, // Reduced from 15
                y: mousePosition.y * 5  // Reduced from 15
              }}
              transition={{ type: "spring", stiffness: 20, damping: 30 }}
            >
              {[...Array(isMobile ? 5 : 12)].map((_, i) => (
                <motion.div
                  key={`glow-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: `${Math.random() * 6 + 3}px`,
                    height: `${Math.random() * 6 + 3}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: "radial-gradient(circle, rgba(96, 165, 250, 0.6) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 100%)",
                    boxShadow: "0 0 10px 3px rgba(59, 130, 246, 0.3)"
                  }}
                  animate={{
                    opacity: [0.2, 0.6, 0.2],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </motion.div>
            
            {/* Content Overlay - more performant animations */}
            <AnimatePresence>
              {heroInView && (
                <motion.div 
                  className="w-full max-w-7xl mx-auto px-4 md:px-10 relative z-10 pt-40 lg:pt-28 lg:pb-10"
                  variants={heroVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={isMobile ? {} : {
                    opacity: smoothOpacity,
                    scale: smoothScale,
                    y: smoothY
                  }}
                >
                  <motion.div 
                    className="w-full md:w-3/4 lg:w-1/2 lg:pt-32 lg:my-auto"
                    animate={isMobile ? {} : {
                      x: mousePosition.x * -5, // Reduced from -10
                      y: mousePosition.y * -5  // Reduced from -10
                    }}
                    transition={{ type: "spring", stiffness: 30, damping: 30 }}
                  >
                    <motion.div 
                      variants={childVariants}
                      className="relative"
                      whileHover={isMobile ? {} : "hover"}
                    >
                      <motion.div
                        className="absolute -inset-1 rounded-lg blur opacity-20"
                        animate={{
                          opacity: [0.1, 0.25, 0.1],
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
                    
                    <motion.h1 
                      variants={childVariants}
                      className="text-pretty font-bold font-youth text-white text-[3rem] leading-[1] tracking-normal lg:text-[5.125rem] lg:leading-[1] mb-4"
                    >
                      BLOCKCHAIN AND TOKENIZATION
                    </motion.h1>
                    
                    <motion.p 
                      variants={childVariants}
                      className="text-pretty text-white text-[1.0625rem] leading-[2rem] lg:text-2xl lg:leading-[2rem] mb-8"
                    >
                      D&V Group Blockchain is taking a leap into the future with D&V 
                      Token, a cryptocurrency designed to revolutionize investing in 
                      <span className="whitespace-nowrap"> real estate</span>, renewable energy, and 
                      decentralized financial services.
                    </motion.p>
                    
                    <motion.div 
                      variants={childVariants}
                      className="lg:w-10/12 w-full gap-4 md:w-full md:flex md:flex-wrap lg:gap-10"
                    >
                      {/* Presale Button with simpler interaction for mobile */}
                      <motion.a 
                        href="/presale" 
                        className="flex justify-between items-center group py-3 px-0 group relative overflow-hidden transition-all duration-200 hover:px-4 text-white no-underline border-t border-white md:inline-flex mb-4 md:mb-0"
                        onMouseEnter={() => !isMobile && setIsHoveredPresale(true)}
                        onMouseLeave={() => !isMobile && setIsHoveredPresale(false)}
                        whileHover={isMobile ? {} : { paddingLeft: "1rem", paddingRight: "1rem" }}
                        whileTap={isMobile ? {} : { scale: 0.98 }}
                      >
                        <div className="z-0 absolute w-0 h-[200%] top-full left-1/2 -translate-x-1/2 block rounded-full transition-all duration-300 group-hover:top-0 group-hover:w-full group-hover:scale-125 bg-white"></div>
                        <p className="relative z-10 text-xl leading-[1.2] uppercase tracking-wider grow-1 pr-14 group-hover:text-black transition-colors duration-200">
                          Presale
                        </p>
                        <motion.div 
                          className="group transition-colors duration-200 relative overflow-hidden rounded-full h-6 w-6 bg-transparent flex-grow-0 shrink-0"
                          animate={isMobile ? {} : { rotate: isHoveredPresale ? 45 : 135 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="absolute top-0 left-0 h-full w-full transition-transform rotate-[135deg]">
                            <div className="absolute top-0 left-0 h-full w-full transition-all duration-300 group-hover:-top-full">
                              <div className="top-0 left-0 absolute h-full w-full flex justify-center items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" clipRule="evenodd" d="M11.4893 3.10496L4.29687 9.46964L4.95957 10.2185L11.3208 4.58936L11.3208 21.2959L12.3208 21.2959L12.3208 4.58766L18.6848 10.2039L19.3465 9.45408L12.1515 3.10451C11.9623 2.93752 11.6783 2.93772 11.4893 3.10496Z" fill="#FFFFFF" className="group-hover:fill-[#000000] transition duration-300 "/>
                                </svg>
                              </div>
                              <div className="top-full left-0 absolute h-full w-full flex justify-center items-center transition-transform rotate-0">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" clipRule="evenodd" d="M11.4893 3.10496L4.29687 9.46964L4.95957 10.2185L11.3208 4.58936L11.3208 21.2959L12.3208 21.2959L12.3208 4.58766L18.6848 10.2039L19.3465 9.45408L12.1515 3.10451C11.9623 2.93752 11.6783 2.93772 11.4893 3.10496Z" fill="#FFFFFF" className="group-hover:fill-[#000000] transition duration-300 "/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </motion.a>
                      
                      {/* Explore Button with simpler interaction for mobile */}
                      <motion.a 
                        href="#explore-dvg" 
                        className="flex justify-between items-center group py-3 px-0 group relative overflow-hidden transition-all duration-200 hover:px-4 text-white no-underline border-t border-white md:inline-flex"
                        onMouseEnter={() => !isMobile && setIsHoveredExplore(true)}
                        onMouseLeave={() => !isMobile && setIsHoveredExplore(false)}
                        whileHover={isMobile ? {} : { paddingLeft: "1rem", paddingRight: "1rem" }}
                        whileTap={isMobile ? {} : { scale: 0.98 }}
                      >
                        <div className="z-0 absolute w-0 h-[200%] top-full left-1/2 -translate-x-1/2 block rounded-full transition-all duration-300 group-hover:top-0 group-hover:w-full group-hover:scale-125 bg-white"></div>
                        <p className="relative z-10 text-xl leading-[1.2] uppercase tracking-wider grow-1 pr-14 group-hover:text-black transition-colors duration-200">
                          Explore
                        </p>
                        <motion.div 
                          className="group transition-colors duration-200 relative overflow-hidden rounded-full h-6 w-6 bg-transparent flex-grow-0 shrink-0"
                          animate={isMobile ? {} : { rotate: isHoveredExplore ? 45 : 135 }}
                          transition={{ duration: 0.3 }}
                        >
                        <div className="absolute top-0 left-0 h-full w-full transition-transform rotate-[135deg]">
                          <div className="absolute top-0 left-0 h-full w-full transition-all duration-300 group-hover:-top-full">
                            <div className="top-0 left-0 absolute h-full w-full flex justify-center items-center">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M11.4893 3.10496L4.29687 9.46964L4.95957 10.2185L11.3208 4.58936L11.3208 21.2959L12.3208 21.2959L12.3208 4.58766L18.6848 10.2039L19.3465 9.45408L12.1515 3.10451C11.9623 2.93752 11.6783 2.93772 11.4893 3.10496Z" fill="#FFFFFF" className="group-hover:fill-[#000000] transition duration-300 "/>
                              </svg>
                            </div>
                            <div className="top-full left-0 absolute h-full w-full flex justify-center items-center transition-transform rotate-0">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M11.4893 3.10496L4.29687 9.46964L4.95957 10.2185L11.3208 4.58936L11.3208 21.2959L12.3208 21.2959L12.3208 4.58766L18.6848 10.2039L19.3465 9.45408L12.1515 3.10451C11.9623 2.93752 11.6783 2.93772 11.4893 3.10496Z" fill="#FFFFFF" className="group-hover:fill-[#000000] transition duration-300 "/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.a>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Gradient Text Section with staggered reveal */}
        <section 
          ref={gradientTextRef}
          className="py-20 px-4 lg:pt-36 lg:pb-36 overflow-hidden text-white"
        >
          {/* Mobile version (hidden on desktop) */}
          <AnimatePresence>
            {gradientTextInView && (
              <motion.div 
                className="w-full block md:hidden"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.span 
                  className="block relative"
                  variants={staggerItem}
                >
                  <h1 className="text-4xl leading-[1.1] text-center font-bold bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
                    BLOCKCHAIN AND
                  </h1>
                </motion.span>
                <motion.span 
                  className="block relative"
                  variants={staggerItem}
                >
                  <h1 className="text-4xl leading-[1.1] text-center font-bold bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
                    TOKENIZATION
                  </h1>
                </motion.span>
                <motion.span 
                  className="block relative"
                  variants={staggerItem}
                >
                  <h1 className="text-4xl leading-[1.1] text-center font-bold bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
                    TRANSFORMING INVESTMENT
                  </h1>
                </motion.span>
                <motion.span 
                  className="block relative"
                  variants={staggerItem}
                >
                  <h1 className="text-4xl leading-[1.1] text-center font-bold bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
                    AND COMMUNITY DEVELOPMENT.
                  </h1>
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop version (hidden on mobile) */}
          <AnimatePresence>
            {gradientTextInView && (
              <motion.div 
                className="w-full hidden md:block"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                >
                  <motion.span 
                    className="block relative"
                    variants={staggerItem}
                  >
                    <h1 className="text-5xl lg:text-7xl leading-[1.1] text-center font-bold bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
                      BLOCKCHAIN AND TOKENIZATION
                    </h1>
                  </motion.span>
                  <motion.span 
                    className="block relative"
                    variants={staggerItem}
                  >
                    <h1 className="text-5xl lg:text-7xl leading-[1.1] text-center font-bold bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
                      TRANSFORMING INVESTMENT AND
                    </h1>
                  </motion.span>
                  <motion.span 
                    className="block relative"
                    variants={staggerItem}
                  >
                    <h1 className="text-5xl lg:text-7xl leading-[1.1] text-center font-bold bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
                      COMMUNITY DEVELOPMENT.
                    </h1>
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
  
          {/* Feature Sections */}
          <FeatureSections />
  
          {/* Card Slider Section */}
          <CardSliderSection />
  
          {/* Blockchain Integration Section with advanced animations */}
          <section
            ref={integrationRef}
            className="min-h-screen relative pt-12 mt-20 pb-24 overflow-hidden"
          >
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
  
            {/* Animated floating orbs with mouse interaction */}
            <motion.div
              className="absolute inset-0 overflow-hidden -z-9 pointer-events-none"
              animate={{
                x: mousePosition.x * 10, 
                y: mousePosition.y * 10
              }}
              transition={{ type: "spring", stiffness: 20, damping: 25 }}
            >
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
            </motion.div>
  
            <AnimatePresence>
              {integrationInView && (
                <motion.div 
                  className="relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  {/* Heading Section */}
                  <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      <motion.h2 
                        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-white"
                        initial={{ filter: "blur(10px)" }}
                        animate={{ filter: "blur(0px)" }}
                        transition={{ duration: 1.2 }}
                      >
                        WE INTEGRATE WITH
                      </motion.h2>
                      <motion.h1 
                        className="text-6xl sm:text-8xl md:text-9xl font-bold mb-10 bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent tracking-tight"
                        initial={{ opacity: 0, scale: 0.8, filter: "blur(15px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                      >
                        THE BLOCKCHAIN
                      </motion.h1>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
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
  
                  {/* Token Hologram with 3D effect and mouse interaction */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, delay: 0.8, type: "spring" }}
                    className="w-full max-w-5xl mx-auto px-4 relative"
                    style={{
                      perspective: "1000px"
                    }}
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
                    <motion.div
                      animate={{
                        rotateY: mousePosition.x * 10,
                        rotateX: mousePosition.y * -10
                      }}
                      transition={{ type: "spring", stiffness: 50, damping: 20 }}
                      className="relative z-10"
                    >
                      <motion.img 
                        src="/token.png" 
                        alt="D&V Token Visualization" 
                        className="w-full"
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
  
          {/* Abstract circle with enhanced parallax effect */}
          <motion.div 
            className="absolute top-0 right-0 -z-5 pointer-events-none"
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 0.8, scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              x: parallaxX,
              y: parallaxY
            }}
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
        </div>
        <Footer />
        </MotionConfig>
      </MotionConfig>
    );
  }
  
  export default LandingPage;