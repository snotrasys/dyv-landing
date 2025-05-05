import React, { createContext, useState, useEffect } from 'react';
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalState,
} from '@web3modal/ethers5/react';
import { ethers, BigNumber } from 'ethers';
import { bsc, polygon, opBNB, base } from 'wagmi/chains';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { toast } from 'react-hot-toast';

const projectId = '4a7814b39852bee771b4bf431f860455';

const metadata = {
  name: process.env.NEXT_PUBLIC_SITE_TITLE,
  description: process.env.NEXT_PUBLIC_PRODUCT_DESCRIPTION,
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [base, opBNB],
  projectId,
  allowUnsupportedChain: true,
});

const Web3Context = createContext();

const Web3Provider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [err, setError] = useState(null);
  const [balanceOf_, setBalanceOf_] = useState(BigNumber.from('0'));
  const { open, close } = useWeb3Modal();
  const { account, chainId, error } = useWeb3ModalState();
  const { address, isConnected } = useWeb3ModalAccount();
  const [accounts, setAccounts] = useState(null);
  const { walletProvider } = useWeb3ModalProvider();
  const [update, setupdate] = useState(0);



  const connectWallet = async () => {
    try {
      open();

    } catch (error) {
      console.error('Error connecting to wallet:', error);
      toast.error('Error connecting to wallet');
      setError(error);
    }
  };

  const disconnectWallet = () => {
    close();
    setIsLoaded(false);
  };

  {
    /* WALLET PARA TESTING */
  }
  const testWallet = '';

  useEffect(() => {
    if (walletProvider && address) {
      // switchToPolygon(walletProvider);
      const provider = new ethers.providers.Web3Provider(walletProvider);
      const signer = provider.getSigner();
      setIsLoaded(true);
      if (testWallet !== '') {
        setAccounts(testWallet);
      } else {
        setAccounts(address);
      }
    } else {
      setIsLoaded(false);
      setAccounts(null);
    }
  }, [walletProvider, address]);

  const connect = () => {
    return walletProvider;
  };
  useEffect(() => {
    if (error) {
      setError(error);
      toast.error('Error: ' + error.message);
    }
  }, [error]);

  const errorMessage = () => toast.error('Error connecting to wallet');

  return (
    <Web3Context.Provider
      value={{
        accounts,
        isLoaded,
        err,
        balanceOf_,
        connectWallet,
        disconnectWallet,
        chainId,
        errorMessage,
        connect,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export { Web3Provider };
export default Web3Context;