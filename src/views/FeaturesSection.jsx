import React from "react";
import { motion } from "framer-motion";
import { Coins, Building, BarChart3, FileText, Landmark, Lightbulb, Sparkles, Leaf, Shield } from 'lucide-react';

const FeatureSections = () => {
  return (
    <section className="bg-black text-white" id="explore-dvgroup">
      <div className="w-full max-w-[1408px] mx-auto">
        {/* First Section: Token Presale - Image on right */}
        <div className="w-full lg:flex lg:place-items-stretch lg:flex-row-reverse">
          {/* Image container - Right side */}
          <div className="block relative w-full h-[100vw] bg-slate-900 overflow-hidden lg:w-1/2 lg:h-auto lg:overflow-visible">
            <div className="lg:absolute lg:top-0 lg:left-0 lg:h-full lg:w-[44vw]">
              <div className="h-full w-full absolute block top-0 left-0">
                <img 
               src="/figura-1.png" 
                  alt="D&V Token Presale" 
                   className="w-full h-full object-contain"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent lg:bg-gradient-to-l"></div>
              </div>
            </div>
          </div>

          {/* Content - Left side */}
          <div className="w-full lg:w-1/2 px-4 py-10 lg:py-24 xl:py-44 lg:px-20 xl:px-32">
            <div className="w-full flex items-center mb-8">
              <Coins className="h-8 w-8 text-blue-400 mr-3" />
              <h2 className="font-bold text-4xl leading-[1.2] lg:text-[2.5rem] lg:leading-tight text-white">
                Token Presale
              </h2>
            </div>
            <div className="mb-8">
              <p className="text-pretty text-[1.0625rem] leading-[1.647] mb-3 text-gray-300">
                Participate in the D&V Token presale and be among the first to invest in our revolutionary platform. Our token powers the entire ecosystem of real estate, renewable energy, and decentralized financial services.
              </p>
              <p className="text-pretty text-[1.0625rem] leading-[1.647] mb-3 text-gray-300">
                With a vesting schedule designed for long-term stability and a clear allocation strategy, D&V Token offers a secure and transparent investment opportunity with strong growth potential.
              </p>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-start">
                  <Sparkles className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-200">Initial price of 0.00000000175 USDC with listing at 0.000000003 USDC</span>
                </div>
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-200">Secure presale with vesting periods to ensure long-term stability</span>
                </div>
              </div>
            </div>
            {/* Buttons */}
            <a 
              target="_self" 
              className="group relative leading-none text-center uppercase rounded-full block no-underline transform transition-all duration-150 text-xs px-5 py-3 bg-blue-600 text-white border-blue-600 hover:text-blue-800 hover:border-blue-600 transition-all duration-300 border inline-block mr-3 mb-3 group" 
              href="/presale"
            >
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="absolute w-1/2 h-full top-full left-1/2 -translate-x-1/2 block rounded-full transition-all duration-200 group-hover:top-0 group-hover:w-full group-hover:scale-125 bg-white"></div>
              </div>
              <div className="relative z-10">Join Presale</div>
            </a>
            <a 
              target="_self" 
              className="group relative block leading-none text-center uppercase rounded-full block no-underline transform transition-all duration-150 text-xs px-5 py-3 text-white border-white hover:text-blue-900 transition-all duration-300 border inline-block mr-3 mb-3 group" 
              href="/tokenomics"
            >
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="absolute w-1/2 h-full top-full left-1/2 -translate-x-1/2 block rounded-full transition-all duration-200 group-hover:top-0 group-hover:w-full group-hover:scale-125 bg-blue-400"></div>
              </div>
              <div className="relative z-10">Tokenomics</div>
            </a>
          </div>
        </div>

        {/* Second Section: Real Estate Projects - Image on left */}
        <div className="w-full lg:flex lg:place-items-stretch lg:flex-row">
          {/* Image container - Left side */}
          <div className="block relative bg-slate-900  w-full h-[100vw] overflow-hidden lg:w-1/2 lg:h-auto lg:overflow-visible">
            <div className="lg:absolute lg:top-0 lg:right-0 lg:h-full lg:w-[41vw]">
              <div className="h-full w-full absolute block top-0 left-0">
                <img 
               src="/medio.png" 
                  alt="D&V Real Estate Projects" 
                  className="w-full h-full object-contain"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent lg:bg-gradient-to-r"></div>
              </div>
            </div>
          </div>

          {/* Content - Right side */}
          <div className="w-full lg:w-1/2 px-4 py-10 lg:py-24 xl:py-44 lg:px-20 xl:px-32">
            <div className="w-full flex items-center mb-8">
              <Building className="h-8 w-8 text-blue-400 mr-3" />
              <h2 className="font-bold text-4xl leading-[1.2] lg:text-[2.5rem] lg:leading-tight text-white">
                Real Estate Integration
              </h2>
            </div>
            <div className="mb-8">
              <p className="text-pretty text-[1.0625rem] leading-[1.647] mb-3 text-gray-300">
                Our blockchain platform brings innovative solutions to real estate investments, enabling fractional ownership through tokenization and creating new opportunities for communities to invest in local development.
              </p>
              <p className="text-pretty text-[1.0625rem] leading-[1.647] mb-3 text-gray-300">
                Ownership records, transaction history, and property details are all secured on the blockchain, providing unprecedented transparency and security for all stakeholders.
              </p>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-start">
                  <Landmark className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-200">Tokenized real estate assets for fractional ownership</span>
                </div>
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-200">Transparent and immutable property records on blockchain</span>
                </div>
              </div>
            </div>
            {/* Buttons */}
            <a 
              target="_self" 
              className="group relative leading-none text-center uppercase rounded-full block no-underline transform transition-all duration-150 text-xs px-5 py-3 bg-blue-600 text-white border-blue-600 hover:text-blue-800 hover:border-blue-600 transition-all duration-300 border inline-block mr-3 mb-3 group" 
              href="/real-estate"
            >
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="absolute w-1/2 h-full top-full left-1/2 -translate-x-1/2 block rounded-full transition-all duration-200 group-hover:top-0 group-hover:w-full group-hover:scale-125 bg-white"></div>
              </div>
              <div className="relative z-10">Explore Projects</div>
            </a>
          </div>
        </div>

        {/* Third Section: Future Initiatives - Image on right */}
        <div className="w-full lg:flex lg:place-items-stretch lg:flex-row-reverse">
          {/* Image container - Right side */}
          <div className="block relative w-full h-[100vw] bg-slate-900 overflow-hidden lg:w-1/2 lg:h-auto lg:overflow-visible">
            <div className="lg:absolute lg:top-0 lg:left-0 lg:h-full lg:w-[41vw]">
              <div className="h-full w-full absolute block top-0 left-4">
                <img 
                  src="/final.png" 
                  alt="D&V Future Projects" 
                  className="w-full h-full object-contain"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent lg:bg-gradient-to-l"></div>
              </div>
            </div>
          </div>

          {/* Content - Left side */}
          <div className="w-full lg:w-1/2 px-4 py-10 lg:py-24 xl:py-44 lg:px-20 xl:px-32">
            <div className="w-full flex items-center mb-8">
              <Lightbulb className="h-8 w-8 text-blue-400 mr-3" />
              <h2 className="font-bold text-4xl leading-[1.2] lg:text-[2.5rem] lg:leading-tight text-white">
                Future Initiatives
              </h2>
            </div>
            <div className="mb-8">
              <p className="text-pretty text-[1.0625rem] leading-[1.647] mb-3 text-gray-300">
                Our roadmap extends beyond current offerings with ambitious plans to revolutionize renewable energy investments, community development programs, and decentralized financial services.
              </p>
              <p className="text-pretty text-[1.0625rem] leading-[1.647] mb-3 text-gray-300">
                D&V Group Blockchain is committed to building a comprehensive ecosystem that empowers communities, delivers sustainable solutions, and creates meaningful economic opportunities through blockchain technology.
              </p>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-start">
                  <Leaf className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-200">Renewable energy project funding and tokenization</span>
                </div>
                <div className="flex items-start">
                  <BarChart3 className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-200">Advanced DeFi services for community economic development</span>
                </div>
              </div>
            </div>
            {/* Buttons */}
            <a 
              target="_self" 
              className="group relative leading-none text-center uppercase rounded-full block no-underline transform transition-all duration-150 text-xs px-5 py-3 bg-blue-600 text-white border-blue-600 hover:text-blue-800 hover:border-blue-600 transition-all duration-300 border inline-block mr-3 mb-3 group" 
              href="/roadmap"
            >
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="absolute w-1/2 h-full top-full left-1/2 -translate-x-1/2 block rounded-full transition-all duration-200 group-hover:top-0 group-hover:w-full group-hover:scale-125 bg-white"></div>
              </div>
              <div className="relative z-10">View Roadmap</div>
            </a>
            <a 
              target="_self" 
              className="group relative block leading-none text-center uppercase rounded-full block no-underline transform transition-all duration-150 text-xs px-5 py-3 text-white border-white hover:text-blue-900 transition-all duration-300 border inline-block mr-3 mb-3 group" 
              href="/whitepaper"
            >
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="absolute w-1/2 h-full top-full left-1/2 -translate-x-1/2 block rounded-full transition-all duration-200 group-hover:top-0 group-hover:w-full group-hover:scale-125 bg-blue-400"></div>
              </div>
              <div className="relative z-10 flex items-center justify-center">
                <FileText className="h-4 w-4 mr-1" />
                <span>Whitepaper</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSections;