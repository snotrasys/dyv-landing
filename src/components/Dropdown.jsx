import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const Dropdown = ({ liquidity, symbol }) => {
  return (
    <>
      <Menu
        as="div"
        className=" z-20 mt-2 flex justify-center text-left"
      >
        <div>
          <Menu.Button className="inline-flex w-full justify-center items-center rounded-md  bg-transparent px-4 py-1 text-base font-medium text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-100">
            Details
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute mt-10  w-3/6 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none md:w-80 ">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <>
                    <div className="-mt-px flex ">
                      <div className="flex w-0 flex-1">
                        <div className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border  border-transparent py-2 text-sm font-medium ">
                          <span className="ml-3">
                            Total Liquidity:{"    "}{liquidity} {symbol}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};
export default Dropdown;
