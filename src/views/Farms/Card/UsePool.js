import { useMemo, useContext, useState, useEffect } from 'react';
import Web3Context from '../../../context/Web3Context';
import { Contract, ethers } from 'ethers';
import { useMasterChef } from '../../../hooks/useContracts.js';
import { useToken } from '../../../hooks/UseToken.js';

import { DateTime } from 'luxon';

export const address = {
  fantom: '',
  privateSale: '0xDc5556F24077beDbb64E32544400A98Ae5F878d8',
  publicSale: '0x58E9b9F8535d7266130c8162cFd5fB7A28257109',
  masterchefv2: '0x960f41592d7572e5CC8a008816Be57e8497c11E3',

  busd: '',
};

export const UsePool = (pool) => {
  const { accounts, isLoaded, connect } = useContext(Web3Context);
  const Token = useToken("0x9aD9f995BdDDcd3D4D442fF7fdC75EfAfc7dBbCB");
  const MasterChef = useMasterChef();
  const [youStake, setyouStake] = useState(0);
  const [approve, setapprove] = useState(false);
  const [allowance, setallowance] = useState(0);
  const [pending, setpending] = useState(0);
  // const [liquidity, setliquidity] = useState(0);
  const [reward, setreward] = useState(0);
  const [amountRef, setamountRef] = useState(0);
  const [symbol, setsymbol] = useState('');
  const [canDepost, setcanDepost] = useState(false);
  const [canHarvest, setcanHarvest] = useState(false);
  const [canWithdraw, setcanWithdraw] = useState(false);
  const [balanceOf, setbalanceOf] = useState(0);
  const [aprView, setaprView] = useState('10000');
  const [update, setupdate] = useState(1);
  const [pendingview, setpendingview] = useState(0);
  const [youStakeView, setyouStakeView] = useState(0);
  const [decimal, setdecimal] = useState(18);
  const [liquidity, settotalLiquidity] = useState(0);

  useEffect(() => {
    const test = async () => {
      // await poolInfo();
      // await poolUSerInfo();
      aprLP();
    };
    if (isLoaded) test();
    return () => {};
  }, [isLoaded, accounts, update, pool.poolID]);
  const poolInfo = async () => {
    try {
      const [load, contract] = await MasterChef;
      const poolInfo_ = await contract.poolInfo(pool.poolID);
      const canDepost = await contract.canDepost(pool.poolID);
      const poolIsActive = await contract.poolIsActive(pool.poolID);
      const returnPoolPerSecond = await contract.returnPoolPerSecond(
        pool.poolID,
      );
      const getTokenAddressBalance = await contract.getTokenAddressBalance(
        pool.address,
      );

      // console.log(getTokenAddressBalance.toString(), 'getTokenAddressBalance');
      setcanDepost(canDepost);
      settotalLiquidity(getTokenAddressBalance.toString());

      return {
        poolInfo_,
        canDepost,
        poolIsActive,
        returnPoolPerSecond,
        getTokenAddressBalance,
      };
    } catch (error) {
      console.log(error);
    }
  };
  const poolUSerInfo = async () => {
    try {
      const [load, contract] = await MasterChef;
      const canHarvest = await contract.canHarvest(pool.poolID, accounts);
      const pendingToken = await contract.pendingToken(pool.poolID, accounts);
      const returnUserPerSecond = await contract.returnUserPerSecond(
        pool.poolID,
        accounts,
      );
      const userInfo = await contract.userInfo(pool.poolID, accounts);
      setcanHarvest(canHarvest);
      setcanWithdraw(
        parseInt(userInfo.unlockDate.toString()) < DateTime.now().toSeconds() &&
          canHarvest,
      );
      // canHarvest()
      setyouStake(userInfo.amount.toString());
      setyouStakeView(
        parseFloat(ethers.utils.formatEther(userInfo.amount)).toFixed(4),
      );
      setpendingview(
        parseFloat(ethers.utils.formatEther(pendingToken.toString())).toFixed(
          4,
        ),
      );
      return { userInfo, canHarvest, pendingToken, returnUserPerSecond };
    } catch (error) {
      console.log(error);
      console.log('error', `${pool.name}`);
    }
  };
  const updateHandler = () => {
    setupdate((e) => e + 1);
  };

  const lpInfo = async () => {
    try {
      const [token] = Token;
      let contract = await token.contract();
      const totalSupply = await contract.totalSupply();
      const token1 = await contract.token1();
      const token0 = await contract.token0();
      const getReserves = await contract.getReserves();
      console.log(getReserves, 'getReserves');
      return {
        totalSupply,
        token1,
        token0,
        getReserves,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const getPriceHandle = async (address_) => {
    const provider = await connect();
    const signer = provider.getSigner();
    const Lib = new ethers.Contract(
      '0xC85dcAb88b034F4A340C9d123f61703A8e187f24',
      [
        `function BUSD () external view returns (address)`,
        `function getBnbToTokens(
    address token,
    uint _amount
) public view override returns (uint256)`,
        `function getTokensToBnb(
  address token,
  uint _amount
) public view override returns (uint256)`,
        ` function getTokensToBNBtoBusd(
  address token,
  uint _amount
) public view override returns (uint256)`,
      ],
      signer,
      // new ethers.VoidSigner('0x991028dBE1acf4C7Fe5238C0630e094BC84847D6',provider),
    );

    // console.log(
    //   await Lib.BUSD(),"BUSD"
    // );
    //     return
    const busd = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56';
    const usdt = '0x55d398326f99059fF775485246999027B3197955';
    const bnb = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
    if (address_ == bnb) {
      return await Lib.getBnbToTokens(busd, ethers.utils.parseEther('1'));
    }
    if (address_ == busd || address_ == usdt) {
      return ethers.utils.parseEther('1');
    }
    return await Lib.getTokensToBNBtoBusd(
      address_,
      ethers.utils.parseEther('1'),
    );
  };

  const apr = async () => {
    try {      
      const {
        poolInfo_,
        canDepost,
        poolIsActive,
        returnPoolPerSecond,
        getTokenAddressBalance,
        liquidity,
      } = await poolInfo();
      const secondPYear = 365 * 24 * 60 * 60;

      const token0Price = await getPriceHandle("0x3bdeECae844b96A133F98e54e36eB85414ffe5c9");
      const poolLiquidityUsd = getTokenAddressBalance
        .mul(token0Price)
        .div(ethers.utils.parseEther('1'));
        // 0x3bdeECae844b96A133F98e54e36eB85414ffe5c9
      const cakePriceUsd = await getPriceHandle(
        '0x843D79bFA7532247A68dA9f9a72b1133409bDDBc',
      );
      const yearlyCakeRewardAllocation_ = returnPoolPerSecond.mul(secondPYear);
      const yearlyCakeRewardAllocationUsd =
        yearlyCakeRewardAllocation_.mul(cakePriceUsd);
      const apr = yearlyCakeRewardAllocationUsd.mul(100).div(poolLiquidityUsd);

      return parseFloat(ethers.utils.formatEther(apr)).toFixed(2);
    } catch (error) {
      console.log(error);
    }
  };

  const aprLP = async () => {
    try {
      // if (pool.poolID != 0) return;
      // const {
      //   poolInfo_,
      //   canDepost,
      //   poolIsActive,
      //   returnPoolPerSecond,
      //   getTokenAddressBalance,
      //   liquidity,
      // } = await poolInfo();
      const secondPYear = 365 * 24 * 60 * 60;

      const { totalSupply, token1, token0, getReserves } = await lpInfo();

      // console.log(totalSupply,"totalSupply");

      // return

      console.log({
        totalSupply:        totalSupply.toString(),
        token1,
        token0,
        xin:getReserves[0].toString(),
        bnb:getReserves[1].toString(),
      });
      const reserve0 = getReserves[0];
      const reserve1 = getReserves[1];
      const token0Price = await getPriceHandle(token0);
      const token1Price = await getPriceHandle(token1);
      const valueToken0 = reserve0.mul(token0Price);
      const valueToken1 = reserve1.mul(token1Price);
      const totalLiquidity = valueToken0.add(valueToken1);
      


      console.log({
        price1:        token0Price.toString(),
        price2:       token1Price.toString(),
        totalLiquidity:totalLiquidity.toString(),
        reserve0:reserve0.toString(),
        reserve1:reserve1.toString(),
        valueToken0:valueToken0.div(ethers.utils.parseEther("1")).toString(),
        valueToken1:valueToken1.div(ethers.utils.parseEther("1")).toString(),
      }

      );
      const priceLp = totalLiquidity.div(totalSupply);


      console.warn(priceLp.toString(),"priceLp");


      // const poolLiquidityUsd = getTokenAddressBalance
      //   .mul(priceLp)
      //   .div(ethers.utils.parseEther('1'));
      // const cakePriceUsd = await getPriceHandle(
      //   '0x843D79bFA7532247A68dA9f9a72b1133409bDDBc',
      // );
      // const yearlyCakeRewardAllocation_ = returnPoolPerSecond.mul(secondPYear);
      // const yearlyCakeRewardAllocationUsd =
      //   yearlyCakeRewardAllocation_.mul(cakePriceUsd);
      // const apr = yearlyCakeRewardAllocationUsd.mul(100).div(poolLiquidityUsd);

      // return parseFloat(ethers.utils.formatEther(apr)).toFixed(2);
    } catch (error) {
      console.log(error,"LP");
    }
  };

  return useMemo(() => {
    if (!isLoaded) return [false, null];
    try {
      return [
        {
          canDepost,
          canHarvest,
          canWithdraw,
          youStake,
          youStakeView,
          pendingview,
          liquidity,
          updateHandler,
          poolInfo,
          poolUSerInfo,
          lpInfo,
          apr,
          aprLP,
        },
      ];
    } catch (e) {
      console.log(e);
      return [false, update];
    }
  }, [
    accounts,
    isLoaded,

    canDepost,
    canHarvest,
    canWithdraw,
    youStake,
    youStakeView,
    pendingview,
    liquidity,
  ]);
};
