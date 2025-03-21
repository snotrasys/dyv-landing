import React, { useEffect, useState, useContext } from 'react';
import poolsData from './poolsData';
import ApproveCardPools from './ApproveCardPools';
import { motion } from 'framer-motion';
import Web3Context from '../../../context/Web3Context';
import {
  IBEP20,
  MasterChefV2,
  Vault,
  PancakeRouter,
} from '../../../hooks/abiHelpers';
import { constants, BigNumber, ethers } from 'ethers';

const CardPools = ({ searchTerm, activepool }) => {
  const { accounts, isLoaded, setupdate, update } = useContext(Web3Context);

  const [pricesLolli, setpricesLolli] = useState(
    BigNumber.from(ethers.utils.parseEther('0.005')),
  );

  const [poolD, setpoolD] = useState([]);
  useEffect(() => {
    const price = async () => {};
    setpoolD(poolsData);

    if (isLoaded) price();
    return () => {};
  }, [isLoaded]);
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
    
          {poolD
            .filter((pool) => {
              if (searchTerm === '') {
                return pool;
              } else if (
                pool.name.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                return pool;
              }
            })
            .map((pool) => {
              return (
                <ApproveCardPools
                  pool={pool}
                  key={JSON.stringify(pool)}
                  pricesLolli={pricesLolli}
                />
              );
            })}
        </motion.div>
      </div>
    </>
  );
};
export default CardPools;
