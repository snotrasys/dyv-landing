import React, { useState, useContext } from 'react';
import CardPools from './Card/CardPools';
import CardHorizontalPool from './Card/CardHorizontalPool';
import { Switch } from '@headlessui/react';
import poolsData from './Card/poolsData';
import Web3Context from '../../context/Web3Context';
import { motion } from 'framer-motion';
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}


const PoolsScreen = () => {
  const [activepool, setactivepool] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const [enabled1, setEnabled1] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { accounts, isLoaded } = useContext(Web3Context);
  const handleTabSwitch = (e) => {
    const index = parseInt(e.target.id, 0);
    if (index !== activeTab) {
      setActiveTab(index);
    }
  };

  const childVariants = {
    initial: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  /* eslint-disable */
  return (
    <>
      <div className="">
     
        <motion.div
          className=" "
          initial="initial"
          animate="visible"
          variants={{
            initial: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
        >
          <motion.div className="-ml-4 -mt-4 grid md:flex md:justify-between justify-center items-center flex-wrap sm:flex-nowrap "  variants={childVariants}>
            <div className="ml-4 mt-4">
              <div className="flex items-center">
               

            
              </div>
            </div>
            <div className="ml-4 mt-4 flex-shrink-0 flex">
             
              <div className="ml-4">
                <div className="">
                
                  <input
                    type="search"
                    name=""
                    id=""
                    placeholder="Search Farms"
                    className="block w-full bg-[#12071f] rounded-full border-0 py-2 text-gray-100 shadow-sm ring-1 ring-inset ring-purple-600 placeholder:text-gray-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>{" "}
            </div>
          </motion.div>
        </motion.div>

        <div
          className={`${!activeTab ? '' : 'hidden'}`}
          activeTab={activeTab === 0}
        >
          <CardPools
            activepool={activepool}
            searchTerm={searchTerm}
            isLoaded={isLoaded}
          />
        </div>

        <div
          className={`${activeTab ? '' : 'hidden'}`}
          activeTab={activeTab === 1}
        >
          <CardHorizontalPool activepool={activepool} isLoaded={isLoaded} />
        </div>
      </div>
    </>
  );
};
export default PoolsScreen;
