import { useState, useEffect, useContext, useCallback } from "react";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ChevronDown, ChevronUp, ExternalLink, Loader2 } from "lucide-react";
import { useWeb3Modal } from "@web3modal/ethers5/react";
import { useWeb3ModalProvider } from "@web3modal/ethers5/react";
import { toast } from "react-hot-toast";
import Web3Context from "../context/Web3Context";
import { abi_Airdrop } from "../hooks/abiHelpers";

const BASE_RPC = "https://frequent-flashy-slug.base-mainnet.quiknode.pro/c768dd581cd676309f6d69af17ec7cd9b3e490e1";
const TOKEN_DECIMALS = 6;

const POOLS = [
  {
    id: "jrcorp",
    label: "JR Corp",
    contract: "0x107f7d7A3C379367AAeAafCf576C2c075663EF58",
    color: "#fbbf24",
  },
  {
    id: "staker",
    label: "Staker ZUUX",
    contract: "0xca296FE4031145A3e8d5DC32fE5f232765463cB8",
    color: "#38bdf8",
  },
  {
    id: "nft",
    label: "NFT ZUUX",
    contract: "0x5877fa8dF889CA3049C82765a9410485B31adE5b",
    color: "#a78bfa",
  },
  {
    id: "test",
    label: "Test",
    contract: "0x30CF9c9663F8A7F599c7288d4EB1C8Dd61611Afe",
    color: "#34d399",
  },
];

function fmt(n, dec = 2) {
  return Number(n ?? 0).toLocaleString("en-US", { maximumFractionDigits: dec });
}

function shortAddr(a) {
  return `${a.slice(0, 6)}...${a.slice(-4)}`;
}

function fmtUnits(bn) {
  try {
    return Number(ethers.utils.formatUnits(bn, TOKEN_DECIMALS));
  } catch {
    return 0;
  }
}

function getReadContract(contractAddress) {
  const provider = new ethers.providers.JsonRpcProvider(BASE_RPC);
  return new ethers.Contract(contractAddress, abi_Airdrop, provider);
}

// ── PoolRow ──────────────────────────────────────────────────────────────────

function PoolRow({ pool, index, userAddress }) {
  const { walletProvider } = useWeb3ModalProvider();
  const { open } = useWeb3Modal();

  const [userData, setUserData] = useState(null); // { totalAmount, claimedAmount, balance }
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (!userAddress) { setUserData(null); return; }
    setLoading(true);
    try {
      const c = getReadContract(pool.contract);
      const [user, balance] = await c.getUserInfo(userAddress);
      setUserData({
        totalAmount: user.totalAmount,
        claimedAmount: user.claimedAmount,
        balance,
        isEligible: user.userAddress !== "0x0000000000000000000000000000000000000000",
      });
    } catch (e) {
      console.error(pool.label, e);
    } finally {
      setLoading(false);
    }
  }, [userAddress, pool.contract, pool.label]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleClaim = async () => {
    if (!userAddress) { open(); return; }
    if (!walletProvider) { toast.error("Conecta tu wallet"); return; }

    setClaiming(true);
    try {
      const provider = new ethers.providers.Web3Provider(walletProvider);
      const signer = provider.getSigner();
      const c = new ethers.Contract(pool.contract, abi_Airdrop, signer);
      const tx = await c.claim();
      toast.loading("Confirmando...", { id: pool.id });
      await tx.wait();
      toast.success("Claim exitoso!", { id: pool.id });
      await fetchUserData();
    } catch (e) {
      toast.error(e?.reason || e?.message || "Error en el claim", { id: pool.id });
    } finally {
      setClaiming(false);
    }
  };

  const totalNum = userData ? fmtUnits(userData.totalAmount) : 0;
  const claimedNum = userData ? fmtUnits(userData.claimedAmount) : 0;
  const balanceNum = userData ? fmtUnits(userData.balance) : 0;
  const progress = totalNum > 0 ? (claimedNum / totalNum) * 100 : 0;
  const isEligible = userData?.isEligible ?? null;
  const canClaim = userData && userData.balance.gt(0) && !claiming;

  return (
    <motion.div
      key={pool.id}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-2xl px-4 py-4"
      style={{
        background: "linear-gradient(145deg, #0d1526, #0a1020)",
        border: `1px solid ${pool.color}22`,
        boxShadow: `0 0 24px ${pool.color}10`,
      }}
    >
      <div className="flex items-center gap-4">
        {/* Left: label + datos */}
        <div className="flex-1 min-w-0">
          <div
            className="text-[11px] font-semibold uppercase tracking-widest mb-0.5"
            style={{ color: pool.color }}
          >
            {pool.label}
          </div>

          {loading && !userData ? (
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Loader2 className="h-3 w-3 animate-spin" /> Cargando...
            </div>
          ) : !userAddress ? (
            <div className="text-xs text-slate-500 mt-1">Conecta tu wallet</div>
          ) : isEligible === false ? (
            <div className="text-xs text-slate-500 mt-1">No elegible para airdrop</div>
          ) : userData ? (
            <>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-white font-mono">
                  {fmt(balanceNum, 2)}
                </span>
                <span className="text-xs text-slate-500">DYV disp.</span>
              </div>

              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span
                  className="text-[10px] font-mono rounded-full px-2 py-0.5"
                  style={{ background: `${pool.color}15`, color: pool.color }}
                >
                  0.3% daily
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {fmt(claimedNum, 2)} / {fmt(totalNum, 2)} DYV
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-2 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: pool.color }}
                />
              </div>
              <div className="text-[10px] text-slate-600 mt-0.5 font-mono">
                {progress.toFixed(1)}% reclamado
              </div>
            </>
          ) : null}
        </div>

        {/* Right: Claim button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleClaim}
          disabled={userAddress ? !canClaim : false}
          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(135deg, ${pool.color}cc, ${pool.color}77)`,
            boxShadow: `0 4px 20px ${pool.color}30`,
          }}
        >
          {claiming ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Zap className="h-3.5 w-3.5" />
          )}
          {claiming ? "..." : "Claim DYV"}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AirdropDYV() {
  const { accounts } = useContext(Web3Context);
  const { open } = useWeb3Modal();
  const [showHistory, setShowHistory] = useState(false);
  const [claimHistory, setClaimHistory] = useState([]);

  // Fetch Claim events for the connected wallet across all pools
  useEffect(() => {
    if (!accounts) { setClaimHistory([]); return; }

    let cancelled = false;
    async function fetchHistory() {
      const provider = new ethers.providers.JsonRpcProvider(BASE_RPC);
      const results = [];

      for (const pool of POOLS) {
        try {
          const c = new ethers.Contract(pool.contract, abi_Airdrop, provider);
          const filter = c.filters.Claim(accounts);
          const events = await c.queryFilter(filter);
          for (const e of events) {
            const block = await provider.getBlock(e.blockNumber);
            results.push({
              id: pool.id,
              label: pool.label,
              color: pool.color,
              amount: fmtUnits(e.args.amount),
              date: new Date(block.timestamp * 1000).toISOString().slice(0, 10),
            });
          }
        } catch (e) {
          console.error("History fetch error:", pool.label, e);
        }
      }

      if (!cancelled) {
        results.sort((a, b) => b.date.localeCompare(a.date));
        setClaimHistory(results);
      }
    }

    fetchHistory();
    return () => { cancelled = true; };
  }, [accounts]);

  const totalClaimed = claimHistory.reduce((s, h) => s + h.amount, 0);

  return (
    <div
      className="min-h-screen flex items-start justify-center p-4 pt-10"
      style={{
        background: "radial-gradient(ellipse at 50% -10%, #0f1f45 0%, #060b18 65%)",
      }}
    >
      <div className="w-full max-w-md space-y-3">

        {/* ── Title ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center mt-20"
        >
          <h1 className="text-3xl font-black tracking-tight text-white">
            Airdrop <span style={{ color: "#60a5fa" }}>DYV</span>
          </h1>
          <p className="text-[12px] text-slate-500 mt-1">
            Vesting 0.3% diario · BASE Network
          </p>
          {!accounts && (
            <button
              onClick={() => open()}
              className="mt-3 text-xs px-4 py-1.5 rounded-full font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #3b82f6cc, #3b82f677)" }}
            >
              Conectar wallet
            </button>
          )}
        </motion.div>

        {/* ── Pool rows ── */}
        {POOLS.map((pool, i) => (
          <PoolRow key={pool.id} pool={pool} index={i} userAddress={accounts} />
        ))}

        {/* ── History panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #0d1526, #0a1020)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <button
            onClick={() => setShowHistory((h) => !h)}
            className="w-full flex items-center justify-between px-4 py-4"
          >
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 text-left">
                Historial de retiros
              </div>
              <div className="text-lg font-black text-white font-mono mt-0.5">
                {fmt(totalClaimed, 2)}{" "}
                <span className="text-sm font-normal text-slate-500">DYV retirados</span>
              </div>
            </div>
            <div className="h-8 w-8 rounded-xl bg-white/[0.04] flex items-center justify-center">
              {showHistory
                ? <ChevronUp className="h-4 w-4 text-slate-400" />
                : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-2 border-t border-white/[0.04] pt-3">
                  {claimHistory.length === 0 ? (
                    <p className="text-xs text-slate-600 text-center py-2">
                      {accounts ? "Sin historial de claims" : "Conecta tu wallet para ver historial"}
                    </p>
                  ) : (
                    claimHistory.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl px-3 py-2.5"
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="h-2 w-2 rounded-full flex-shrink-0"
                            style={{ background: h.color }}
                          />
                          <div>
                            <div className="text-xs font-semibold text-white">{h.label}</div>
                            <div className="text-[10px] text-slate-600 font-mono">{h.date}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className="text-sm font-bold font-mono"
                            style={{ color: h.color }}
                          >
                            +{fmt(h.amount, 2)}
                          </div>
                          <div className="text-[10px] text-slate-600">DYV</div>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Contracts reference */}
                  <div className="pt-2 space-y-1.5">
                    {POOLS.map((p) => (
                      <a
                        key={p.id}
                        href={`https://basescan.org/address/${p.contract}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-[10px] font-mono px-2 py-1 rounded-lg hover:bg-white/[0.03] transition-colors"
                      >
                        <span style={{ color: p.color }}>{p.label}</span>
                        <span className="flex items-center gap-1 text-slate-600">
                          {shortAddr(p.contract)}
                          <ExternalLink className="h-2.5 w-2.5" />
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="pb-8" />
      </div>
    </div>
  );
}
