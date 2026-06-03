import React, { createContext, useState, useEffect, useContext } from 'react';
import Web3Context from './Web3Context';
import { utils } from 'ethers';
import { toast } from 'react-hot-toast';
import UsePresaleVesting from '@/hooks/UsePresaleVesting';
import { DateTime } from 'luxon';


const SwapContext = createContext();
const userDefaul = {
  user: '',
  id: 0,
  invest: 0,
  toWithdraw: 0,
  currentUserBalance: 0,
  tokenAmount: "",
  investAmount: "",
  totalWithdrawn: "",
  lastWithdrawn: "",
  hasWithdrawn: "",
  referrals: "",
  referrer: "",
  bonusToken: "",
  referrerCount_: [0, 0, 0, 0, 0, 0, 0],
  referrerAmount_: [0, 0, 0, 0, 0, 0, 0],
  referrerReward_: [0, 0, 0, 0, 0, 0, 0],
  data: [],
  nextDates: [],
};
 
const SwapProvider = ({ children }) => {
  const { accounts, isLoaded, setupdate, update, errorMessage } =
    useContext(Web3Context);
  const [update_, setupdate_] = useState(0);
  const [userData, setuserData] = useState(userDefaul);
  const [allData, setallData] = useState({
    totalInvested_: 0,
  });
  const [withdrawData, setWithdrawData] = useState([]);

  const Presale = UsePresaleVesting();

  useEffect(() => {
    if (!isLoaded) return;
    let ignore = false;
    const isStale = () => ignore;
    getPublicData(isStale);
    getUserData(isStale);

    return () => {
      ignore = true;
    };
  }, [accounts, isLoaded, update_]);

  const updateHandle = () => {
    setupdate_((prev) => prev + 1);
  };

  // Refetch resiliente al lag del RPC de Base tras minar una tx: reintenta varias veces
  const refresh = () => {
    updateHandle();
    setTimeout(updateHandle, 2500);
    setTimeout(updateHandle, 6000);
  };

  const invest = async (investAmt) => {
    if (!isLoaded) {
      errorMessage();
      return;
    }
    try {
      const res = await Presale.buy(investAmt);
      if (!res) return; // la compra falló (el hook ya mostró el error)
      await res.wait(); // espera a que se mine antes de refrescar
      toast.success('Invest success');
      refresh();
    } catch (err) {
      if (err.data != undefined) toast.error(err.data.message);
      else toast.error(err.message);
    }
  };
  const withdraw = async () => {
    if (!isLoaded) {
      errorMessage();
      return;
    }

    try {
      const res = await Presale.withdrawTokens();
      if (!res) return;
      await res.wait();
      toast.success('withdraw success');
      refresh();
    } catch (err) {
      if (err.data != undefined) toast.error(err.data.message);
      else toast.error(err.message);
    }
  };

  useEffect(() => {
    let ignore = false;
    const loadWithdrawData = async () => {
      if (!isLoaded || !accounts) {
        setWithdrawData([]);
        return;
      }
      try {
        const raw = await Presale.withdrawData(accounts);
        if (ignore) return;
        const mapped = (raw || []).map((e) => ({
          date: DateTime.fromSeconds(Number(e.date.toString())).toLocaleString(
            DateTime.DATETIME_MED,
          ),
          tokenAmount: ParseEther(e.tokenAmount),
        }));
        setWithdrawData(mapped);
      } catch (error) {
        if (!ignore) setWithdrawData([]);
      }
    };
    loadWithdrawData();
    return () => {
      ignore = true;
    };
  }, [accounts, isLoaded, update_]);

  // Formatea un timestamp (segundos) del contrato a fecha legible; 0 → '—'
  const formatDate = (value) => {
    const seconds = Number(value?.toString?.() ?? 0);
    return seconds > 0
      ? DateTime.fromSeconds(seconds).toLocaleString(DateTime.DATE_MED)
      : '—';
  };

  const getUserData = async (isStale = () => false) => {
    if (!isLoaded || !accounts) return;
    try {
      const [lastBlock_, data] = await Presale.sales();
      const currentUserBalance = await Presale.currentUserBalance(accounts);
      const nextDatesRaw = await Presale.nextDates();

      if (isStale() || !data) return;

      // Struct Sale del contrato (PreSaleVestingV5):
      // buyer, tokenAmount, bonusToken, investAmount, toWithdraw,
      // totalWithdrawn, lastWithdraw, hasWithdrawn, referrals,
      // referrer (uint[1]), referrerAmount (uint[1])
      const mapBigNumberArray = (arr) =>
        Array.isArray(arr) ? arr.map((e) => Number(e?.toString?.() ?? 0)) : [];

      const mapEtherArray = (arr) =>
        Array.isArray(arr) ? arr.map((e) => Number(ParseEther(e))) : [];

      const data_ = {
        user: data.buyer,
        id: 0,
        invest: ParseEther(data.investAmount),
        tokenAmount: ParseEther(data.tokenAmount),
        investAmount: ParseEther(data.investAmount),
        totalWithdrawn: ParseEther(data.totalWithdrawn),
        currentUserBalance: ParseEther(currentUserBalance),
        bonusToken: ParseEther(data.bonusToken),
        lastWithdrawn: data.lastWithdraw?.toString?.() ?? '0',
        hasWithdrawn: data.hasWithdrawn?.toString?.() ?? 'false',
        referrals: data.referrals,
        // El contrato sólo tiene 1 nivel de referidos (REFERRER_PERCENTS_LENGTH = 1)
        referrerCount_: mapBigNumberArray(data.referrer),
        referrerAmount_: mapEtherArray(data.referrerAmount),
        referrerReward_: [],
        data: [],
        nextDates: (nextDatesRaw || []).map(formatDate),
      };

      if (isStale()) return;
      setuserData((prev) => ({ ...prev, ...data_ }));
    } catch (error) {
      console.log('Errr user', error);
      if (!isStale()) setuserData(userDefaul);
    }
  };
 


  const ParseEther = (amount) => {    
    return Number(utils.formatUnits(amount, 18));
  };
  

  const getPublicData = async (isStale = () => false) => {
    if (!isLoaded) return;
    try {
      const data = await Presale.totalInvested();
      if (isStale()) return;
      setallData({ totalInvested_: ParseEther(data) });
    } catch (error) {
      console.log('Errr public', error);
    }
  };
  

  const datas = {
    userData,
    allData,
    invest,
    withdraw,
    updateHandle,
    getUserData,
    getPublicData,
    withdrawData
  };

  return <SwapContext.Provider value={datas}>{children}</SwapContext.Provider>;
};

export { SwapProvider };
export default SwapContext;

export const useSwap_ = ()=>useContext(SwapContext); 