import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import PriceBNB from '@/components/PriceBNB';
import PriceETH from './PriceETH';
import PriceBTC from './PriceBTC';
import ImgS3 from './ImgS3';

const statuses = {
  Paid: 'text-green-700 bg-green-50 ring-green-600/20',
  Withdraw: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Overdue: 'text-red-700 bg-red-50 ring-red-600/10',
};
const clients = [
  {
    id: 1,
    name: 'BNB',
    imageUrl: '/bnb.png',
    lastInvoice: {
      date: 'December 13, 2022',
      dateTime: '2022-12-13',
      amount: <PriceBNB />,
      status: 'Overdue',
    },
  },
  {
    id: 2,
    name: 'BTC',
    imageUrl: '/btc.png',
    lastInvoice: {
      date: 'January 22, 2023',
      dateTime: '2023-01-22',
      amount: <PriceBTC/>,
      status: 'Paid',
    },
  },
  {
    id: 3,
    name: 'ETH',
    imageUrl: '/eth.png',
    lastInvoice: {
      date: 'January 23, 2023',
      dateTime: '2023-01-23',
      amount: <PriceETH />,
      status: 'Paid',
    },
  },
];



export default function CardToken() {
  return (
    <ul
      role="list"
      className="lg:mt-20 mt-12 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8 "
    >
      {clients.map((client) => (
        <li
        key={JSON.stringify(client)}
          className="overflow-hidden rounded-xl border border-[#a45de9]"
        >
         
          <dl className="-my-3 divide-y divide-[#a45de9] px-6 py-4 text-sm leading-6">
            <div className="flex  items-center justify-between gap-x-4 py-3">
            <div className="flex gap-x-4  items-center p-4">
            <ImgS3
              src={client.imageUrl}
              alt={client.name}
              className="h-12 w-12 flex-none rounded-lg bg-white p-1 object-cover ring-1 ring-[#a45de9]/10"
            />
            <div className="text-xl font-medium leading-6 text-gray-100">
              {client.name}
            </div>
          </div>
              <dd className="flex items-start gap-x-2">
                <div className="font-medium text-gray-100 text-xl">
                  {client.lastInvoice.amount} USD
                </div>
              </dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
