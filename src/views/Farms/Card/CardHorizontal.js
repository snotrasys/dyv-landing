import React from "react";
import farmsData from './farmsData'
import ImgS3 from "@/components/ImgS3";




const CardHorizontal = () => {
  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-purple-800">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider"
                      >
                        APR
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider"
                      >
                        EARNED
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider"
                      >
                        STAKED
                      </th>
                      <th scope="col" className="relative px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {farmsData.map((person) => (
                      <tr key={JSON.stringify(person)}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {person.name}
                        </td>
                        <td className="flex px-1 py-8 whitespace-nowrap text-sm text-gray-500">
                          {new Intl.NumberFormat().format(person.APR)}%{" "}
                       
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {person.earned}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          0
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <ImgS3
                            src={person.image}
                            alt="imagelolli"
                            className="w-16"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>{" "}
      </div>
    </>
  );
};
export default CardHorizontal;
