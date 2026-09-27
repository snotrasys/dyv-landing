import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Contract, utils } from 'ethers';
import { toast } from 'react-hot-toast';
import { address, PRESALE_CHAIN_ID, usePresaleVestingContract } from '@/hooks/useContracts';
import Web3Context from './Web3Context';

const SwapContext = createContext(null);
const tokenAbi = ['function decimals() view returns (uint8)', 'function balanceOf(address) view returns (uint256)'];
const errorText = (error) => error?.code === 4001 || error?.code === 'ACTION_REJECTED'
  ? 'Transaction cancelled.'
  : error?.reason || error?.data?.message || error?.message || 'Unable to read the vesting contract.';

const SwapProvider = ({ children }) => {
  const { accounts, isLoaded } = useContext(Web3Context);
  const contractPromise = usePresaleVestingContract();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const requestId = useRef(0);
  const transactionLock = useRef(false);

  const getContract = useCallback(async () => {
    const [loaded, contract] = await contractPromise;
    if (!loaded || !accounts) throw new Error('Connect your wallet to continue.');
    const network = await contract.provider.getNetwork();
    if (network.chainId !== PRESALE_CHAIN_ID) throw new Error('Switch your wallet to Base to continue.');
    const tokenAddress = await contract.TOKEN();
    if (tokenAddress.toLowerCase() !== address.presaleVestingToken.toLowerCase()) {
      throw new Error('The vesting token does not match the configured D&V token.');
    }
    return contract;
  }, [contractPromise, accounts]);

  const refresh = useCallback(async () => {
    const id = ++requestId.current;
    setData(null);
    setError('');
    if (!isLoaded || !accounts) { setLoading(false); return; }
    setLoading(true);
    try {
      const contract = await getContract();
      const token = new Contract(address.presaleVestingToken, tokenAbi, contract.provider);
      const [decimals, balance, vesting, available, vested, enabled, allocated, withdrawn, users, endDate] = await Promise.all([
        token.decimals(), token.balanceOf(accounts), contract.vestings(accounts),
        contract.currentUserBalance(accounts), contract.vestedAmount(accounts), contract.startWithdraw(),
        contract.totalAllocated(), contract.totalTokensWithdrawn(), contract.totalUsers(), contract.endDate(),
      ]);
      const format = (value) => utils.formatUnits(value, decimals);
      const progress = vesting.amount.isZero() ? 0 : Math.min(100, vesting.withdrawn.mul(10000).div(vesting.amount).toNumber() / 100);
      if (id !== requestId.current) return;
      setData({
        account: accounts, allocation: format(vesting.amount), withdrawn: format(vesting.withdrawn),
        available: format(available), vested: format(vested), balance: format(balance),
        initialized: vesting.initialized, lastWithdraw: vesting.lastWithdraw.toNumber(),
        enabled, canClaim: enabled && vesting.initialized && available.gt(0), progress,
        totalAllocated: format(allocated), totalWithdrawn: format(withdrawn), totalUsers: users.toString(),
        endDate: endDate.toNumber(),
      });
    } catch (err) {
      if (id === requestId.current) { setData(null); setError(errorText(err)); }
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [accounts, isLoaded, getContract]);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 30000);
    return () => { ++requestId.current; clearInterval(timer); };
  }, [refresh]);

  const withdraw = async () => {
    if (transactionLock.current) return;
    transactionLock.current = true;
    setPending(true);
    try {
      const contract = await getContract();
      const signerAddress = await contract.signer.getAddress();
      if (signerAddress.toLowerCase() !== accounts.toLowerCase()) throw new Error('Wallet account changed. Reconnect and try again.');
      const [enabled, available] = await Promise.all([contract.startWithdraw(), contract.currentUserBalance(accounts)]);
      if (!enabled) throw new Error('Withdrawals are currently paused.');
      if (available.isZero()) throw new Error('No tokens are available to claim.');
      await contract.callStatic.withdrawTokens();
      const tx = await contract.withdrawTokens();
      let receipt;
      try { receipt = await tx.wait(); } catch (err) {
        if (err.code !== 'TRANSACTION_REPLACED' || err.cancelled) throw err;
        receipt = err.receipt;
      }
      if (receipt.status !== 1) throw new Error('The withdrawal failed.');
      toast.success('Tokens claimed successfully.');
      await refresh();
    } catch (err) {
      toast.error(errorText(err));
    } finally {
      transactionLock.current = false;
      setPending(false);
    }
  };

  // Never display balances from a previously connected account.
  const currentData = isLoaded && data?.account === accounts ? data : null;
  return <SwapContext.Provider value={{ data: currentData, loading, error, pending, refresh, withdraw }}>{children}</SwapContext.Provider>;
};

export { SwapProvider };
export default SwapContext;
export const useSwap_ = () => useContext(SwapContext);
