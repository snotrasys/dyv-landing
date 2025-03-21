import { useMemo, useContext, useState, use, useEffect } from 'react';
import { predictioneAbi } from './abiHelpers';
import Web3Context from '../context/Web3Context';
import { BigNumber, Contract, ethers } from 'ethers';
import { address } from './useContracts';

export const UsePrediction = (address_) => {
  const { accounts, isLoaded, connect } = useContext(Web3Context);
  const [epoch, setepoch] = useState(0);

  useEffect(() => {
    getCurrentepoch();

    return () => {};
  }, [isLoaded]);

  const contract = async () => {
    if (!isLoaded) return null;
    const provider = await connect();
    const signer = provider.getSigner();
    const contract = new Contract(address.prediciones, predictioneAbi, signer);
    return contract;
  };

  const betBear = async (epoch_, _amount) => {
    if (!isLoaded) return BigNumber.from(0);
    const contract_ = await contract();
    _amount = ethers.utils.parseEther(_amount);
    const tx = contract_.betBear(epoch, _amount);
    return tx;
  };

  const betBull = async (epoch_, _amount) => {
    if (!isLoaded) return BigNumber.from(0);
    const contract_ = await contract();
    _amount = ethers.utils.parseEther(_amount);
    const tx = contract_.betBull(epoch, _amount);
    return tx;
  };

  const claim = async (epoch) => {
    if (!isLoaded) return BigNumber.from(0);
    const contract_ = await contract();
    const tx = contract_.claim(epoch);
    return tx;
  };

  const getUserRounds = async (user_, cursor, size) => {
    if (!isLoaded) return BigNumber.from(0);
    const contract_ = await contract();
    const user = user_ || accounts;
    const tx = contract_.getUserRounds(user, cursor, size);
    return tx;
  };

  const getUserRoundsLength = async (user_) => {
    if (!isLoaded) return BigNumber.from(0);
    const contract_ = await contract();
    const user = user_ || accounts;
    const tx = contract_.getUserRoundsLength(user);
    return tx;
  };

  const claimable = async (epoch, user_) => {
    if (!isLoaded) return BigNumber.from(0);
    const contract_ = await contract();
    const user = user_ || accounts;
    const tx = contract_.claimable(epoch, user);
    return tx;
  };
  // refundable
  const refundable = async (epoch, user_) => {
    if (!isLoaded) return BigNumber.from(0);
    const contract_ = await contract();
    const user = user_ || accounts;
    const tx = contract_.refundable(epoch, user);
    return tx;
  };

  const currentEpoch = async () => {
    if (!isLoaded) return BigNumber.from(0);
    const contract_ = await contract();
    const tx = await contract_.currentEpoch();
    // console.log("currentEpoch", tx);
    return tx;
  };
  const getCurrentepoch = async () => {
    let epot = await currentEpoch();
    epot = await epot.toNumber();
    console.log(epot, 'epot');
    setepoch(epot);
  };

  const rounds = async (epot_) => {
    let epot =epot_ ||  await currentEpoch();
    epot = await epot.rounds();
    console.log(epot, 'epot');
    setepoch(epot);
  };

  const roundView = async (epoch_) => {
    
    
    if (!isLoaded) return BigNumber.from(0);
console.log("RoundView", 'RoundView');

    const epot = await currentEpoch();
    let rounds_ =[]
    // const roundsNumber_ =[]
    // epo
    // console.log("RoundView", 'RoundView3');
    // console.log(epot, 'epot');
    

    for (let i = epot-4; i <= epot; i++) {
    // const contract_ = await contract();
    // const tx = await contract_.rounds(i);
    // rounds_.push(tx)    
  };
  console.log(rounds_, 'rounds_');
  }
  
  return[{
    contract,
            betBull,
            betBear,
            address_,
            claim,
            getUserRounds,
            getUserRoundsLength,
            claimable,
            refundable,
            currentEpoch,
            rounds,
            epoch,
            roundView

  }]
  // return useMemo(() => {
  //   try {
  //     return [
  //       {
  //         contract,
  //         betBull,
  //         betBear,
  //         address_,
  //         claim,
  //         getUserRounds,
  //         getUserRoundsLength,
  //         claimable,
  //         refundable,
  //         currentEpoch,
  //         rounds,
  //         epoch,
  //         roundView
  //       },
  //     ];
  //   } catch (e) {
  //     console.log(e);
  //     return [contract, balanceOf, epoch, address_];
  //   }
  // }, [accounts, isLoaded, address_, contract, epoch,  
  
    
  //         betBull,
  //         betBear,
  //         address_,
  //         claim,
  //         getUserRounds,
  //         getUserRoundsLength,
  //         claimable,
  //         refundable,
  //         currentEpoch,
  //         rounds,
          
  //         roundView]);
};
