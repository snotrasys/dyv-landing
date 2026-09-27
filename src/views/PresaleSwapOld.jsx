import React, { useContext } from 'react';
import { Wallet, Coins } from 'lucide-react';
import { address } from '@/hooks/useContracts';
import Web3Context from '@/context/Web3Context';
import { useSwap_ } from '@/context/SwapHandle';

const dateLabel = (seconds) => seconds ? new Date(seconds * 1000).toLocaleString() : 'Not set';
const PresaleSwapOld = () => {
  const { isLoaded, connectWallet } = useContext(Web3Context);
  const { data, loading, error, pending, refresh, withdraw } = useSwap_();
  const stats = [
    ['Your allocation', data?.allocation], ['Available to claim', data?.available],
    ['Total claimed', data?.withdrawn], ['Vested tokens', data?.vested],
    ['Wallet balance', data?.balance], ['Total allocated', data?.totalAllocated],
  ];

  return (
    <section className="w-full rounded-2xl border border-blue-900/40 bg-gradient-to-br from-[#070b28] to-[#0f1a3a] p-6 text-blue-100 shadow-2xl sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <Coins className="h-8 w-8 text-blue-400" />
        <div><h2 className="text-2xl font-semibold">Presale vesting</h2><p className="text-sm text-blue-300">D&V token · Base</p></div>
      </div>
      {!isLoaded && <p className="mb-5 text-sm text-blue-200">Connect your wallet to view your allocation and available tokens.</p>}
      {error && <div role="alert" className="mb-5 rounded-lg border border-red-500/40 bg-red-900/20 p-4 text-sm text-red-200">{error}</div>}
      <div aria-busy={loading} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {stats.map(([label, value]) => <div key={label} className="min-w-0 rounded-xl bg-blue-900/20 p-4">
          <p className="text-sm text-blue-300">{label}</p>
          <p className="mt-1 break-words font-semibold">{value ?? '—'} <span className="text-xs text-blue-300">D&V</span></p>
        </div>)}
      </div>
      {data && <div className="my-6 space-y-3 text-sm">
        <div className="flex justify-between"><span>Claimed allocation</span><span>{data.progress.toFixed(2)}%</span></div>
        <div role="progressbar" aria-label="Claimed allocation" aria-valuenow={data.progress} aria-valuemin={0} aria-valuemax={100} className="h-3 overflow-hidden rounded-full bg-blue-950">
          <div className="h-full bg-blue-500 transition-all" style={{ width: `${data.progress}%` }} />
        </div>
        <p>Withdrawals: {data.enabled ? 'Enabled' : 'Paused'}</p>
        <p>End date: {dateLabel(data.endDate)}</p>
        <p>Last claim: {data.lastWithdraw ? dateLabel(data.lastWithdraw) : 'No claims yet'}</p>
        <p>Total participants: {data.totalUsers}</p>
        <p>Total claimed by all participants: {data.totalWithdrawn} D&V</p>
        {!data.initialized && <p className="text-amber-200">This wallet has no token allocation.</p>}
        {data.initialized && !data.canClaim && data.enabled && <p className="text-blue-300">No tokens are currently available to claim.</p>}
      </div>}
      <div className="mt-6 space-y-3">
        {!isLoaded ? <button onClick={connectWallet} className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 p-3 font-semibold hover:bg-blue-500"><Wallet className="h-5 w-5" />Connect wallet</button> : <>
          <button onClick={withdraw} disabled={pending || loading || !data?.canClaim} className="w-full rounded-lg bg-emerald-600 p-3 font-semibold hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40">{pending ? 'Confirming claim…' : 'Claim D&V tokens'}</button>
          <button onClick={refresh} disabled={loading || pending} className="w-full rounded-lg border border-blue-800 p-3 text-sm hover:bg-blue-900/30 disabled:opacity-40">{loading ? 'Loading…' : 'Refresh balances'}</button>
        </>}
      </div>
      <div className="mt-6 space-y-3 border-t border-blue-900 pt-4 text-xs text-blue-300">
        {[['Contract', address.presaleVesting], ['Token', address.presaleVestingToken]].map(([label, value]) => <p key={label}>{label}<a className="mt-1 block break-all underline" href={`https://basescan.org/address/${value}`} target="_blank" rel="noopener noreferrer">{value}</a></p>)}
      </div>
    </section>
  );
};

export default PresaleSwapOld;
