import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Carousel from 'framer-motion-carousel';
import ImgS3 from './ImgS3';
import { useCountdown } from '@/hooks/useCountdown';


function CarouselBanner() {
  const { timerDays, timerHours, timerMinutes, timerSeconds } = useCountdown([
    2023, 6, 30, 20,
  ]);
  useEffect(() => {
    return () => {};
  }, [timerDays]);

  return (
    <div className=" scrollbar-hidden fixed z-[20] w-full overflow-hidden border-b border-purple-600  bg-black lg:relative">
      <Carousel
        renderArrowLeft={() => null}
        renderArrowRight={() => null}
        renderDots={() => null}
        interval={7000}
      >
         <div className="relative">
          <a href="https://www.ximbia.io/presale/nft">
            <img
              className="h-auto w-full object-fill lg:h-28 "
              src={`https://s3.magic-api.xyz/ximbia/banner-nft.png`}
              alt=""
            />
          </a>{' '}
        </div>
        <div className="relative">
          <a href="https://www.ximbia.io/stake/earn-xmb-bnb">
            <img
              className="h-auto w-full object-fill lg:h-28 "
              src={`https://s3.magic-api.xyz/ximbia/banner-xtake.png`}
              alt=""
            />
          </a>{' '}
        </div>
    
   
     

     
      </Carousel>
    </div>
  );
}

export default CarouselBanner;
