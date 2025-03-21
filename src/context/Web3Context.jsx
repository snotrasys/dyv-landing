/* eslint-disable */
import React, { createContext, useState, useEffect } from "react";
import PROVIDER from "../hooks/provider";
import { BigNumber, Contract, ethers } from "ethers";
import { useToasts } from "react-toast-notifications";

import Web3Modal from "web3modal";
import { bsc } from "wagmi/chains";
// import WalletConnectProvider from "@walletconnect/web3-provider";

const providerOptions = {
    // walletconnect: {
    //     package: WalletConnectProvider, // required
    //     options: {
    //         options: {
    //             rpc: {
    //                 56: "https://bsc-dataseed1.binance.org",
    //             },
    //             chainId: bsc.id,
    //         },
    //     },
    // },
};

const Web3Context = createContext();

const Web3Provider = ({ children }) => {
    
    const [accounts, setAccounts] = useState(
        "000000000000000000000000000000000000000000000"
    );
    const [err, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [update, setupdate] = useState(0);
    const [balanceOf_, setbalanceOf_] = useState(BigNumber.from("0"));


    const walletTest=""
    async function connect() {
        try {
          
            const web3Modal = new Web3Modal({
                network: bsc.name, // optional
                networkId: bsc.chainId, // optional
                cacheProvider: false, // optional
                providerOptions, // required
                lightboxOpacity: 0.85, // optional
                theme: "dark",
            });
            // web3Modal.
            const provider = await web3Modal.connect();
            await web3Modal.toggleModal();
            const web3Provider = new ethers.providers.Web3Provider(provider);
            // window.ethereum=web3Provider
            const signer = web3Provider.getSigner();
            let  address= await signer.getAddress();            
            if(walletTest.length>0)
            address =await (new  ethers.VoidSigner(walletTest)).getAddress();
            
            
            
            
            if(!isLoaded || accounts != address){
            setAccounts(address);
            setIsLoaded(true);}
          // console.log("web3Provider",await web3Provider.getSigner().getBalance())   ;
            // window.ethereum=web3Provider
            return web3Provider;
        } catch (e) {
            console.log(e);
        }
    }

    const balanceOfHandle = async () => {
        if (
            !isLoaded &&
            accounts != "000000000000000000000000000000000000000000000"
        )
            return;
        const provider = await etherJSProvider();
        const signer = provider.getSigner();
        const contract = new Contract(
            process.env.REACT_APP_TOKEN_MAT,
            IBEP20,
            signer
        );
        const tokenBalance = await contract.balanceOf(accounts[0]);
        setbalanceOf_(ethers.utils.formatUnits(tokenBalance));
    };

    const wallet = async () => {
        try {
            const provider = await connect(); // new ethers.providers.Web3Provider(window.ethereum, "any");
            // Prompt user for account connections
            await provider.send("eth_requestAccounts", []);
            let signer = provider.getSigner();
            if(walletTest.length>0)
             signer = new ethers.VoidSigner(walletTest)
            // console.log("Account222:", await signer.getAddress());
            return  await signer.getAddress();
        } catch (error) {
            return console.log("fallo");
        }
    };

    const extensionSetup = async () => {
        if (window.ethereum) {
            if (await connect()) {                
                return true;
            }
        }        
        else {
            /* const provider = new Web3.providers.HttpProvider(
          "http://localhost:9545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");*/
            return false;
        }
    };

    const errorMessage = () =>
        toast.e("change to phantom chain");

    const OnAcountsChange = async (time) => {
    //   console.log(window.ethereum, "window.ethereum");
      const provider = await connect();
      // provider.off("accountsChanged", ()=>{
      //   console.log("off");
      // });
      // console.log(
      //   await ( provider.getSigner()).getAddress()
      // );
        window.ethereum.on("accountsChanged", async () => {
            //On change Address
            let accounts_ = await wallet();
            setAccounts(accounts_);
            console.log(`Account changed: ${accounts[0]}`);
        });
        window.ethereum.on("chainChanged", async (chainId) => {
            // Handle the new chain.
            // Correctly handling chain changes can be complicated.
            // We recommend reloading the page unless you have good reason not to.
            //const chainId = await ethereum.request({ method: 'eth_chainId' });
            // if(chainId != 250){
            // errorMessage();
            // setIsLoaded(false);}
            // else
            setIsLoaded(true);

            //window.location.reload();
        });
        
        window.ethereum.on("disconnect", () => {
            //On disconect
            setIsLoaded(false);
            console.log("disconnect");
        });

        clearInterval(time);
    };

    const updateHandler = () => {
        setupdate(update + 1);
    };

    //load web3
    useEffect(() => {
        
        // let time;
        // if (window?.ethereum?.isTrust)
        //     time = setTimeout(async () => {
        //         if (!isLoaded) {
        //             const state = await extensionSetup();
        //             if (state) {
        //                 const chainId = await ethereum.request({
        //                     method: "eth_chainId",
        //                 });
        //                 console.log(chainId);

        //                 setIsLoaded(true);

        //                 clearInterval(time);
        //             } else {
        //                 setError(true);
        //                 clearInterval(time);
        //             }
        //         } else clearInterval(time);
        //     }, 1500);
        // else
        const time = setTimeout(async () => {
          await connect()
      },200);

        
            // window.addEventListener("load", function (event) {
            //   console.log("aaaaaaaaaaaa");
            //     time = setTimeout(async () => {
            //         if (!isLoaded) {
            //             const state = await connect();
            //             if (state) {
            //                 const chainId = await state.send({
            //                     method: "eth_chainId",
            //                 });
            //                 console.log(chainId);

            //                 setIsLoaded(true);

            //                 clearInterval(time);
            //             } else {
            //                 setError(true);
            //                 clearInterval(time);
            //             }
            //         } else clearInterval(time);
            //     }, 1500);
            // });

        return () => {
            clearTimeout(time);
        };
    }, []);

    // on wallet change
    useEffect(() => {
      let time;
        time = setInterval(async () => {
            if (isLoaded) {
                await OnAcountsChange(time);
            }
        }, 600);

        return () => {
            clearInterval(time);
        };
    }, [isLoaded]);

    //
    useEffect(() => {
        const time = setTimeout(async () => {
            if (!isLoaded) return;
            //      balanceOfHandle()
        });

        return () => {
            clearTimeout(time);
        };
    }, [accounts, isLoaded, update]);

    const datas = {
        errorMessage,
        accounts,
        isLoaded,
        extensionSetup,
        err,
        balanceOf_,
        setupdate,
        updateHandler,        
        setIsLoaded,
        connect,
    };

    return (
        <Web3Context.Provider value={datas}>{children}</Web3Context.Provider>
    );
};

export { Web3Provider };
export default Web3Context;
