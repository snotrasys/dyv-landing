import { useState, useEffect, useContext, useCallback } from "react";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Clock, RefreshCw, ExternalLink,
  Wallet, AlertCircle, Loader2, ChevronDown, ChevronUp, CheckCircle,
} from "lucide-react";
import { useWeb3Modal } from "@web3modal/ethers5/react";
import { useWeb3ModalProvider } from "@web3modal/ethers5/react";
import { toast } from "react-hot-toast";
import Web3Context from "../context/Web3Context";
import { abi_MultiTokenVesting } from "../hooks/abiHelpers";

const VESTING_CONTRACT = "0x5B3B17F9B20D5A95dfe6B9e222F387599A037efa";
const BASE_RPC = "https://frequent-flashy-slug.base-mainnet.quiknode.pro/c768dd581cd676309f6d69af17ec7cd9b3e490e1";

// ─── helpers ────────────────────────────────────────────────────────────────
function fmt(n, dec = 2) {
  return Number(n ?? 0).toLocaleString("en-US", { maximumFractionDigits: dec });
}
function shortAddr(a = "") {
  if (!a || a.length < 10) return a;
  return `${a.slice(0, 6)}...${a.slice(-4)}`;
}
function bpsToPct(bps) {
  return (Number(bps) / 100).toFixed(2);
}
function numBn(bn, dec = 18) {
  try { return Number(ethers.utils.formatUnits(bn, dec)); } catch { return 0; }
}
function fmtBn(bn, dec = 18, maxDec = 4) {
  return fmt(numBn(bn, dec), maxDec);
}

function getCountdown(v, nowSec) {
  try {
    const start   = v.startTimestamp.toNumber();
    const elapsed = v.elapsedDays.toNumber();
    const DAY_SECONDS = 300; // 5 min por día en contrato de prueba (producción: 86400)
    const nextDay = start + (elapsed + 1) * DAY_SECONDS;
    const diff    = nextDay - nowSec;
    if (diff <= 0) return null;
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  } catch { return null; }
}

function getReadContract() {
  const provider = new ethers.providers.JsonRpcProvider(BASE_RPC);
  return new ethers.Contract(VESTING_CONTRACT, abi_MultiTokenVesting, provider);
}

// ═══════════════════════════════════════════════════════════════════════════
// USER PAGE
// ═══════════════════════════════════════════════════════════════════════════
export default function VestingUsers() {
  const { accounts } = useContext(Web3Context);
  const { open } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();

  const [totals, setTotals] = useState(null);
  const [vestings, setVestings] = useState([]);
  const [tokenMeta, setTokenMeta] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [claimingId, setClaimingId] = useState(null);
  const [claimingAll, setClaimingAll] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [now, setNow]               = useState(() => Math.floor(Date.now() / 1000));

  // Tick every second for countdowns
  useEffect(() => {
    const t = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  const getSignedContract = useCallback(() => {
    if (!walletProvider) return null;
    const provider = new ethers.providers.Web3Provider(walletProvider);
    return new ethers.Contract(VESTING_CONTRACT, abi_MultiTokenVesting, provider.getSigner());
  }, [walletProvider]);

  const erc20Abi = [
    { inputs: [], name: "decimals", outputs: [{ type: "uint8"   }], stateMutability: "view", type: "function" },
    { inputs: [], name: "symbol",   outputs: [{ type: "string"  }], stateMutability: "view", type: "function" },
  ];

  // Load user data + token decimals atomically
  useEffect(() => {
    if (!accounts) {
      setTotals(null);
      setVestings([]);
      setTokenMeta({});
      return;
    }

    let active = true;
    setLoadingData(true);

    (async () => {
      try {
        const c = getReadContract();
        const provider = new ethers.providers.JsonRpcProvider(BASE_RPC);
        const [totalsRes, vestingsRes] = await Promise.all([
          c.getBeneficiaryTotals(accounts),
          showAll
            ? c.getBeneficiaryVestingsBatch(accounts, 0, 50)
            : c.getActiveVestingsBatch(accounts, 0, 50),
        ]);
        const vestingList = vestingsRes[0] || [];

        const uniqueTokens = [...new Set(vestingList.map(v => v.token))];
        const metaResults = await Promise.all(
          uniqueTokens.map(async (token) => {
            try {
              const c = new ethers.Contract(token, erc20Abi, provider);
              const [decimals, symbol] = await Promise.all([c.decimals(), c.symbol()]);
              return [token, { decimals: Number(decimals), symbol }];
            } catch {
              return [token, { decimals: 18, symbol: shortAddr(token) }];
            }
          })
        );

        if (!active) return;
        setTotals(totalsRes);
        setVestings(vestingList);
        setTokenMeta(Object.fromEntries(metaResults));
      } catch (e) {
        console.error("loadData", e);
      } finally {
        if (active) setLoadingData(false);
      }
    })();

    return () => { active = false; };
  }, [accounts, showAll, refreshKey]);

  // ── claim single ────────────────────────────────────────────────────────
  const handleClaim = async (vestingId) => {
    if (!walletProvider || !accounts) return;
    const idStr = vestingId.toString();
    setClaimingId(idStr);
    try {
      const tx = await getSignedContract().claim(vestingId);
      toast.loading("Reclamando tokens…", { id: `claim-${idStr}` });
      await tx.wait();
      toast.success("Claim exitoso", { id: `claim-${idStr}` });
      setRefreshKey(k => k + 1);
    } catch (e) {
      toast.error(e?.reason || e?.message?.slice(0, 80) || "Error en el claim", { id: `claim-${idStr}` });
    } finally {
      setClaimingId(null);
    }
  };

  // ── claim all ───────────────────────────────────────────────────────────
  const handleClaimAll = async () => {
    if (!walletProvider || !accounts) return;
    setClaimingAll(true);
    try {
      const tx = await getSignedContract().claimAll();
      toast.loading("Reclamando todos los tokens…", { id: "claim-all" });
      await tx.wait();
      toast.success("Tokens reclamados", { id: "claim-all" });
      setRefreshKey(k => k + 1);
    } catch (e) {
      toast.error(e?.reason || e?.message?.slice(0, 80) || "Error en claimAll", { id: "claim-all" });
    } finally {
      setClaimingAll(false);
    }
  };

  const hasVestings = totals && !totals.totalVestings.isZero();

  // Per-token totals computed from vestings — avoids summing uint256 across tokens with different decimals
  const tokenTotals = Object.keys(tokenMeta).length > 0
    ? Object.values(
        vestings.reduce((acc, v) => {
          const token = v.token;
          const { decimals: dec, symbol } = tokenMeta[token] ?? { decimals: 18, symbol: shortAddr(token) };
          if (!acc[token]) acc[token] = { token, dec, symbol, totalAmount: 0, claimed: 0, claimable: 0, remaining: 0 };
          acc[token].totalAmount += numBn(v.totalAmount, dec);
          acc[token].claimed    += numBn(v.claimedAmount, dec);
          acc[token].claimable  += numBn(v.claimableNow, dec);
          acc[token].remaining  += numBn(v.remainingAmount, dec);
          return acc;
        }, {})
      )
    : [];

  const hasClaimable = tokenTotals.some(t => t.claimable > 0);

  // ── render ──────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex items-start justify-center p-4 pt-24"
      style={{ background: "radial-gradient(ellipse at 30% 10%, #061a30 0%, #060b18 65%)" }}
    >
      <div className="w-full max-w-md space-y-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-black text-white">Mi Vesting</h1>
            {accounts && (
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">{shortAddr(accounts)}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {accounts && (
              <button
                onClick={() => setRefreshKey(k => k + 1)}
                className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-white bg-white/[0.04] border border-white/[0.06]"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingData ? "animate-spin" : ""}`} />
              </button>
            )}
            <button
              onClick={() => open()}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-bold text-white"
              style={{ background: accounts ? "rgba(56,189,248,0.15)" : "linear-gradient(135deg, #0891b2, #0e7490)" }}
            >
              <Wallet className="h-3.5 w-3.5" />
              {accounts ? shortAddr(accounts) : "Conectar wallet"}
            </button>
          </div>
        </motion.div>

        {/* ── Not connected ── */}
        {!accounts && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="rounded-3xl p-10 text-center"
            style={{
              background: "linear-gradient(160deg, #0d1e3a 0%, #091526 100%)",
              border: "1px solid rgba(56,189,248,0.15)",
            }}
          >
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-lg font-black text-white mb-2">Conecta tu wallet</h2>
            <p className="text-sm text-slate-500 mb-6">
              Para ver tus vestings y reclamar tus tokens.
            </p>
            <button
              onClick={() => open()}
              className="px-6 py-3 rounded-xl font-bold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #0891b2, #0e7490)" }}
            >
              Conectar wallet
            </button>
          </motion.div>
        )}

        {/* ── Loading skeleton ── */}
        {accounts && loadingData && !totals && (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
          </div>
        )}

        {/* ── No vestings ── */}
        {accounts && totals && !hasVestings && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-2xl p-10 text-center"
            style={{ background: "linear-gradient(145deg, #0d1e3a, #091526)", border: "1px solid rgba(56,189,248,0.1)" }}
          >
            <div className="text-4xl mb-3">📭</div>
            <p className="text-white font-bold mb-1">Sin vestings asignados</p>
            <p className="text-sm text-slate-500">Esta wallet no tiene tokens en vesting.</p>
          </motion.div>
        )}

        {/* ── Main content ── */}
        {accounts && hasVestings && (
          <>
            {/* Stats card — one section per token */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.08 }}
              className="rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #0d1e3a 0%, #091526 100%)",
                border: "1px solid rgba(56,189,248,0.15)",
                boxShadow: "0 0 60px rgba(14,90,180,0.12)",
              }}
            >
              {tokenTotals.map(({ token, symbol, totalAmount, claimed, claimable, remaining }, i) => {
                const pct = totalAmount > 0 ? Math.min(100, (claimed / totalAmount) * 100) : 0;
                return (
                  <div key={token} className={i > 0 ? "border-t border-white/[0.05]" : ""}>
                    <div className="px-5 pt-3 flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-300">{symbol}</span>
                      <span className="text-[10px] font-mono text-slate-600">{shortAddr(token)}</span>
                      <a href={`https://basescan.org/token/${token}`} target="_blank" rel="noopener noreferrer"
                        className="text-slate-700 hover:text-slate-400 transition-colors">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="px-5 py-4 grid grid-cols-2 gap-3">
                      {[
                        { label: "Total asignado", val: fmt(totalAmount), color: "#60a5fa" },
                        { label: "Reclamado",       val: fmt(claimed),     color: "#34d399" },
                        { label: "Disponible",      val: fmt(claimable, 4), color: "#a78bfa" },
                        { label: "Restante",        val: fmt(remaining),   color: "#fbbf24" },
                      ].map(({ label, val, color }) => (
                        <div key={label} className="rounded-2xl px-4 py-3"
                          style={{ background: `${color}08`, border: `1px solid ${color}15` }}>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</div>
                          <div className="text-xl font-black font-mono mt-0.5" style={{ color }}>{val}</div>
                        </div>
                      ))}
                    </div>
                    <div className="px-5 pb-5">
                      <div className="flex justify-between text-[11px] mb-1.5">
                        <span className="text-slate-500 uppercase tracking-wide">Progreso</span>
                        <span className="font-mono text-cyan-400">{pct.toFixed(2)}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 + i * 0.1 }}
                          className="h-full rounded-full"
                          style={{ background: "linear-gradient(90deg, #0891b2, #38bdf8)" }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-[10px] text-slate-700 font-mono">
                        <span>{fmt(claimed)} reclamado</span>
                        <span>{fmt(totalAmount)} total</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Claim all card */}
            <AnimatePresence>
              {hasClaimable && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-2xl px-5 py-5"
                  style={{
                    background: "linear-gradient(145deg, #0d2a1e, #091a14)",
                    border: "1px solid rgba(52,211,153,0.2)",
                    boxShadow: "0 0 40px rgba(52,211,153,0.07)",
                  }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-slate-500 uppercase tracking-widest mb-2">
                        Disponible ahora
                      </div>
                      {tokenTotals.filter(t => t.claimable > 0).map(({ token, symbol, claimable }) => (
                        <div key={token} className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-white font-mono">{fmt(claimable, 4)}</span>
                          <span className="text-xs font-bold text-emerald-400">{symbol}</span>
                        </div>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                      onClick={handleClaimAll}
                      disabled={claimingAll}
                      className="flex flex-col items-center justify-center gap-1 px-5 py-4 rounded-2xl font-bold text-white disabled:opacity-70 flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #059669, #0d9488)",
                        boxShadow: "0 0 35px rgba(5,150,105,0.4)",
                      }}
                    >
                      {claimingAll
                        ? <Loader2 className="h-6 w-6 animate-spin" />
                        : <Zap className="h-6 w-6" />}
                      <span className="text-[11px] uppercase tracking-widest">Claim todo</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Vestings list */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: "linear-gradient(145deg, #0d1526, #0a1020)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              {/* List header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-bold text-white">Mis vestings</span>
                  {loadingData && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-600" />}
                </div>
                <button
                  onClick={() => setShowAll(v => !v)}
                  className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-white transition-colors"
                >
                  {showAll ? "Solo activos" : "Ver todos"}
                  {showAll ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              </div>

              {/* List body */}
              {vestings.length === 0 && !loadingData ? (
                <div className="text-center py-8 text-slate-600 text-sm">
                  Sin vestings {showAll ? "" : "activos"}
                </div>
              ) : (
                <div className="divide-y divide-white/[0.03]">
                  {vestings.map(v => {
                    const dec = tokenMeta[v.token]?.decimals ?? 18;
                    const claimable = numBn(v.claimableNow, dec);
                    const claimed = numBn(v.claimedAmount, dec);
                    const total = numBn(v.totalAmount, dec);
                    const pct = total > 0 ? Math.min(100, (claimed / total) * 100) : 0;
                    const idStr = v.vestingId.toString();
                    const isClaimingThis = claimingId === idStr;

                    return (
                      <div
                        key={idStr}
                        className="px-4 py-4"
                        style={{ opacity: (!v.active || v.revoked) ? 0.45 : 1 }}
                      >
                        {/* Row 1: status + claim button */}
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${v.revoked ? "bg-red-500"
                                  : v.active ? "bg-emerald-400 animate-pulse"
                                    : "bg-slate-600"
                                }`} />
                              <span className="text-xs font-bold text-slate-300">{tokenMeta[v.token]?.symbol ?? shortAddr(v.token)}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${v.revoked ? "bg-red-500/15 text-red-400"
                                  : v.active ? "bg-emerald-500/15 text-emerald-400"
                                    : "bg-slate-500/15 text-slate-500"
                                }`}>
                                {v.revoked ? "Revocado" : v.active ? "Activo" : "Completado"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-600">
                              <span className="text-purple-300">{bpsToPct(v.dailyBps)}%/día</span>
                              <span>{v.elapsedDays.toString()}d transcurridos</span>
                              <span className="text-slate-700">#{idStr}</span>
                            </div>
                          </div>

                          {v.active && !v.revoked && (() => {
                            const countdown = claimable === 0 ? getCountdown(v, now) : null;
                            return (
                              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                <motion.button
                                  whileHover={claimable > 0 ? { scale: 1.05 } : {}}
                                  whileTap={claimable > 0 ? { scale: 0.95 } : {}}
                                  onClick={() => claimable > 0 && handleClaim(v.vestingId)}
                                  disabled={isClaimingThis || claimable === 0}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-white disabled:cursor-not-allowed flex-shrink-0 transition-opacity"
                                  style={{
                                    background: claimable > 0
                                      ? "linear-gradient(135deg, #059669, #0d9488)"
                                      : "rgba(255,255,255,0.06)",
                                    opacity: claimable === 0 ? 0.45 : 1,
                                    border: claimable === 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
                                  }}
                                >
                                  {isClaimingThis
                                    ? <Loader2 className="h-3 w-3 animate-spin" />
                                    : <Zap className="h-3 w-3" />}
                                  {claimable > 0 ? fmt(claimable, 4) : "Claim"}
                                </motion.button>
                                {countdown && (
                                  <span className="text-[9px] font-mono text-slate-600 flex items-center gap-1">
                                    <Clock className="h-2.5 w-2.5" />{countdown}
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </div>

                        {/* Row 2: amounts grid */}
                        <div className="grid grid-cols-3 gap-2 mb-2 text-[10px]">
                          <div>
                            <div className="text-slate-600">Total</div>
                            <div className="font-mono text-white font-bold">{fmt(total, 2)}</div>
                          </div>
                          <div>
                            <div className="text-slate-600">Reclamado</div>
                            <div className="font-mono text-emerald-400 font-bold">{fmt(claimed, 2)}</div>
                          </div>
                          <div>
                            <div className="text-slate-600">Disponible</div>
                            <div className="font-mono text-purple-300 font-bold">{fmt(claimable, 4)}</div>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 rounded-full bg-white/[0.05]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[9px] font-mono text-slate-600 flex-shrink-0">
                            {pct.toFixed(1)}%
                          </span>
                          <a
                            href={`https://basescan.org/token/${v.token}`}
                            target="_blank" rel="noopener noreferrer"
                            className="text-slate-700 hover:text-slate-400 transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </>
        )}

        <div className="pb-10" />
      </div>
    </div>
  );
}
