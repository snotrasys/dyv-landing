import React, { createContext, useState, useEffect, useContext } from 'react';
import Web3Context from './Web3Context';
import {
  address,
  usePresaleRoi,
  useTokenPresaleRoi,
} from '../hooks/useContracts.js';
import { constants, ethers, utils } from 'ethers';

import { toast } from 'react-hot-toast';
import refHandle from '../hooks/utils';

// Token uses 6 decimals (e.g. USDT/USDC)
const parse6Decimals = (value) =>
  Number(ethers.utils.formatUnits(value, 6)).toFixed(4);

const PresaleRoiContext = createContext({
  userData: {
    totalWithdrawn_: 0,
    totalRewards: 0,
    depositBalance: 0,
    totalDeposits_: 0,
    nextAssignment_: 0,
    amountOfDeposits: 0,
    checkpoint: 0,
    maxWithdraw: 0,
    referrer_: '',
    referrerCount_: [],
    userHasMaxWithDraw: false,
    checkUser: false,
  },
  allData: {
    totalUsers_: 0,
    totalInvested_: 0,
    totalWithdrawn_: 0,
    totalDeposits_: 0,
    balance_: 0,
    maxProfit: 0,
    daysFormdeploy: 0,
    MIN_WITHDRAW: 0,
    MIN_INVEST: 0,
    isPaused: false,
  },
  invest: () => { },
  withdraw: () => { },
  updateHandle: () => { },
  balanceOf: 0,
  balanceOfToken: 0,
  isApprove: false,
  approveHandle: () => { },
});

const userDefault = {
  totalWithdrawn_: 0,
  totalRewards: 0,
  depositBalance: 0,
  totalDeposits_: 0,
  nextAssignment_: 0,
  amountOfDeposits: 0,
  checkpoint: 0,
  maxWithdraw: 0,
  referrer_: '',
  referrerCount_: [],
  userHasMaxWithDraw: false,
  checkUser: false,
};

const PresaleRoiProvider = ({ children }) => {
  const { accounts, isLoaded, setupdate, update, errorMessage } =
    useContext(Web3Context);

  const [update_, setupdate_] = useState(0);
  const [userData, setuserData] = useState(userDefault);
  const [allData, setallData] = useState({
    totalUsers_: 0,
    totalInvested_: 0,
    totalWithdrawn_: 0,
    totalDeposits_: 0,
    balance_: 0,
    maxProfit: 0,
    daysFormdeploy: 0,
    MIN_WITHDRAW: 0,
    MIN_INVEST: 0,
    isPaused: false,
  });

  const [balanceOf, setbalanceOf_] = useState(0);
  const [balanceOfToken, setbalanceOfToken_] = useState(0);
  const [isApprove, setisApprove] = useState(false);


  const publicSale = usePresaleRoi();
  const Token = useTokenPresaleRoi(); // keep as-is (approve needs it)

  useEffect(() => {
    if (!isLoaded) return;
    try {
      getPublicData();
      getUserData();
      balanceOfETH();
      balanceOfHandle();
      allowanceHandle();
    } catch (error) {
      console.log(error);
    }
  }, [accounts, isLoaded, update_]);

  const updateHandle = () => setupdate_((prev) => prev + 1);

  // ─── Token balance ────────────────────────────────────────────────────────

  const balanceOfHandle = async () => {
    if (!isLoaded || accounts === '000000000000000000000000000000000000000000000') return;
    const [load, contract] = await Token;
    if (!load) return;
    const balance_ = await contract.balanceOf(accounts);
    setbalanceOfToken_(parse6Decimals(balance_));
  };

  const balanceOfETH = async () => {
    if (!isLoaded || accounts === '000000000000000000000000000000000000000000000') return;
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    const balance_ = await provider.getBalance(accounts);
    setbalanceOf_(Number(ethers.utils.formatEther(balance_)).toFixed(4));
  };

  // ─── Approve ─────────────────────────────────────────────────────────────

  const approveHandle = async () => {
    if (!isLoaded || accounts === '000000000000000000000000000000000000000000000') {
      toast.error('Wallet is not connected properly.');
      return false;
    }
    const [loadToken, contract] = await Token;
    if (!loadToken) {
      toast.error('Could not load Token contract.');
      return false;
    }

    const [loadSale, saleContract] = await publicSale;
    if (!loadSale) {
      toast.error('Could not load Sale contract.');
      return false;
    }

    try {
      const res = await contract.approve(saleContract.address, constants.MaxUint256);

      // Esperar específicamente a 1 bloque de confirmación en la red


      if (await res.wait(2)) {
        toast.success('Approve successful! (1 Block Confirmed)');
        setisApprove(true); // Actualización optimista de UI
        updateHandle();
        return true;
      } else {
        toast.error('Approve transaction failed.');
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message ?? error?.message ?? String(error));
      return false;
    }
  };

  const disapproveHandle = async () => {
    if (!isLoaded || accounts === '000000000000000000000000000000000000000000000') {
      toast.error('Wallet is not connected properly.');
      return false;
    }
    const [loadToken, contract] = await Token;
    if (!loadToken) {
      toast.error('Could not load Token contract.');
      return false;
    }

    const [loadSale, saleContract] = await publicSale;
    if (!loadSale) {
      toast.error('Could not load Sale contract.');
      return false;
    }

    try {
      const res = await contract.approve(saleContract.address, 0);

      // Esperar 1 bloque
      const receipt = await res.wait(1);

      if (receipt.status === 1) {
        toast.success('Disapprove successful! (1 Block Confirmed)');
        setisApprove(false); // Actualización optimista de UI
        updateHandle();
        return true;
      } else {
        toast.error('Disapprove transaction failed.');
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message ?? error?.message ?? String(error));
      return false;
    }
  };

  const allowanceHandle = async () => {
    if (!isLoaded || accounts === '000000000000000000000000000000000000000000000') return;
    const [load, contract] = await Token;
    if (!load) return;

    const [, saleContract] = await publicSale;
    const allowance_ = await contract.allowance(accounts, address.presaleRoi);
    setisApprove(allowance_.gte(utils.parseUnits("50", 6)));
  };

  // ─── invest ──────────────────────────────────────────────────────────────
  // investHandler(address _user, address referrer, uint investAmt, bool _isInvest, bool _payFee)

  const invest = async (investAmt) => {
    if (!isLoaded) { errorMessage(); return; }

    const ref_ = refHandle();

    try {
      const [load, contract] = await publicSale;
      if (!load) return;

      const amount = utils.parseUnits(investAmt.toString(), 6);

      const res = await contract.invest(
        ref_ || ethers.constants.AddressZero,
        amount,
      );

      // Esperar la confirmación del bloque antes de notificar y actualizar
      if (await res.wait(2)) {
        toast.success('Invest successful! (1 Block Confirmed)');
        updateHandle(); // Recarga la info general y del usuario
      } else {
        toast.error('Invest transaction failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message ?? err?.message ?? String(err));
    }
  };

  // ─── withdraw ─────────────────────────────────────────────────────────────
  // withdraw()

  const withdraw = async () => {
    if (!isLoaded) { errorMessage(); return; }

    try {
      const [load, contract] = await publicSale;
      if (!load) return;

      const res = await contract.withdraw();

      if (await res.wait(2)) {
        toast.success('Withdraw successful! (1 Block Confirmed)');
        updateHandle(); // Auto-recarga los datos
      } else {
        toast.error('Withdraw transaction failed.');
      }
    } catch (err) {
      toast.error(err?.data?.message ?? err?.message ?? String(err));
    }
  };

  // ─── getUserData ──────────────────────────────────────────────────────────
  // getUserData(address userAddress) external view returns (
  //   uint totalWithdrawn_, uint totalRewards, uint depositBalance,
  //   uint totalDeposits_, uint nextAssignment_, uint amountOfDeposits,
  //   uint checkpoint, uint maxWithdraw, address referrer_,
  //   uint[DIRECT_BONUS_LENGTH] memory referrerCount_)

  const getUserData = async () => {
    if (!isLoaded || accounts === '000000000000000000000000000000000000000000000') return;

    try {
      const [load, contract] = await publicSale;
      if (!load) return;

      const res = await contract.getUserData(accounts);

      const userCheck = await contract.checkUser(accounts);
      const hasMaxWithdraw = await contract.userHasMaxWithDraw(accounts);

      const data_ = {
        totalWithdrawn_: parse6Decimals(res.totalWithdrawn_),
        totalRewards: parse6Decimals(res.totalRewards),
        depositBalance: parse6Decimals(res.depositBalance),
        totalDeposits_: parse6Decimals(res.totalDeposits_),
        nextAssignment_: res.nextAssignment_.toString(),
        amountOfDeposits: res.amountOfDeposits.toString(),
        checkpoint: res.checkpoint.toString(),
        maxWithdraw: parse6Decimals(res.maxWithdraw),
        referrer_: res.referrer_,
        referrerCount_: res.referrerCount_.map((v) => v.toString()),
        checkUser: userCheck,
        userHasMaxWithDraw: hasMaxWithdraw,
      };

      setuserData((prev) => Object.assign({}, prev, data_));
    } catch (error) {
      console.log('Error getUserData:', error);
      setuserData(userDefault);
    }
  };

  // ─── getPublicData ────────────────────────────────────────────────────────
  // getPublicData() external view returns (
  //   uint totalUsers_, uint totalInvested_, uint totalWithdrawn_,
  //   uint totalDeposits_, uint balance_, uint maxProfit, uint daysFormdeploy)

  const getPublicData = async () => {
    if (!isLoaded || accounts === '000000000000000000000000000000000000000000000') return;

    try {
      const [load, contract] = await publicSale;
      if (!load) return;

      const res = await contract.getPublicData();
      const minW = await contract.MIN_WITHDRAW();
      const minI = await contract.MIN_INVEST();
      const paused = await contract.isPaused();

      const data_ = {
        totalUsers_: res.totalUsers_.toString(),
        totalInvested_: parse6Decimals(res.totalInvested_),
        totalWithdrawn_: parse6Decimals(res.totalWithdrawn_),
        totalDeposits_: parse6Decimals(res.totalDeposits_),
        balance_: parse6Decimals(res.balance_),
        maxProfit: res.maxProfit.toString(),
        daysFormdeploy: res.daysFormdeploy.toString(),
        MIN_WITHDRAW: parse6Decimals(minW),
        MIN_INVEST: parse6Decimals(minI),
        isPaused: paused,
      };

      setallData(data_);
    } catch (error) {
      console.log('Error getPublicData:', error);
    }
  };

  // ─── context value ────────────────────────────────────────────────────────

  const datas = {
    userData,
    allData,
    invest,
    withdraw,
    updateHandle,
    balanceOf,
    balanceOfToken,
    isApprove,
    approveHandle,
    disapproveHandle,
  };

  return (
    <PresaleRoiContext.Provider value={datas}>{children}</PresaleRoiContext.Provider>
  );
};

export const useSPresale = () => useContext(PresaleRoiContext);
export { PresaleRoiProvider };
export default PresaleRoiContext;