const  BSCmain= [
    {
      chainId: `0x${parseInt("56", 10).toString(16)}`,
      chainName: 'Binance Smart Chain Mainnet',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'bnb',
        decimals: 18,
      },
      rpcUrls: ['https://bsc-dataseed.binance.org/'],
      blockExplorerUrls: ['https://bscscan.com/'],
    },
  ]

const  BSCTest =[
    {
        chainId: `0x${parseInt(process.env.REACT_APP_CHAIN_ID_TEST, 10).toString(16)}`,
      chainName: 'Binance Smart Chain Testnet',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'bnb',
        decimals: 18,
      },
      rpcUrls: ['https://speedy-nodes-nyc.moralis.io/e42b3c0b4ce0b28a66394535/bsc/testnet'],
      blockExplorerUrls: ['https://testnet.bscscan.com'],
    },
  ]

  const  DEV =[
    {
        chainId: `0x${parseInt(1337, 10).toString(16)}`,
      chainName: 'Localhost 8545',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: ['localhost:8545'],
      blockExplorerUrls: [""],
    },
  ]
  export default {BSCmain,BSCTest,DEV}
