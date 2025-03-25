import { useEffect, useState } from 'react';
import '../index.css';
import 'focus-visible';
import { DefaultSeo } from 'next-seo';
import config from '../config';
import { Web3Provider } from '../context/Web3Context';
import { TokenProvider } from '../context/TokenHandle';
import { Toaster } from 'react-hot-toast';
import { SpinnerProvider } from '@/context/SpinnerContext';


import { useRouter } from 'next/router';
import RouterLoadingIndicator from '@/components/RouterLoadingIndicator';
import { MultiApproveProvider } from '@/context/MultiApprove';
import NavbarMenu from '@/components/NavbarMenu';
function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const [state, setState] = useState({
    isRouteChanging: false,
    loadingKey: 0,
  });

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setState((prevState) => ({
        ...prevState,
        isRouteChanging: true,
        loadingKey: prevState.loadingKey ^ 1,
      }));
    };

    const handleRouteChangeEnd = () => {
      setState((prevState) => ({
        ...prevState,
        isRouteChanging: false,
      }));
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeEnd);
    router.events.on('routeChangeError', handleRouteChangeEnd);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeEnd);
      router.events.off('routeChangeError', handleRouteChangeEnd);
    };
  }, [router.events]);

  return (
    <div
    className="    bg-black lg:bg-top bg-center bg-no-repeat   bg-cover bg-fixed	"

  >

      <div>
        <SpinnerProvider>
          <Web3Provider>
        
          <MultiApproveProvider>
          <TokenProvider>
            <NavbarMenu />
                <div className="break-all font-primary">
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      style: {
                        background: '#363636',
                        color: '#fff',
                      },
                      iconTheme: {
                        primary: '#8b5cf6',
                        secondary: '#000',
                      },
                    }}
                  />
                </div>
                <RouterLoadingIndicator
                  isRouteChanging={state.isRouteChanging}
                  key={state.loadingKey}
                />
                <DefaultSeo {...config} />

                <Component {...pageProps} />
                </TokenProvider>
                </MultiApproveProvider>
                
          </Web3Provider>
        </SpinnerProvider>
      </div>
    </div>
  );
}

export default MyApp;
