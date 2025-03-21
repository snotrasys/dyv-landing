import ImgS3 from '@/components/ImgS3';
import { Layout } from '@/components/app/Layout';
import PresaleSwap from '@/views/PresaleSwap';
import React from 'react';
import { SwapProvider } from '@/context/SwapHandle';

function Private() {
  return (
    <Layout>
      <SwapProvider>
        <div className="mx-auto pt-16 grid  max-w-7xl items-center lg:pt-24 lg:grid-cols-2">
          <div className="relative  pt-12 px-4">
            <img
              loading="lazy"
              src="/logo.png"
              alt=""
              className="relative mx-auto animate-bob delay-250"
            />
          </div>
          <div className="mb-20 mt-10">
         <PresaleSwap />
      
          </div>
        </div>
      </SwapProvider>
    </Layout>
  );
}

export default Private;
