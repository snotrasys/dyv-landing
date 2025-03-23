import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Target, Building, BarChart3, FileText, Landmark, Lightbulb, Sparkles, Leaf, Shield } from 'lucide-react';

const FeatureSections = () => {
  // Detect if we're on mobile
  const [isMobile, setIsMobile] = useState(false);
  // Track video loading states
  const [videosLoaded, setVideosLoaded] = useState({
    video1: false,
    video2: false,
    video3: false
  });
  
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

  // Refs for each section to detect when in view
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const video3Ref = useRef(null);
  
  // Check if sections are in viewport
  const section1InView = useInView(section1Ref, { once: true, amount: 0.1 });
  const section2InView = useInView(section2Ref, { once: true, amount: 0.1 });
  const section3InView = useInView(section3Ref, { once: true, amount: 0.1 });

  // Handle video loading events
  const handleVideoLoad = (videoName) => {
    setVideosLoaded(prev => ({...prev, [videoName]: true}));
  };

  // Handle video play errors
  useEffect(() => {
    const handleVideoError = (videoRef, videoName) => {
      if (videoRef.current) {
        videoRef.current.addEventListener('error', () => {
          console.error(`Error loading ${videoName}`);
          // You could set a fallback image here
        });
        
        // Try to play the video with a retry mechanism
        const attemptPlay = () => {
          videoRef.current.play().catch(error => {
            console.warn(`Error playing ${videoName}:`, error);
            // Retry after a short delay (autoplay might be blocked by browser)
            setTimeout(attemptPlay, 1000);
          });
        };
        
        // Start play attempts when the video is in view
        if ((videoName === 'video1' && section1InView) ||
            (videoName === 'video2' && section2InView) ||
            (videoName === 'video3' && section3InView)) {
          attemptPlay();
        }
      }
    };
    
    handleVideoError(video1Ref, 'video1');
    handleVideoError(video2Ref, 'video2');
    handleVideoError(video3Ref, 'video3');
  }, [section1InView, section2InView, section3InView]);

  // Animation variants - simplified for mobile
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: isMobile ? 0.1 : 0.2,
        duration: isMobile ? 0.5 : 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: isMobile ? 15 : 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: isMobile ? 0.4 : 0.6
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: isMobile ? 0.5 : 0.8,
        ease: "easeOut"
      }
    }
  };

  // Simpler floating animation for mobile
  const floatingAnimation = {
    animate: {
      y: isMobile ? [0, -5, 0] : [0, -10, 0],
      transition: {
        duration: isMobile ? 3 : 5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  // Simpler button hover for mobile
  const buttonHoverVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: isMobile ? 1.02 : 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="bg-black text-white" id="explore-dvgroup">
      <div className="w-full max-w-[1408px] mx-auto">
        {/* First Section: Mission & Vision - Image on right */}
        <motion.div 
          ref={section1Ref}
          className="w-full lg:flex lg:place-items-stretch lg:flex-row-reverse"
          variants={containerVariants}
          initial="hidden"
          animate={section1InView ? "visible" : "hidden"}
        >
          {/* Image container - Right side */}
          <motion.div 
            className="block relative w-full h-[50vh] md:h-[60vh] lg:h-auto bg-slate-900 overflow-hidden lg:w-1/2 lg:overflow-visible"
            variants={imageVariants}
          >
            <motion.div 
              className="h-full w-full md:absolute md:top-0 md:left-0 md:h-full md:w-full lg:w-[44vw]"
            >
              <div className="h-full w-full absolute block top-0 left-0">
                {/* Video loading placeholder */}
                {!videosLoaded.video1 && (
                  <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                
                <div className="video-player relative h-full w-full">
                  <video 
                    ref={video1Ref}
                    src="/CE_BLOB.mp4" 
                    className="w-full h-full object-cover"
                    preload="auto" 
                    muted
                    playsInline 
                    autoPlay 
                    loop
                    onLoadedData={() => handleVideoLoad('video1')}
                  />

    
                  {/* Directional overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent lg:bg-gradient-to-l"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content - Left side */}
          <div className="w-full lg:w-1/2 px-4 py-10 lg:py-24 xl:py-44 lg:px-20 xl:px-32">
            <motion.div 
              className="w-full flex items-center mb-8"
              variants={itemVariants}
            >
              <Target className="h-8 w-8 text-blue-400 mr-3" />
              <h2 className="font-bold text-4xl leading-[1.2] lg:text-[2.5rem] lg:leading-tight text-white">
                Our Purpose
              </h2>
            </motion.div>

            <motion.div 
              className="mb-8 space-y-6"
              variants={itemVariants}
            >
              <div className="bg-blue-900/30 backdrop-blur-sm p-4 md:p-6 rounded-lg border border-blue-500/30">
                <motion.h3 
                  className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-blue-300"
                  whileHover={isMobile ? {} : { x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  VISION
                </motion.h3>
                <motion.p 
                  className="text-sm md:text-base text-gray-300"
                  initial={{ opacity: 0.9 }}
                  whileHover={isMobile ? {} : { opacity: 1 }}
                >
                  To be a leading investment firm in the development of local
                  communities, promoting sustainable and innovative projects that
                  generate a positive impact on the economy and social well-being.
                </motion.p>
              </div>
              
              <div className="bg-blue-900/30 backdrop-blur-sm p-4 md:p-6 rounded-lg border border-blue-500/30">
                <motion.h3 
                  className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-blue-300"
                  whileHover={isMobile ? {} : { x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  MISSION
                </motion.h3>
                <motion.p 
                  className="text-sm md:text-base text-gray-300"
                  initial={{ opacity: 0.9 }}
                  whileHover={isMobile ? {} : { opacity: 1 }}
                >
                  Promote sustainable community growth through responsible investment and 
                  management practices, strengthening ourselves with the implementation
                  of blockchain technology.
                </motion.p>
              </div>
              
              <div className="mt-6 space-y-3">
                <motion.div 
                  className="flex items-start"
                  whileHover={isMobile ? {} : { x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sparkles className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-200">Innovative blockchain solutions for real-world investment challenges</span>
                </motion.div>
                <motion.div 
                  className="flex items-start"
                  whileHover={isMobile ? {} : { x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Shield className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-200">Commitment to security, transparency, and sustainable growth</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Buttons with animation */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              <motion.a 
                target="_self" 
                className="group relative leading-none text-center uppercase rounded-full block no-underline transform transition-all duration-150 text-xs px-5 py-3 bg-blue-600 text-white border-blue-600 hover:text-blue-800 hover:border-blue-600 transition-all duration-300 border inline-block group" 
                href="/about"
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <div className="absolute w-1/2 h-full top-full left-1/2 -translate-x-1/2 block rounded-full transition-all duration-200 group-hover:top-0 group-hover:w-full group-hover:scale-125 bg-white"></div>
                </div>
                <div className="relative z-10">Learn More</div>
              </motion.a>
              <motion.a 
                target="_self" 
                className="group relative block leading-none text-center uppercase rounded-full block no-underline transform transition-all duration-150 text-xs px-5 py-3 text-white border-white hover:text-blue-900 transition-all duration-300 border inline-block group" 
                href="/team"
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <div className="absolute w-1/2 h-full top-full left-1/2 -translate-x-1/2 block rounded-full transition-all duration-200 group-hover:top-0 group-hover:w-full group-hover:scale-125 bg-blue-400"></div>
                </div>
                <div className="relative z-10">Our Team</div>
              </motion.a>
            </motion.div>
          </div>
        </motion.div>

        {/* Second Section: Real Estate Projects - Image on left */}
        <motion.div 
          ref={section2Ref}
          className="w-full lg:flex lg:place-items-stretch lg:flex-row"
          variants={containerVariants}
          initial="hidden"
          animate={section2InView ? "visible" : "hidden"}
        >
          {/* Image container - Left side */}
          <motion.div 
            className="block relative w-full h-[50vh] md:h-[60vh] lg:h-auto bg-slate-900 overflow-hidden lg:w-1/2 lg:overflow-visible"
            variants={imageVariants}
          >
            <motion.div 
              className="h-full w-full md:absolute md:top-0 md:right-0 md:h-full md:w-full lg:w-[41vw]"
              {...floatingAnimation}
            >
              <div className="h-full w-full absolute block top-0 left-0">
                {/* Video loading placeholder */}
                {!videosLoaded.video2 && (
                  <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                
                <div className="video-player relative h-full w-full">
                  <video 
                    ref={video2Ref}
                    src="/CE_Under.mp4" 
                    className="w-full h-full object-cover"
                    preload="auto" 
                    muted
                    playsInline 
                    autoPlay 
                    loop
                    onLoadedData={() => handleVideoLoad('video2')}
                  />
                  
           
                  {/* Directional overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-l from-black/80 to-transparent lg:bg-gradient-to-r"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content - Right side */}
          <div className="w-full lg:w-1/2 px-4 py-10 lg:py-24 xl:py-44 lg:px-20 xl:px-32">
            <motion.div 
              className="w-full flex items-center mb-8"
              variants={itemVariants}
            >
              <Building className="h-8 w-8 text-blue-400 mr-3" />
              <h2 className="font-bold text-4xl leading-[1.2] lg:text-[2.5rem] lg:leading-tight text-white">
                Real Estate Integration
              </h2>
            </motion.div>
            <motion.div 
              className="mb-8"
              variants={itemVariants}
            >
              <motion.p 
                className="text-pretty text-[1.0625rem] leading-[1.647] mb-3 text-gray-300"
                whileHover={isMobile ? {} : { x: 5 }}
                transition={{ duration: 0.2 }}
              >
                Our blockchain platform brings innovative solutions to real estate investments, enabling fractional ownership through tokenization and creating new opportunities for communities to invest in local development.
              </motion.p>
              <motion.p 
                className="text-pretty text-[1.0625rem] leading-[1.647] mb-3 text-gray-300"
                whileHover={isMobile ? {} : { x: 5 }}
                transition={{ duration: 0.2 }}
              >
                Ownership records, transaction history, and property details are all secured on the blockchain, providing unprecedented transparency and security for all stakeholders.
              </motion.p>
              
              <div className="mt-6 space-y-3">
                <motion.div 
                  className="flex items-start"
                  whileHover={isMobile ? {} : { x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Landmark className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-200">Tokenized real estate assets for fractional ownership</span>
                </motion.div>
                <motion.div 
                  className="flex items-start"
                  whileHover={isMobile ? {} : { x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Shield className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-200">Transparent and immutable property records on blockchain</span>
                </motion.div>
              </div>
            </motion.div>
            {/* Buttons */}
            <motion.a 
              target="_self" 
              className="group relative leading-none text-center uppercase rounded-full block no-underline transform transition-all duration-150 text-xs px-5 py-3 bg-blue-600 text-white border-blue-600 hover:text-blue-800 hover:border-blue-600 transition-all duration-300 border inline-block mr-3 mb-3 group" 
              href="/real-estate"
              variants={buttonHoverVariants}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="absolute w-1/2 h-full top-full left-1/2 -translate-x-1/2 block rounded-full transition-all duration-200 group-hover:top-0 group-hover:w-full group-hover:scale-125 bg-white"></div>
              </div>
              <div className="relative z-10">Explore Projects</div>
            </motion.a>
          </div>
        </motion.div>

        {/* Third Section: Future Initiatives - Image on right */}
        <motion.div 
          ref={section3Ref}
          className="w-full lg:flex lg:place-items-stretch lg:flex-row-reverse"
          variants={containerVariants}
          initial="hidden"
          animate={section3InView ? "visible" : "hidden"}
        >
          {/* Image container - Right side */}
          <motion.div 
            className="block relative w-full h-[50vh] md:h-[60vh] lg:h-auto bg-slate-900 overflow-hidden lg:w-1/2 lg:overflow-visible"
            variants={imageVariants}
          >
            <motion.div 
              className="h-full w-full md:absolute md:top-0 md:left-0 md:h-full md:w-full lg:w-[41vw]"
              {...floatingAnimation}
            >
              <div className="h-full w-full absolute block top-0 left-0">
                {/* Video loading placeholder */}
                {!videosLoaded.video3 && (
                  <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                
                <div className="video-player relative h-full w-full">
                  <video 
                    ref={video3Ref}
                    src="/CE_ACCESS_new.mp4" 
                    className="w-full h-full object-cover"
                    preload="auto" 
                    muted
                    playsInline 
                    autoPlay 
                    loop
                    onLoadedData={() => handleVideoLoad('video3')}
                  />
                  
     
                  
                  {/* Directional overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent lg:bg-gradient-to-l"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content - Left side */}
          <div className="w-full lg:w-1/2 px-4 py-10 lg:py-24 xl:py-44 lg:px-20 xl:px-32">
            <motion.div 
              className="w-full flex items-center mb-8"
              variants={itemVariants}
            >
              <Lightbulb className="h-8 w-8 text-blue-400 mr-3" />
              <h2 className="font-bold text-4xl leading-[1.2] lg:text-[2.5rem] lg:leading-tight text-white">
                Future Initiatives
              </h2>
            </motion.div>
            <motion.div 
              className="mb-8"
              variants={itemVariants}
            >
              <motion.p 
                className="text-pretty text-[1.0625rem] leading-[1.647] mb-3 text-gray-300"
                whileHover={isMobile ? {} : { x: 5 }}
                transition={{ duration: 0.2 }}
              >
                Our roadmap extends beyond current offerings with ambitious plans to revolutionize renewable energy investments, community development programs, and decentralized financial services.
              </motion.p>
              <motion.p 
                className="text-pretty text-[1.0625rem] leading-[1.647] mb-3 text-gray-300"
                whileHover={isMobile ? {} : { x: 5 }}
                transition={{ duration: 0.2 }}
              >
                D&V Group Blockchain is committed to building a comprehensive ecosystem that empowers communities, delivers sustainable solutions, and creates meaningful economic opportunities through blockchain technology.
              </motion.p>
              
              <div className="mt-6 space-y-3">
                <motion.div 
                  className="flex items-start"
                  whileHover={isMobile ? {} : { x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Leaf className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-200">Renewable energy project funding and tokenization</span>
                </motion.div>
                <motion.div 
                  className="flex items-start"
                  whileHover={isMobile ? {} : { x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <BarChart3 className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-200">Advanced DeFi services for community economic development</span>
                </motion.div>
              </div>
            </motion.div>
            {/* Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              <motion.a 
                target="_self" 
                className="group relative leading-none text-center uppercase rounded-full block no-underline transform transition-all duration-150 text-xs px-5 py-3 bg-blue-600 text-white border-blue-600 hover:text-blue-800 hover:border-blue-600 transition-all duration-300 border inline-block group" 
                href="/roadmap"
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <div className="absolute w-1/2 h-full top-full left-1/2 -translate-x-1/2 block rounded-full transition-all duration-200 group-hover:top-0 group-hover:w-full group-hover:scale-125 bg-white"></div>
                </div>
                <div className="relative z-10">View Roadmap</div>
              </motion.a>
              <motion.a 
                target="_self" 
                className="group relative block leading-none text-center uppercase rounded-full block no-underline transform transition-all duration-150 text-xs px-5 py-3 text-white border-white hover:text-blue-900 transition-all duration-300 border inline-block group" 
                href="/whitepaper"
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <div className="absolute w-1/2 h-full top-full left-1/2 -translate-x-1/2 block rounded-full transition-all duration-200 group-hover:top-0 group-hover:w-full group-hover:scale-125 bg-blue-400"></div>
                </div>
                <div className="relative z-10 flex items-center justify-center">
                  <FileText className="h-4 w-4 mr-1" />
                  <span>Whitepaper</span>
                </div>
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSections;