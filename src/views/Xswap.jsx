import React from 'react';
import { LiFiWidget } from '@lifi/widget';
import { Layout } from '@/components/app/Layout';
import { Box, Heading, Text, Center } from '@chakra-ui/react';

function Xswap() {
  const widgetConfig = {
    fromChain: 56,
    toChain: 56,
    fromToken: '0x0000000000000000000000000000000000000000',
    toToken: '0x3bdeECae844b96A133F98e54e36eB85414ffe5c9',
    disableLanguageDetector: false,
    tokens: {
      featured: [
        {
          address: '0x3bdeECae844b96A133F98e54e36eB85414ffe5c9',
          symbol: 'XMB',
          decimals: 18,
          chainId: 56,
          name: 'XIMBIA',
          logoURI:
            'https://minio-s3.caprover.snotrasys.com/ximbia/moneda-ximbia.png',
        },
        {
          address: '0x9945f6221Efee040a12054217504cBC230f0ACC9',
          symbol: 'BTIC',
          decimals: 18,
          chainId: 56,
          name: 'BIOTIC',
          logoURI:
            'https://minio-s3.caprover.snotrasys.com/ximbia/moneda-biotic.png',
        },
      ],
    },
    variant: 'expandable',
    subvariant: 'split',
    hiddenUI: ['poweredBy', 'appearance', 'language'],
    routePriority: 'FASTEST',
    appearance: 'light',

    containerStyle: {
      border: '1px solid rgb(234, 234, 234)',
      borderRadius: '8px',
      background: 'red',
    },
    insurance: true,
    languages: {
      default: 'es',
      allow: [
        'es',
        'pt',
        'th',
        'tr',
        'id',
        'fr',
        'en',
        'bn',
        'de',
        'it',
        'ko',
        'uk',
        'vi',
        'zh',
      ],
    },
    theme: {
      palette: {
        primary: { main: '#9900d1' },
        secondary: { main: '#F5B5FF' },
      },
      shape: {
        borderRadius: 8,
        borderRadiusSecondary: 8,
      },
      MuiAppBar: {
        styleOverrides: { background: 'red' },
      },
    },
  };
  return (
    <Layout>
      <div
        className="  h-screen w-screen bg-cover bg-fixed bg-center z-10 "
        style={{ backgroundImage: `url(/bg-swap.png)` }}
      >

      <div className='lg:-ml-60'>
        <Heading
          fontSize={{ base: '4xl', xl: '6xl' }}
          lineHeight="1em"
          letterSpacing="-0.05em"
          color="whiteAlpha.900"
          className="center text-center text-4xl font-bold pt-20"
          mb={5}
        >
          Trade instantly
          <br />
          <Text
            as="span"
            background="linear-gradient(97.53deg, #F687B3 5.6%, #7B61FF 59.16%, #16D1A1 119.34%)"
            backgroundClip="text"
          >
            with tokens
          </Text>
        </Heading>
   

      <LiFiWidget integrator="XIMBIA DAO" config={widgetConfig} />
      </div>
      </div>
    </Layout>
  );
}

export default Xswap;
