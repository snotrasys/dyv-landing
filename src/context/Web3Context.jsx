
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5';
import { bsc } from '@reown/appkit/networks';
import { ethers, BigNumber } from 'ethers';
import { toast } from 'react-hot-toast';
import {
  useAppKit,
  useAppKitAccount,
  useAppKitState,
  useAppKitProvider,
  useDisconnect,
} from '@reown/appkit/react';
import { getProfile } from '@/services/profileService';

const projectId = '00283c37cdf768ea488ed7d185fabf47';


const opBNBMainnet = {
  id: 204,
  caipNetworkId: 'eip155:204',
  chainNamespace: 'eip155',
  name: 'opBNB Mainnet',
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://opbnb-mainnet-rpc.bnbchain.org'] },
  },
  blockExplorers: {
    default: { name: 'opBNBScan', url: 'https://opbnbscan.com' },
  },
  testnet: false,
};

const metadata = {
  name: process.env.NEXT_PUBLIC_SITE_TITLE,
  description: process.env.NEXT_PUBLIC_PRODUCT_DESCRIPTION,
  url: process.env.NEXT_PUBLIC_URL,
  icons: [''],
};

// Limpieza de storage si el usuario se desconectó manualmente antes
if (typeof window !== 'undefined') {
  const wasManuallyDisconnected = localStorage.getItem('wallet_manually_disconnected') === 'true';

  if (wasManuallyDisconnected) {
    Object.keys(localStorage).forEach((key) => {
      if (
        key.includes('wagmi') ||
        key.includes('walletconnect') ||
        key.includes('reown') ||
        key.includes('appkit') ||
        key.includes('wc@2')
      ) {
        localStorage.removeItem(key);
      }
    });
    localStorage.removeItem('wallet_manually_disconnected');
  }
}

createAppKit({
  adapters: [new Ethers5Adapter()],
  networks: [bsc],
  metadata,
  projectId,
  features: { analytics: true },
  allowUnsupportedChain: true,
  autoConnect: false,
});

const Web3Context = createContext(null);

const Web3Provider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [err, setError] = useState(null);
  const [balanceOf_, setBalanceOf_] = useState(BigNumber.from('0'));
  const [accounts, setAccounts] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isManualDisconnect, setIsManualDisconnect] = useState(false);

  // Estado para la wallet de prueba
  const [testWallet, setTestWallet] = useState('');

  const { open, close } = useAppKit();
  const { selectedNetworkId } = useAppKitState();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');
  const { disconnect } = useDisconnect();

  // chainId derivado del selectedNetworkId (formato CAIP "eip155:204" -> 204)
  const chainId = selectedNetworkId
    ? parseInt(String(selectedNetworkId).split(':').pop(), 10)
    : null;

  // Verifica conexión real consultando al provider
  const verifyRealConnection = useCallback(async () => {
    if (!walletProvider || isManualDisconnect) return false;

    try {
      if (walletProvider.request) {
        const accs = await walletProvider.request({ method: 'eth_accounts' });
        return Array.isArray(accs) && accs.length > 0;
      }
    } catch (e) {
      console.warn('Error al verificar conexión:', e);
    }

    return isConnected && !isManualDisconnect;
  }, [walletProvider, isConnected, isManualDisconnect]);

  // Función para actualizar la wallet de prueba
  const updateTestWallet = (newWallet) => {
    setTestWallet(newWallet);

    if (newWallet && ethers.utils.isAddress(newWallet)) {
      setAccounts(newWallet);
      setIsLoaded(true);
      toast.success(
        `Test wallet updated: ${newWallet.slice(0, 6)}...${newWallet.slice(-4)}`
      );
    } else if (newWallet === '') {
      // Si se limpia la wallet de prueba, volver a la wallet conectada
      if (address && !isManualDisconnect) {
        setAccounts(address);
      } else {
        setAccounts(null);
        setIsLoaded(false);
      }
      toast('Test wallet cleared');
    } else {
      toast.error('Invalid wallet address');
    }
  };

  const fetchUserProfile = async (wallet) => {
    if (!wallet) return;
    const profile = await getProfile(wallet);
    if (profile) {
      setUserProfile(profile);
      setShowRegisterModal(false);
    } else {
      setUserProfile(null);
      setShowRegisterModal(true);
    }
  };

  const connectWallet = async () => {
    try {
      setIsManualDisconnect(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('wallet_manually_disconnected');
        localStorage.removeItem('walletconnect');
        localStorage.removeItem('WALLETCONNECT_DEEPLINK_CHOICE');
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
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

      if (typeof window !== 'undefined') {
        localStorage.setItem('wallet_manually_disconnected', 'true');
      }

      close();
      await disconnect();

      if (typeof window !== 'undefined') {
        Object.keys(localStorage).forEach((key) => {
          if (
            key.includes('wagmi') ||
            key.includes('walletconnect') ||
            key.includes('reown') ||
            key.includes('appkit') ||
            key.includes('wc@2')
          ) {
            localStorage.removeItem(key);
          }
        });
      }

      // Mantener la wallet de prueba activa si existe
      if (testWallet && ethers.utils.isAddress(testWallet)) {
        setAccounts(testWallet);
        setIsLoaded(true);
      } else {
        setAccounts(null);
      }

      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnect:', error);
      toast.error('Error disconnecting wallet');
    }
  };

  useEffect(() => {
    const updateConnectionStatus = async () => {
      const isReallyConnected = await verifyRealConnection();

      if (
        walletProvider &&
        address &&
        isConnected &&
        isReallyConnected &&
        !isManualDisconnect
      ) {
        // Priorizar la wallet de prueba si existe
        if (testWallet && ethers.utils.isAddress(testWallet)) {
          setAccounts(testWallet);
        } else {
          setAccounts(address);
        }
        setIsLoaded(true);
      } else if (testWallet && ethers.utils.isAddress(testWallet)) {
        // Mantener la wallet de prueba activa aunque no haya wallet conectada
        setAccounts(testWallet);
        setIsLoaded(true);
      } else {
        setIsLoaded(false);
        setAccounts(null);
      }
    };

    updateConnectionStatus();
  }, [
    walletProvider,
    address,
    isConnected,
    verifyRealConnection,
    isManualDisconnect,
    testWallet,
  ]);

  useEffect(() => {
    if (accounts) {
      fetchUserProfile(accounts);
    } else {
      setUserProfile(null);
      setShowRegisterModal(false);
    }
  }, [accounts]);

  const connect = useCallback(() => walletProvider, [walletProvider]);

  const errorMessage = () => toast.error('Connect Wallet');

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
        // Funciones para configurar wallet de prueba
        testWallet,
        updateTestWallet,
        isConnected: isLoaded && accounts !== null && !isManualDisconnect,
        userProfile,
        showRegisterModal,
        setShowRegisterModal,
        showEditModal,
        setShowEditModal,
        setUserProfile,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export { Web3Provider };
export default Web3Context;