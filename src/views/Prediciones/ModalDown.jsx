import Modal from '@/components/Modal';
import { Layout } from '@/components/app/Layout';
import { ArrowLeftIcon, ArrowSmallDownIcon } from '@heroicons/react/20/solid';
import { BigNumber, ethers } from 'ethers';
import React, { useEffect } from 'react';
import { useState } from 'react';

function ModalDown({
  open,
  setOpen,
  background = true,
  allowClickToClose = false,
  size = 'md',
  flat,
  closeButton,
  className,
  currentBalance,
  handle,
}) {
  const [value, setValue] = useState(0);
  const [balance, setbalance] = useState(BigNumber.from(0));
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    setbalance(currentBalance);
    return () => {};
  }, [currentBalance]);

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      background={background}
      allowClickToClose={allowClickToClose}
      size={size}
      flat={flat}
      closeButton={closeButton}
      className={className}
    >
      <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
        <div className="ml-4 mt-2">
          <h3 className="flex items-center text-sm font-semibold leading-6 text-gray-100">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mr-2 text-white "
            >
              <ArrowLeftIcon className="h-6 w-auto" />
            </button>
            Set Position
          </h3>
        </div>
        <div className="ml-4 mt-2 flex-shrink-0">
          <button
            type="button"
            className="bg-gradient-red inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <ArrowSmallDownIcon
              className="-ml-0.5 h-5 w-5"
              aria-hidden="true"
            />
            DOWN
          </button>
        </div>
      </div>
      <div>
        <div className="mt-7">
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-100"
          >
            Commit: XIMBIA
          </label>
          <div className="mt-2">
            <input
              type="number"
              name="balance"
              id="balance"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="0.0000"
            />
            <p
              className="mt-2 text-right text-xs text-gray-100"
              id="number-description"
            >
              Balance:{ethers.utils.formatEther(balance)} XMB
            </p>
          </div>
        </div>
        <div className="mt-7 flex items-center">
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={handleChange}
            className="h-3 w-full appearance-none rounded-lg focus:outline-none"
            style={{
              background: `linear-gradient(to right, #4299e1 0%, #4299e1 ${value}%, #cbd5e0 ${value}%, #cbd5e0 100%)`,
            }}
          />
        </div>
        <p className="text-center text-white">{value} %</p>
      </div>
      <div className="flex justify-center">
        <div className="mt-4 inline-flex items-start space-x-4">
          <button
            type="button"
            onClick={() => setValue(10)}
            className="flex items-start justify-start rounded-md bg-purple-900 bg-opacity-60 px-2 py-0.5"
          >
            <p className="font-hbold text-xs text-white">10%</p>
          </button>
          <button
            type="button"
            onClick={() => setValue(25)}
            className="flex items-start justify-start rounded-md bg-purple-900 bg-opacity-60 px-2 py-0.5"
          >
            <p className="font-hbold text-xs text-white">25%</p>
          </button>
          <button
            type="button"
            onClick={() => setValue(50)}
            className="flex items-start justify-start rounded-md bg-purple-900 bg-opacity-60 px-2 py-0.5"
          >
            <p className="font-hbold text-xs text-white">50%</p>
          </button>
          <button
            type="button"
            onClick={() => setValue(75)}
            className="flex items-start justify-start rounded-md bg-purple-900 bg-opacity-60 px-2 py-0.5"
          >
            <p className="font-hbold text-xs text-white">75%</p>
          </button>
          <button
            type="button"
            onClick={() => setValue(100)}
            className="flex items-start justify-start rounded-md bg-purple-900 bg-opacity-60 px-2 py-0.5"
          >
            <p className="font-hbold text-xs text-white">Max</p>
          </button>
        </div>
      </div>
      <div className="mt-5">
        <button className="focus:shadow-outline-orange bg-gradient-red text-md block w-full transform rounded-lg border border-transparent  px-6 py-3 text-center font-semibold leading-6 text-white transition-all duration-150 ease-in-out hover:scale-105 focus:border-green-600 focus:outline-none ">
          Confirm
        </button>
      </div>
    </Modal>
  );
}

export default ModalDown;
