import { useMemo,useContext,useState} from 'react';
import {abi,BUSD, saleAbi,masterchefv2Abi,StakeAbi}  from './abiHelpers'
import Web3Context from '../context/Web3Context'
import {Contract,ethers} from 'ethers'

export const address ={    
  fantom:"0xa0752E7Db0039A948feEba07097958b878208922",
  privateSale:"0xa0752E7Db0039A948feEba07097958b878208922",
  publicSale:"0xa0752E7Db0039A948feEba07097958b878208922",  
  masterchefv2:"0x1e511F8C570360eb06A8BE89cdD69f3b080512ae",
  stake:"0x86335E8745f59da1701af82dB688Bf4E5151d4A7",  
  vaulStake:"0xB1e87F81113807b99356454B34DD4857DbdCf395",    
  Biotic:"0x33a568F5692953F8C5989876B9A655b6205E8FB7",
  ximbia:"0x33a568F5692953F8C5989876B9A655b6205E8FB7",
  ximbia2:"0x33a568F5692953F8C5989876B9A655b6205E8FB7",
  
  busd:"0x33a568F5692953F8C5989876B9A655b6205E8FB7",
  btc:"0x33a568F5692953F8C5989876B9A655b6205E8FB7",
  // busd:"0xA7CA4B7a29f6A31D22a349B9F3C03Ab5717B2712",
  // btc:"0xA7CA4B7a29f6A31D22a349B9F3C03Ab5717B2712",
  celestia:"0x33a568F5692953F8C5989876B9A655b6205E8FB7",
 // btc:"0x55d398326f99059ff775485246999027b3197955",
  devWallet:"0x2614087B86aBe928887dCF999834db546c40387A",
  prediciones:"0xDF7D0bA5301fA249856ea99240E68A984f14ccB4"
}

export const  usePrivateSale = ()=>{
  const {accounts, isLoaded,connect} = useContext(Web3Context)        
  return useMemo(async() => {
    if(!isLoaded)
    return [false,null]
    try{
    const provider =await connect()
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
  const {accounts, isLoaded,connect} = useContext(Web3Context)        
  return useMemo(async() => {
    if(!isLoaded)
    return [false,null]
    try{
    const provider =await connect()
    const signer = provider.getSigner()    
    const contract = new Contract(address.publicSale ,saleAbi,signer)          
    return [true, contract]
    }catch(e){
      console.log(e)
      return [false,null]
    }
    },[accounts,isLoaded])
}



export const useBUSD = ()=>{    
  const {accounts, isLoaded,connect} = useContext(Web3Context)        
  return useMemo(async() => {
    if(!isLoaded)
    return [false,null]
    try{
    const provider =await connect()
    const signer = provider.getSigner()    
    const contract = new Contract(address.busd,BUSD,signer)          
    return [true, contract]
    }catch(e){
      console.log(e)
      return [false,null]
    }
    },[accounts,isLoaded])
}

export const useContract = ()=>{    
  const {accounts, isLoaded,connect} = useContext(Web3Context)        
  return useMemo(async() => {
    if(!isLoaded)
    return [false,null]
    try{    
    const provider =await connect()
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
    const {accounts, isLoaded,connect} = useContext(Web3Context)        
    return useMemo(async() => {
      if(!isLoaded)
      return [false,null]
      try{    
      const provider =await connect()
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
    const {accounts, isLoaded,connect} = useContext(Web3Context)        
    return useMemo(async() => {
      if(!isLoaded)
      return [false,null]
      try{    
      const provider =await connect()
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
    const {accounts, isLoaded,connect} = useContext(Web3Context)        
    return useMemo(async() => {
      if(!isLoaded)
      return [false,null]
      try{    
        const _address = address_ || address.stake
      const provider =await connect()
      const signer = provider.getSigner()    
      const contract = new Contract(_address,StakeAbi,signer)          
      return [true, contract]
    }catch(e){
      console.log(e)
      return [false,null]
    }
      },[accounts,isLoaded])
  }