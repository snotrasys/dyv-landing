import React, { useState, useRef, useEffect } from 'react';
import { 
  Rocket, 
  Globe, 
  CreditCard, 
  Building, 
  ArrowRightLeft, 
  Smartphone,
  Sparkles,
  Zap,
  Star,
  Timer
} from 'lucide-react';

const RoadmapSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeQuarter, setActiveQuarter] = useState(null);
  
  // Detect mobile devices
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

  // Roadmap data with Lucide icons
  const roadmapData = [
    {
      id: 'q2-2025',
      period: 'Q2 2025',
      title: 'Foundation Phase',
      items: [
        'Pre-sale DYV Token',
        'Staking Platform Launch',
        'NFT Genesis Collection'
      ],
      color: '#3B82F6', // Blue
      icon: <Rocket size={24} />
    },
    {
      id: 'q3-2025',
      period: 'Q3 2025',
      title: 'Expansion Phase',
      items: [
        'HABI Platform Launch',
        'SOLAR Platform Launch',
        'Wrapped WDYV Token'
      ],
      color: '#10B981', // Green
      icon: <Globe size={24} />
    },
    {
      id: 'q4-2025',
      period: 'Q4 2025',
      title: 'Physical Integration',
      items: [
        'DYV Card Release',
        'DYV ATM Network'
      ],
      color: '#8B5CF6', // Purple
      icon: <CreditCard size={24} />
    },
    {
      id: 'q1-2026',
      period: 'Q1 2026',
      title: 'Financial Services',
      items: [
        'DYVlend Platform Launch'
      ],
      color: '#F59E0B', // Amber
      icon: <Building size={24} />
    },
    {
      id: 'q2-2026',
      period: 'Q2 2026',
      title: 'Exchange Services',
      items: [
        'DYVswap Platform Launch'
      ],
      color: '#EC4899', // Pink
      icon: <ArrowRightLeft size={24} />
    },
    {
      id: 'q3-2026',
      period: 'Q3 2026',
      title: 'Mobile Expansion',
      items: [
        'Mobile App Launch'
      ],
      color: '#EF4444', // Red
      icon: <Smartphone size={24} />
    }
  ];
  
  // Handle quarter click or hover
  const handleQuarterFocus = (id) => {
    setActiveQuarter(id);
  };
  
  // Reset active quarter
  const handleQuarterBlur = () => {
    setActiveQuarter(null);
  };

  // Icon renderer with hover effect
  const IconWithEffect = ({ icon, color }) => {
    return (
      <div 
        className="p-2 rounded-full flex items-center justify-center" 
        style={{ backgroundColor: `${color}20` }}
      >
        {React.cloneElement(icon, { color: color, size: isMobile ? 18 : 22 })}
      </div>
    );
  };

  // Item icons based on content
  const getItemIcon = (item) => {
    if (item.includes('Token') || item.includes('WDYV')) return <Sparkles size={16} />;
    if (item.includes('Staking')) return <Zap size={16} />;
    if (item.includes('NFT')) return <Star size={16} />;
    if (item.includes('Launch')) return <Rocket size={16} />;
    if (item.includes('ATM') || item.includes('Card')) return <CreditCard size={16} />;
    if (item.includes('App')) return <Smartphone size={16} />;
    return <Timer size={16} />;
  };

  return (
    <div className="relative py-20 bg-gray-900">
      {/* Main content */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mt-20 mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white tracking-wide">ROADMAP</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto"></div>
          <p className="mt-6 text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
            Our strategic pathway to revolutionize blockchain investment and build the DYV ecosystem
          </p>
        </div>

        {/* Desktop version */}
        <div className="hidden md:block relative">
          <div className="relative">
            {/* Central timeline */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-blue-500 via-purple-500 to-red-500 rounded"></div>
            
            {roadmapData.map((quarter, index) => (
              <div
                key={quarter.id}
                className={`relative mb-16 flex ${index % 2 === 0 ? 'justify-end pr-8' : 'justify-start pl-8'}`}
                style={{ 
                  width: '50%',
                  marginLeft: index % 2 === 0 ? '0' : 'auto',
                  marginRight: index % 2 === 0 ? 'auto' : '0'
                }}
                onMouseEnter={() => handleQuarterFocus(quarter.id)}
                onMouseLeave={handleQuarterBlur}
              >
                <div className="p-6 rounded-xl bg-gray-800 border border-blue-500 border-opacity-20 w-full">
                  <div className={`flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'} items-center mb-4 gap-3`}>
                    {index % 2 === 1 && <IconWithEffect icon={quarter.icon} color={quarter.color} />}
                    <h3 className="text-2xl font-bold text-white">
                      {quarter.period}
                    </h3>
                    {index % 2 === 0 && <IconWithEffect icon={quarter.icon} color={quarter.color} />}
                  </div>
                  
                  <span 
                    className={`text-sm font-medium py-1 px-3 rounded-full inline-block mb-4 ${index % 2 === 0 ? 'float-right' : 'float-left'}`}
                    style={{ backgroundColor: `${quarter.color}30`, color: quarter.color }}
                  >
                    {quarter.title}
                  </span>
                  
                  <div className="clear-both"></div>
                  
                  <ul className={`space-y-3 mt-6 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    {quarter.items.map((item, idx) => (
                      <li 
                        key={idx} 
                        className={`flex items-start ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}
                      >
                        {index % 2 === 1 && (
                          <span 
                            className="h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5"
                            style={{ backgroundColor: `${quarter.color}20`, color: quarter.color }}
                          >
                            {getItemIcon(item)}
                          </span>
                        )}
                        <span className="text-blue-100">{item}</span>
                        {index % 2 === 0 && (
                          <span 
                            className="h-6 w-6 rounded-full flex items-center justify-center ml-3 mt-0.5"
                            style={{ backgroundColor: `${quarter.color}20`, color: quarter.color }}
                          >
                            {getItemIcon(item)}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Timeline node */}
                <div 
                  className={`absolute top-6 ${index % 2 === 0 ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'}`}
                >
                  <div 
                    className="h-10 w-10 rounded-full flex items-center justify-center z-10 relative"
                    style={{ backgroundColor: quarter.color }}
                  >
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile version (vertical timeline) */}
        <div className="md:hidden relative">
          <div className="relative">
            {/* Central timeline */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-red-500"></div>
            
            {roadmapData.map((quarter, index) => (
              <div
                key={quarter.id}
                className="relative pl-12 pb-10"
              >
                <div className="p-5 rounded-lg bg-gray-800 border border-blue-500 border-opacity-20">
                  <div className="flex items-center gap-2 mb-2">
                    <IconWithEffect icon={quarter.icon} color={quarter.color} />
                    <h3 className="text-xl font-bold text-white">
                      {quarter.period}
                    </h3>
                  </div>
                  <span 
                    className="text-xs font-medium py-1 px-2 rounded-full inline-block mb-4"
                    style={{ backgroundColor: `${quarter.color}30`, color: quarter.color }}
                  >
                    {quarter.title}
                  </span>
                  
                  <ul className="space-y-3">
                    {quarter.items.map((item, idx) => (
                      <li 
                        key={idx} 
                        className="flex items-start"
                      >
                        <span 
                          className="h-5 w-5 rounded-full flex items-center justify-center mr-2 mt-0.5"
                          style={{ backgroundColor: `${quarter.color}20`, color: quarter.color }}
                        >
                          {getItemIcon(item)}
                        </span>
                        <span className="text-blue-100 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Timeline node */}
                <div className="absolute left-4 top-6 -translate-x-1/2 h-8 w-8 rounded-full flex items-center justify-center z-10"
                     style={{ backgroundColor: quarter.color }}>
                  <span className="text-white font-bold text-xs">{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapSection;