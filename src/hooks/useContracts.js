import { useMemo,useContext,useState} from 'react';
import {abi,BUSD, saleAbi,masterchefv2Abi,StakeAbi,abiClaim }  from './abiHelpers'
import Web3Context from '../context/Web3Context'
import {Contract,ethers} from 'ethers'
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';


export const address ={    
  fantom:"0xB68B9f0b20B5D2A84C88Af7cFA24304ccf07b397", 
  privateSale:"0xB68B9f0b20B5D2A84C88Af7cFA24304ccf07b397",
  publicSale:"0xB68B9f0b20B5D2A84C88Af7cFA24304ccf07b397",  
  masterchefv2:"0x1e511F8C570360eb06A8BE89cdD69f3b080512ae",
  stake:"0x86335E8745f59da1701af82dB688Bf4E5151d4A7",  
  vaulStake:"0xB1e87F81113807b99356454B34DD4857DbdCf395",    
  Biotic:"0xdBC66111bC6721C3409Bda429496e37aaC6ef273",
  ximbia:"0xdBC66111bC6721C3409Bda429496e37aaC6ef273",
  ximbia2:"0xdBC66111bC6721C3409Bda429496e37aaC6ef273",
  
  busd:"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  btc:"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  // busd:"0xA7CA4B7a29f6A31D22a349B9F3C03Ab5717B2712",
  // btc:"0xA7CA4B7a29f6A31D22a349B9F3C03Ab5717B2712",
  celestia:"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
 // btc:"0x55d398326f99059ff775485246999027b3197955",
  devWallet:"0x2614087B86aBe928887dCF999834db546c40387A",
  prediciones:"0xDF7D0bA5301fA249856ea99240E68A984f14ccB4",
  claim: "0x63C33eD515b02f2799ad26698A7d458272EEf962",
  tokenTest: "0x7644F86571EC4d0c08761e9E1fC85d823ED15578"
}

export const  usePrivateSale = ()=>{
  const { walletProvider } = useWeb3ModalProvider();
  const { accounts, isLoaded, connect } = useContext(Web3Context);   
  return useMemo(async() => {
    if(!isLoaded)
    return [false,null]
    try{
      const provider = new ethers.providers.Web3Provider(walletProvider);
    const signer = provider.getSigner()    
    const contract = new Contract(address.privateSale ,saleAbi,signer)          
    return [true, contract]
    }catch(e){
      console.log(e)
      return [false,null]
    }
    },[accounts,isLoaded])
}
export const usePublicSale = ()=>{
  const { walletProvider } = useWeb3ModalProvider();
  const {accounts, isLoaded,connect} = useContext(Web3Context)        
  return useMemo(async() => {
    if(!isLoaded)
    return [false,null]
    try{
      const provider = new ethers.providers.Web3Provider(walletProvider);
    const signer = provider.getSigner()    
    const contract = new Contract(address.publicSale ,saleAbi,signer)          
    return [true, contract]
    }catch(e){
      console.log(e)
      return [false,null]
    }
    },[accounts,isLoaded])
}



export const useClaim = ()=>{
  const { walletProvider } = useWeb3ModalProvider();
  const {accounts, isLoaded} = useContext(Web3Context)        
  return useMemo(async() => {
    if(!isLoaded)
    return [false,null]
    try {
      const provider = new ethers.providers.Web3Provider(walletProvider);
    const signer = provider.getSigner()    
    const contract = new Contract(address.claim ,abiClaim ,signer)          
    return [true, contract]
    } catch(e){
      console.log(e)
      return [false,null]
    }
    },[accounts,isLoaded])
}




export const useBUSD = ()=>{    
  const { walletProvider } = useWeb3ModalProvider();
  const {accounts, isLoaded,connect} = useContext(Web3Context)        
  return useMemo(async() => {
    if(!isLoaded)
    return [false,null]
    try{
      const provider = new ethers.providers.Web3Provider(walletProvider);
    const signer = provider.getSigner()    
    const contract = new Contract(address.busd,BUSD,signer)          
    return [true, contract]
    }catch(e){
      console.log(e)
      return [false,null]
    }
    },[accounts,isLoaded])
}


export const useTokenTest = ()=>{    
  const { walletProvider } = useWeb3ModalProvider();
  const {accounts, isLoaded,connect} = useContext(Web3Context)        
  return useMemo(async() => {
    if(!isLoaded)
    return [false,null]
    try{
      const provider = new ethers.providers.Web3Provider(walletProvider);
    const signer = provider.getSigner()    
    const contract = new Contract(address.tokenTest,BUSD,signer)          
    return [true, contract]
    }catch(e){
      console.log(e)
      return [false,null]
    }
    },[accounts,isLoaded])
}

export const useContract = ()=>{    
  const { walletProvider } = useWeb3ModalProvider();
  const {accounts, isLoaded,connect} = useContext(Web3Context)        
  return useMemo(async() => {
    if(!isLoaded)
    return [false,null]
    try{    
      const provider = new ethers.providers.Web3Provider(walletProvider);
    const signer = provider.getSigner()    
    const contract = new Contract(address.fantom,abi,signer)          
    return [true, contract]
  }catch(e){
    console.log(e)
    return [false,null]
  }
    },[accounts,isLoaded])
}


const etherJSProvider =async () => {
    const provider = new ethers.providers.getDefaultProvider();
    //Web3Provider(window.ethereum, "any");
    return provider;  
  }


  export const useToken = (address_)=>{    
    const { walletProvider } = useWeb3ModalProvider();
    const {accounts, isLoaded,connect} = useContext(Web3Context)        
    return useMemo(async() => {
      if(!isLoaded)
      return [false,null]
      try{    
        const provider = new ethers.providers.Web3Provider(walletProvider);
      const signer = provider.getSigner()    
      const contract = new Contract(address.ximbia2,BUSD,signer)          
      return [true, contract]
    }catch(e){
      console.log(e)
      return [false,null]
    }
      },[accounts,isLoaded,address])
  }

  export const useMasterChef= ()=>{    
    const { walletProvider } = useWeb3ModalProvider();
    const {accounts, isLoaded,connect} = useContext(Web3Context)        
    return useMemo(async() => {
      if(!isLoaded)
      return [false,null]
      try{    
        const provider = new ethers.providers.Web3Provider(walletProvider);
      const signer = provider.getSigner()    
      const contract = new Contract(address.masterchefv2,masterchefv2Abi,signer)          
      return [true, contract]
    }catch(e){
      console.log(e)
      return [false,null]
    }
      },[accounts,isLoaded])
  }


  export const useStake = (address_)=>{   
    const { walletProvider } = useWeb3ModalProvider(); 
    const {accounts, isLoaded,connect} = useContext(Web3Context)        
    return useMemo(async() => {
      if(!isLoaded)
      return [false,null]
      try{    
        const _address = address_ || address.stake
        const provider = new ethers.providers.Web3Provider(walletProvider);
      const signer = provider.getSigner()    
      const contract = new Contract(_address,StakeAbi,signer)          
      return [true, contract]
    }catch(e){
      console.log(e)
      return [false,null]
    }
      },[accounts,isLoaded])
  }
