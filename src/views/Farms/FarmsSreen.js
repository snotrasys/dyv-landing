import React, { useState } from "react";

import FarmsCardGrid from "./Card/FarmsCardGrid";
import CardHorizontal from "./Card/CardHorizontal";
import { motion } from "framer-motion";


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const FarmsScreen = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const [enabled1, setEnabled1] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const handleTabSwitch = (e) => {
    e.preventDefault();
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
                {/*
                
                 <div className="flex-shrink-0">
                  <button
                    onClick={handleTabSwitch}
                    
                    activeTab={activeTab === 0}
                    id={0}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    1
                    <img src="/farm/Grupo_14499.svg" className="w-6.5" alt="" />
                  </button>{" "}
                </div>
                <div className="ml-4">
                  <button
                    type="button"
                    onClick={handleTabSwitch}
                    activeTab={activeTab === 1}
                    id={1}
                    className="inline-flex text-white items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    {" "}
                    2
                    <img
                      src="/farm/Grupo_14497.svg"
                      alt=""
                      className="w-6.5"
                      onClick={handleTabSwitch}
                      activeTab={activeTab === 1}
                      id={1}
                    />
                  </button>
                </div>
                
                
                
                */}
               

            
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
          className={` sm:ml-0 ${!activeTab ? "" : "hidden"}`}
          activeTab={activeTab === 0}
        >
          <FarmsCardGrid searchTerm={searchTerm} />
        </div>

        <div
          className={` ${activeTab ? "" : "hidden"}`}
          activeTab={activeTab === 1}
        >
          <CardHorizontal />
        </div>
      </div>
    </>
  );
};
export default FarmsScreen;
