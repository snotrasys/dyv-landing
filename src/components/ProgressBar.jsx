import * as React from 'react'
import {motion} from 'framer-motion'
const HARCAP = 500;

const ProgressBar = ({moduleProgress}) => {

    function percentComplete(input) {
        //console.log(input, "input")
        return (input * 100) / HARCAP;
      }
    

  if (!moduleProgress) {
    return null
  }


  return (
    <div className="w-60 h-full flex lg:flex-row items-center lg:max-w-md max-w-xs relative">
      <div className="uppercase flex items-center justify-center text-md text-gray-500 mr-2 mb-0">
       <span className="mr-2">completed</span> 
        <span className="text-gray-900 font-semibold text-xs -mt-px inline-block">
          {percentComplete}%
        </span>
      </div>
      <div className="h-1 w-full max-w-lg bg-gray-300 rounded-full relative">
        <motion.div
          animate={{width: `${40}%`}}
          initial={{width: `${40}%`}}
          transition={{duration: 0.5, type: 'spring', mass: 0.5}}
          className="bg-blue-500 h-1 transition-transform ease-in-out duration-75"
        />
        {/* <div
          css={{left: '75%'}}
          className={`w-5 h-5 -mt-3 rounded-full absolute border-2 border-gray-300 bg-background ${
            moduleProgress.percentComplete >= 75 ? 'border-blue-500' : ''
          }`}
        /> */}
        <div
          style={{left: '99%'}}
          className={`w-5 h-5 -mt-3 rounded-full absolute border-2 border-gray-300 bg-background ${
            percentComplete === 40 ? 'border-blue-500' : ''
          }`}
        />
      </div>
    </div>
  )
}

export default ProgressBar
