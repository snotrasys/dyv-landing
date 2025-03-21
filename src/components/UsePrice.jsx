import { useMemo, useContext, useState, use, useEffect } from 'react';
import Web3Context from '../context/Web3Context';
import { BigNumber, Contract, ethers } from 'ethers';

export const UsePrice = (tokenInput) => {
  const { accounts, isLoaded, connect } = useContext(Web3Context);
  const [price, setprice] = useState(0);
  const [priceBnb, setpriceBnb] = useState(0);
  

  useEffect(() => {
    if (!isLoaded) return;
    getPrice();    
    getBnbPrice();

    return () => {};
  }, [isLoaded, tokenInput]);

  const contract = async () => {
    if (!isLoaded) return null;
    const provider = await connect();
    const signer = provider.getSigner();
    const contract = new Contract(
      '0x06abC77aFb244A71d8A3de74c2B1cAd60a181609',
      [
        `function BUSD() public view  returns (address)`,
        `function WBNB() public view  returns (address)`,
        `function getBusdToBNBToToken(
            address token,
            uint _amount
        ) external view  returns (uint256)`,

        `function getTokensToBNBtoBusd(
            address token,
            uint _amount
        ) external view  returns (uint256)`,

        `function getTokensToBnb(
            address token,
            uint _amount
        ) external view  returns (uint256)`,

        `function getBnbToTokens(
            address token,
            uint _amount
        ) public view  returns (uint256)`,
        `  function getLpPrice(
          address _token,
          uint _amount
      ) public view  returns (uint) `
      ],
      signer,
    );
    return contract;
  };

  const getBnbPrice = async () => {
    if (!isLoaded) return null;
    try {
      let price_ = await getBnbToTokens();
      price_ = ethers.utils.formatEther(price_);      
      setpriceBnb(price_);
      return price_;
    } catch (e) {
      console.log(e, 'price');

      return false;
    }
  };
      

  const getPrice = async () => {
    if (!isLoaded) return null;
    try {
      let price_ = await getTokensToBNBtoBusd();
      price_ = ethers.utils.formatEther(price_);

      console.log(price_, 'price_');
      setprice(price_);
      return price_;
    } catch (e) {
      console.log(e, 'price');

      return false;
    }
  };

  const getBusdToBNBToToken = async (token_, amount) => {
    if (!isLoaded) return null;
    try {
      const contract = await contract();
      amount =
        amount == undefined
          ? ethers.utils.parseEther(1)
          : ethers.utils.parseEther(amount);
      const token = token_ == undefined ? tokenInput : token_;

      const tx = await contract.getBusdToBNBToToken(token, amount);
      return tx;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const getTokensToBNBtoBusd = async (token_, amount_) => {
    if (!isLoaded) return null;
    try {
      let amount =
        amount_ == undefined
          ? ethers.utils.parseEther('1')
          : ethers.utils.parseEther(amount_);
      const token = token_ == undefined ? tokenInput : token_;
      const contract_ = await contract();
      const tx = await contract_.getTokensToBNBtoBusd(token, amount);
      return tx;
    } catch (e) {
      // console.log(e);
      return BigNumber.from(0);
    }
  };

  const getBnbToTokens = async (token_, amount_) => {
    if (!isLoaded) return null;
    try {
      let amount =amount_==undefined? ethers.utils.parseEther("1"): ethers.utils.parseEther(amount_);
      let token = token_ 
      const contract_ = await contract();
      if(token==undefined){
         token = await contract_.BUSD()
      }
      const tx = await contract_.getBnbToTokens(token, amount);
      // console.log(tx, 'tx');console.log(token, amount);

      return tx;
    } catch (e) {
      console.log(e,"getBnbToTokens");
      return false;
    }
  };


  const getLpPrice = async (token_, amount_) => {
    if (!isLoaded) return null;
    try {
      let amount =
        amount_ == undefined
          ? ethers.utils.parseEther('1')
          : ethers.utils.parseEther(amount_);
      const token = token_ == undefined ? tokenInput : token_;
      const contract_ = await contract();
      const tx = await contract_.getLpPrice(token, amount);
      return tx;
    } catch (e) {
      // console.log(e);
      return BigNumber.from(0);
    }
  };



  return useMemo(() => {
    try {
      return {
        contract,
        getBusdToBNBToToken,
        getTokensToBNBtoBusd,
        price,
        priceBnb,
        getPrice,
        getLpPrice
      };
    } catch (e) {
      console.log(e);
      return {};
    }
  }, [accounts, isLoaded, price, tokenInput,priceBnb]);
};
