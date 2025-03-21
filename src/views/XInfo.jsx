import { useEffect, useState } from 'react';
import { Layout } from '@/components/app/Layout';
/* eslint-disable */
const XInfo = () => {
  const [searchContract, setSearchContract] = useState('0x9aD9f995BdDDcd3D4D442fF7fdC75EfAfc7dBbCB');
  useEffect(() => {
    // Obtén el elemento del iframe por su ID
    const iframe = document.getElementById('idbook');

    // Verifica si se encontró el iframe
    if (iframe) {
      // Accede al contenido del iframe
      const iframeDocument =
        iframe?.contentDocument || iframe?.contentWindow.document;

      // Obtén el elemento con el enlace dentro del iframe
      const linkElement = iframeDocument.querySelector(
        'a[href="/bsc/0x9aD9f995BdDDcd3D4D442fF7fdC75EfAfc7dBbCB"]',
      );

      // Verifica si el elemento contiene el texto "Tracked by" dentro del iframe
      if (linkElement && linkElement.innerText.includes('Tracked by')) {
        // Elimina el nodo completo dentro del iframe
        console.log('Entro aqui');
        linkElement.remove();
      }
    }
  }, []);


  const handleSubmit = (event) => {
    event.preventDefault();
    const { value } = event.target.elements['search-contract'];
    setSearchContract(value);
  };

  return (
    <Layout>
    <div className="bg-[#411255] shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-100">Search Contract</h3>
        <form className="mt-5 sm:flex sm:items-center" onSubmit={handleSubmit}>
          <div className="w-full sm:max-w-xs">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <input
              type="text"
              name="search-contract"
              id="searct"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder={searchContract}
            />
          </div>
          <button
            type="submit"
            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
          >
            Search
          </button>
        </form>
      </div>
    </div>
    <div id="dexscreener-embed">
      <iframe
        id="idbook"
        src={`https://dexscreener.com/bsc/${searchContract}?embed=1&theme=dark&info=1`}
      />
    </div>
  </Layout>
  );
};

export default XInfo;
