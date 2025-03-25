
import '../index.css';
import 'focus-visible';
import { DefaultSeo } from 'next-seo';
import config from '../config';
import { Web3Provider } from '../context/Web3Context';
import { TokenProvider } from '../context/TokenHandle';
import { Toaster } from 'react-hot-toast';
import { SpinnerProvider } from '@/context/SpinnerContext';
import { MultiApproveProvider } from '@/context/MultiApprove';
import NavbarMenu from '@/components/NavbarMenu';
function MyApp({ Component, pageProps }) {




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
