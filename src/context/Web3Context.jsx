'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5';
import { base } from '@reown/appkit/networks';
import { BigNumber } from 'ethers';
import { toast } from 'react-hot-toast';
import { 
  useAppKit, 
  useAppKitAccount, 
  useAppKitState, 
  useAppKitProvider,
  useDisconnect
} from '@reown/appkit/react';


const projectId = '4a7814b39852bee771b4bf431f860455';

const metadata = {
  name: process.env.NEXT_PUBLIC_SITE_TITLE,
  description: process.env.NEXT_PUBLIC_PRODUCT_DESCRIPTION,
  url: process.env.NEXT_PUBLIC_URL,
  icons: [''],
};


if (typeof window !== 'undefined') {
  const wasManuallyDisconnected = localStorage.getItem('wallet_manually_disconnected') === 'true';
  
  if (wasManuallyDisconnected) {

    Object.keys(localStorage).forEach(key => {
      if (key.includes('wagmi') || key.includes('walletconnect') || 
          key.includes('reown') || key.includes('appkit') || key.includes('wc@2')) {
        localStorage.removeItem(key);
      }
    });
    localStorage.removeItem('wallet_manually_disconnected');
  }
}


createAppKit({
  adapters: [new Ethers5Adapter()],
  networks: [base],
  metadata,
  projectId,
  features: { analytics: true },
  allowUnsupportedChain: true,
  autoConnect: true
});


const Web3Context = createContext(null);


const Web3Provider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [accounts, setAccounts] = useState(null);
  const [err, setError] = useState(null);
  const [balanceOf_] = useState(BigNumber.from('0'));
  const [isManualDisconnect, setIsManualDisconnect] = useState(false);
  

  const { open, close } = useAppKit();
  const { chainId } = useAppKitState();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');
  const { disconnect } = useDisconnect();
  

  const verifyRealConnection = useCallback(async () => {
    if (!walletProvider || isManualDisconnect) return false;
    
    try {
      if (walletProvider.request) {
        const accounts = await walletProvider.request({ method: 'eth_accounts' });
        return Array.isArray(accounts) && accounts.length > 0;
      }
    } catch (e) {
      console.warn('Error al verificar conexión:', e);
    }
    
    return isConnected && !isManualDisconnect;
  }, [walletProvider, isConnected, isManualDisconnect]);
  

  const connectWallet = async () => {
    try {
      setIsManualDisconnect(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('wallet_manually_disconnected');
      }
      await open();
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      toast.error('Error connecting to wallet');
      setError(error);
    }
  };
  

  const disconnectWallet = async () => {
    try {
      
      setIsManualDisconnect(true);
      setIsLoaded(false);
      setAccounts(null);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('wallet_manually_disconnected', 'true');
      }

      close();
      await disconnect();
      
      if (typeof window !== 'undefined') {
        Object.keys(localStorage).forEach(key => {
          if (key.includes('wagmi') || key.includes('walletconnect') || 
              key.includes('reown') || key.includes('appkit') || key.includes('wc@2')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      toast.success('Wallet disconnect');
    } catch (error) {
      console.error('Error disconnect:', error);
      toast.error('Error disconnect wallet', error);
    }
  };
  

  const connect = useCallback(() => walletProvider, [walletProvider]);
  

  const errorMessage = () => toast.error('Error connecting to wallet');
  

  useEffect(() => {
    const updateConnectionStatus = async () => {
      const isReallyConnected = await verifyRealConnection();
      
      if (walletProvider && address && isConnected && isReallyConnected && !isManualDisconnect) {
        const testWallet = '';
        setIsLoaded(true);
        setAccounts(testWallet !== '' ? testWallet : address);
      } else if (!isReallyConnected || isManualDisconnect) {
        setIsLoaded(false);
        setAccounts(null);
      }
    };
    
    updateConnectionStatus();
  }, [walletProvider, address, isConnected, verifyRealConnection, isManualDisconnect]);
  
  

  const contextValue = {
    accounts,
    isLoaded,
    err,
    balanceOf_,
    connectWallet,
    disconnectWallet,
    chainId,
    errorMessage,
    connect,
    isConnected: isLoaded && accounts !== null && !isManualDisconnect
  };
  
  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};

export { Web3Provider };
export default Web3Context;