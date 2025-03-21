import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function DropdownItems() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-lg p-2 font-redthinker text-2xl uppercase leading-6 text-purple-700 hover:border hover:border-slate-800 hover:bg-black ">
          More
          <ChevronDownIcon
            className="-mr-1 h-7 w-7 text-gray-100"
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-[#383838] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/launchpad"
                  className={classNames(
                    active ? ' text-gray-100' : 'text-gray-200',
                    'block px-4 py-2 text-sm',
                  )}
                >
                  <div>Launchpad</div>
                  <div className="whitespace-normal text-left text-[9px] text-[#b5b2b2]">
                    Participate in the hottest new DeFi projects
                  </div>
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/referrals"
                  className={classNames(
                    active ? ' text-gray-100' : 'text-gray-200',
                    'block px-4 py-2 text-sm',
                  )}
                >
                  <div>Referral</div>
                  <div className="whitespace-normal text-left text-[9px] text-[#b5b2b2]">
                    Invite friends, earn crypto
                  </div>
                </Link>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
