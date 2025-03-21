import React from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import Carousel from 'framer-motion-carousel';
import ImgS3 from './ImgS3';

const AnnounceAndTokenomics = () => (
  <>
    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 mb-12">
      <div className="grid h-full gap-4">
        <div className=" group row-span-2 block h-full  w-full  overflow-hidden rounded-md  bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#39004d] to-[#000] text-center shadow-sm">
          <div className="mt-4 mb-9 text-3xl font-bold text-white">
            ANNOUNCEMENTS
          </div>
          <div className="px-4">
            <TwitterTimelineEmbed
              source
              Type="ximbiadex"
              screenName="ximbiadex"
              options={{ height: 500 }}
              theme='dark'
            />
          </div>
        </div>
      </div>
      <div className="group row-span-2 block h-full lg:block hidden  w-full  overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#39004d]  to-[#000] px-4 py-6 sm:rounded-lg sm:px-6">
        <div className="">
          <div className="mt-4 mb-9 text-center text-3xl font-bold text-white">
            COMING SOON
          </div>
        </div>
        <div></div>
        <Carousel
          renderArrowLeft={() => null}
          renderArrowRight={() => null}
          renderDots={() => null}
          interval={4000}
        >
          <div>
            <ImgS3 src="/soon1.png" className="h-[550] w-full" />
          </div>
       
          <div>
            <ImgS3 src="/soon3.png" className="h-[550] w-full" />
          </div>
          <div>
            <ImgS3 src="/soon2.png" className="h-[550] w-full" />
          </div>
          <div>
            <ImgS3 src="/soon5.png" className="h-[550] w-full" />
          </div>
          <div>
            <ImgS3 src="/soon6.png" className="h-[550] w-full" />
          </div>
        </Carousel>
      </div>
    </div>
  </>
);
export default AnnounceAndTokenomics;
