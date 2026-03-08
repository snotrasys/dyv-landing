import React, { useState, useContext, useEffect } from 'react';
import Web3Context from '@/context/Web3Context';
import { motion } from 'framer-motion';
import { useCountdownV2 } from '@/hooks/useCountdown';

import {
  ArrowRightCircle, BadgeCheck, Coins, Clock,
  DollarSign, Zap
} from 'lucide-react';

import clsx from 'clsx';
import { useSPresale } from '@/context/PresaleRoiHandle';

const DAILY_RATE = 1.0;
const MIN_USD = 50;
const MAX_USD = 2000;

function fmt(n, dec = 4) {
  return Number(n ?? 0).toLocaleString('en-US', {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec
  });
}

export default function PresaleSwap() {
  const {
    userData,
    allData,
    invest,
    withdraw,
    isApprove,
    approveHandle,
    disapproveHandle,
    balanceOfToken,
  } = useSPresale();

  const { isLoaded } = useContext(Web3Context);

  const withdrawDataContext = useCountdownV2();
  const [amount, setAmount] = useState(50);
  const [isApproving, setIsApproving] = useState(false);

  const dailyReturn = amount * (DAILY_RATE / 100);

  // allData vars: totalInvested_, totalUsers_, maxProfit, daysFormdeploy
  const totalRaised = allData?.totalInvested_
    ? Number(allData.totalInvested_) + 105740
    : 0;
  const raisedPct = Math.min((totalRaised / 4_000_000) * 100, 100);

  useEffect(() => {
    // approvals and balances are handled inside PresaleRoiHandle automatically
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || !userData?.nextAssignment_) return;
    withdrawDataContext.setDate(Number(userData.nextAssignment_));
  }, [userData, isLoaded]);

  async function handleApproveAndInvest() {
    try {
      setIsApproving(true);
      await approveHandle();
      // Ya no llamamos invest() aquí para que el usuario de click en Invest posteriormente.
    } catch (e) {
      console.error(e);
    } finally {
      setIsApproving(false);
    }
  }

  const minWithdraw = allData?.MIN_WITHDRAW || 0;

  // El saldo disponible en tiempo real para retirar del usuario está en userData.depositBalance
  const availableToClaim = Number(userData?.depositBalance ?? 0);

  const isPaused = allData?.isPaused;
  const hasMaxWithdraw = userData?.userHasMaxWithDraw;

  // Usamos el contador en vivo (!withdrawDataContext.isNotActive representa que expiró la cuenta atrás)
  // en lugar de usar el static `userData.checkUser` que requiere refrescar la página.
  const canClaim = !isPaused && !hasMaxWithdraw && !withdrawDataContext.isNotActive && availableToClaim > 0 && availableToClaim >= Number(minWithdraw);

  return (
    <div className="flex justify-center p-2">
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl"
        style={{
          background: 'linear-gradient(160deg, #060c20 0%, #0c1730 55%, #060e1e 100%)',
          border: '1px solid rgba(30,60,160,0.25)',
          boxShadow: '0 0 80px rgba(10,40,140,0.2), 0 0 0 1px rgba(255,255,255,0.03)'
        }}
      >

        {/* HEADER */}
        <div className="px-6 pt-6 pb-5 border-b border-white/[0.05]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600/30 to-blue-900/60 border border-blue-500/20 flex items-center justify-center">

                <img src="/logo.png" alt="DYV" className="h-5 w-5" onError={e => { e.target.style.display = 'none'; }} />
              </div>
              <div>
                <p className="text-[11px] font-semibold tracking-[0.15em] text-blue-400/80 uppercase">D&V Token</p>
                <h1 className="text-base font-bold text-white leading-none mt-0.5">Stake</h1>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-emerald-400 tracking-wide">LIVE</span>
            </div>
          </div>
        </div>

        {/* PRESALE PROGRESS */}
        <div className="hidden px-6 py-4 border-b border-white/[0.05]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-semibold tracking-[0.12em] text-slate-500 uppercase">Presale Progress</span>
            <span className="text-xs font-mono text-slate-400">{raisedPct.toFixed(1)}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.04] border border-white/[0.06] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${raisedPct}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
            />
          </div>
          <div className="flex justify-between mt-1.5 text-[11px] text-slate-600 font-mono">
            <span>${fmt(totalRaised, 0)}</span>
            <span>$4,000,000</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { label: 'Daily ROI', value: '1%' },
              { label: 'Max ROI', value: `${allData?.maxProfit ? Number(allData.maxProfit) / 1000 : 500}%` },
              { label: 'Day', value: allData?.daysFormdeploy ?? '—' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg bg-white/[0.03] border border-white/[0.05] px-3 py-2.5 text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</div>
                <div className="text-sm font-bold text-white mt-0.5">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* MY STATS */}
        <div className="px-6 py-4 border-b border-white/[0.05]">
          <div className="grid grid-cols-2 gap-3">

            {/* Invested = totalDeposits_ */}
            <div className="rounded-xl bg-blue-500/[0.06] border border-blue-500/15 p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <DollarSign className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-[10px] font-semibold tracking-widest text-blue-400/70 uppercase">Invested</span>
              </div>
              <div className="text-xl font-bold text-white leading-none">
                {fmt(userData?.totalDeposits_ ?? 0)} <span className="text-xs font-normal text-slate-500">USDC</span>
              </div>
              <div className="text-[11px] text-slate-600 mt-1 font-mono">
                Balance: {fmt(userData?.depositBalance ?? 0)} USDC
              </div>
            </div>

            {/* Withdrawn = totalWithdrawn_ */}
            <div className="rounded-xl bg-emerald-500/[0.06] border border-emerald-500/15 p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Coins className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[10px] font-semibold tracking-widest text-emerald-400/70 uppercase">Withdrawn</span>
              </div>
              <div className="text-xl font-bold text-white leading-none">
                {fmt(userData?.totalWithdrawn_ ?? 0)} <span className="text-xs font-normal text-slate-500">USDC</span>
              </div>
              <div className="text-[11px] text-slate-600 mt-1 font-mono">
                Rewards: {fmt(userData?.totalRewards ?? 0)} USDC
              </div>
            </div>
          </div>

          {/* Available to claim = maxWithdraw */}
          <div className="mt-3 rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wide">Available to Claim</div>
              <div className="text-base font-bold text-cyan-300 mt-0.5">
                {fmt(availableToClaim)} USDC
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500">Daily return</div>
              <div className="text-sm font-semibold text-cyan-400/80">{DAILY_RATE}% / day</div>
            </div>
          </div>
        </div>

        {/* INVEST INPUT */}
        <div className="px-6 py-4 border-b border-white/[0.05]">
          <label className="text-[10px] font-semibold tracking-[0.15em] text-slate-500 uppercase block mb-3">
            Investment Amount
          </label>

          <div className="relative mb-2">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">$</span>
            <input
              type="number"
              onChange={e => {
                if (e.target.value === '') {
                  setAmount(0);
                } else {
                  setAmount(Number(e.target.value));
                }
              }}
              className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 pl-8 pr-4 py-3 text-xl font-bold text-white font-mono outline-none transition-all placeholder-slate-700"
              placeholder="50"
            />
          </div>

          <div className="flex gap-1.5 mb-3">
            {[50, 100, 500, 1000, 2000].map(v => (
              <button
                key={v}
                onClick={() => setAmount(v)}
                className={clsx(
                  "flex-1 rounded-lg py-1.5 text-[11px] font-semibold transition-all",
                  amount === v
                    ? "bg-blue-500/20 border border-blue-500/40 text-blue-300"
                    : "bg-white/[0.03] border border-white/[0.06] text-slate-600 hover:text-slate-400"
                )}
              >
                ${v}
              </button>
            ))}
          </div>

          <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] px-4 py-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">You invest</span>
              <span className="text-white font-mono font-semibold">${fmt(amount)} USDC</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Daily return</span>
              <span className="text-cyan-400 font-mono">≈ ${fmt(dailyReturn)} / day</span>
            </div>
            <div className="flex justify-between text-xs border-t border-white/[0.05] pt-2">
              <span className="text-slate-500">Wallet balance</span>
              <span className="text-slate-400 font-mono">{balanceOfToken || '0'} USDC</span>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="px-6 py-4 space-y-2.5 border-b border-white/[0.05]">
          {isApprove ? (
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => invest(amount)}
                disabled={isPaused}
                className={clsx(
                  "flex flex-1 items-center justify-center gap-2.5 rounded-xl py-3.5 font-bold text-sm text-white",
                  isPaused && "opacity-60 cursor-not-allowed bg-slate-700"
                )}
                style={!isPaused ? { background: 'linear-gradient(135deg, #1d4ed8, #0891b2)' } : {}}
              >
                <ArrowRightCircle className="h-4 w-4" />
                {isPaused ? 'Paused' : `Invest $${fmt(amount)} USDC`}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={async () => {
                  try {
                    setIsApproving(true);
                    await disapproveHandle();
                  } finally {
                    setIsApproving(false);
                  }
                }}
                disabled={isApproving}
                className="flex items-center justify-center rounded-xl px-4 font-bold text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
                title="Quitar Aprobación (Test)"
              >
                {isApproving ? '...' : 'Revoke'}
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApproveAndInvest}
              disabled={isApproving || isPaused}
              className={clsx(
                "flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 font-bold text-sm text-white transition-all",
                (isApproving || isPaused) ? "opacity-60 cursor-wait bg-slate-700" : ""
              )}
              style={!(isApproving || isPaused) ? { background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' } : {}}
            >
              {(isApproving || isPaused) ? <Clock className="h-4 w-4 animate-pulse" /> : <BadgeCheck className="h-4 w-4" />}
              {isApproving ? 'Approving...' : isPaused ? 'Paused' : 'Approve USDC'}
            </motion.button>
          )}

   <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => withdraw()}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 font-bold text-sm text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #059669, #0d9488)' }}
          >
            <Zap className="h-4 w-4" />
            {`Claim ${fmt(availableToClaim ?? 0)} USD in DYV`}
          </motion.button>


        </div>

        {/* FOOTER */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between text-[11px] text-slate-600">
            <span>BASE Network · Smart Contract</span>
            <span className="font-mono hidden">Min ${MIN_USD} — Max ${MAX_USD}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
