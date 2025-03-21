import React from 'react';
import farmsData from './farmsData';
import ApproveCardFarm from './ApproveCardFarm';
import { motion } from 'framer-motion';
/* eslint-disable */
const FarmsCardGrid = ({ searchTerm }) => {
  const data = farmsData
    .filter((farm) => {
      if (searchTerm === '') {
        return farm;
      } else if (farm.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return farm;
      }
    })
    .map((farm) => {
      return <ApproveCardFarm key={JSON.stringify(farm)} pool={farm} />;
    });

  const containerMotion = {
    initial: { opacity: 0, transition: { duration: 1 } },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };
  return (
    <>
      <div className="mx-auto max-w-7xl ">
        <motion.div
          initial="initial"
          whileInView="visible"
          spacing="small"
          variants={containerMotion}
          viewport={{ once: true }}
          className="mx-auto mt-16  "
        >
          <div className="-mt-8 sm:-mx-4 sm:columns-2  lg:columns-3">
            {data}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default FarmsCardGrid;
