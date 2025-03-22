import React from "react";
import { Coins, Building, LineChart, Landmark, Users, Globe } from 'lucide-react';

const CardSliderSection = () => {
  const cards = [
    {
      id: 1,
      title: "Token Presale",
      description: "Participate in our token presale and invest in the future of blockchain-powered real estate and finance",
      icon: Coins,
      link: "/presale"
    },
    {
      id: 2,
      title: "Real Estate Projects",
      description: "Explore our innovative real estate projects backed by blockchain technology for transparency and security",
      icon: Building,
      link: "/real-estate"
    },
    {
      id: 3,
      title: "Tokenomics",
      description: "Learn about D&V Token distribution, vesting schedules, and our long-term value creation strategy",
      icon: LineChart,
      link: "/tokenomics"
    },
    {
      id: 4,
      title: "Investment Platform",
      description: "Access our platform for fractional ownership opportunities in premium real estate assets",
      icon: Landmark,
      link: "/platform"
    },
    {
      id: 5,
      title: "Join Community",
      description: "Connect with like-minded investors and be part of the D&V Group ecosystem",
      icon: Users,
      link: "/community"
    }
  ];

  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto mb-10">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-2">Explore D&V Ecosystem</h2>
        <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
          Discover the various aspects of our platform and how you can get involved
        </p>
      </div>
      
      <div className="overflow-x-scroll flex w-full lg:overflow-auto gap-6 py-10 lg:py-12 lg:gap-7 px-4 md:px-10">
        {cards.map((card) => (
          <a 
            key={card.id}
            href={card.link} 
            className="flex-shrink-0 w-[80%] block lg:flex-shrink lg:w-full lg:pb-5 group"
          >
            <div className="relative w-full pt-[110%] bg-blue-100 rounded-xl overflow-hidden mb-7">
              {/* Icon centered */}
              <div className="block absolute h-auto w-5/12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-[1.1] transition-all group-hover:duration-500 group-focus:duration-500 duration-700">
                <card.icon size={120} className="text-blue-600" strokeWidth={1.5} />
              </div>
              
              {/* Arrow that appears on hover */}
              <div className="absolute top-6 right-6 scale-0 group-hover:scale-100 transition-transform group-hover:duration-200 group-hover:delay-150 ease-out duration-500">
                <div className="group transition-colors duration-200 relative overflow-hidden rounded-full h-16 w-16 bg-white group-hover:bg-blue-600 flex-grow-0">
                  <div className="absolute top-0 left-0 h-full w-full transition-transform rotate-45">
                    <div className="absolute top-0 left-0 h-full w-full transition-all duration-300 group-hover:-top-full">
                      <div className="top-0 left-0 absolute h-full w-full flex justify-center items-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M11.4893 3.10496L4.29687 9.46964L4.95957 10.2185L11.3208 4.58936L11.3208 21.2959L12.3208 21.2959L12.3208 4.58766L18.6848 10.2039L19.3465 9.45408L12.1515 3.10451C11.9623 2.93752 11.6783 2.93772 11.4893 3.10496Z" fill="#3B82F6" className="group-hover:fill-white transition duration-300" />
                        </svg>
                      </div>
                      <div className="top-full left-0 absolute h-full w-full flex justify-center items-center transition-transform rotate-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M11.4893 3.10496L4.29687 9.46964L4.95957 10.2185L11.3208 4.58936L11.3208 21.2959L12.3208 21.2959L12.3208 4.58766L18.6848 10.2039L19.3465 9.45408L12.1515 3.10451C11.9623 2.93752 11.6783 2.93772 11.4893 3.10496Z" fill="#3B82F6" className="group-hover:fill-white transition duration-300" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="font-bold text-[1.75rem] leading-[1.2] lg:text-[2rem] lg:leading-tight text-gray-900 mb-4">
              {card.title}
            </h3>
            
            <p className="text-pretty text-[1.0625rem] leading-[1.647] text-gray-600">
              {card.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CardSliderSection;