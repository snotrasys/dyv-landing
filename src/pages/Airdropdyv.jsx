import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

// ── mock state (wire up context later) ─────────────────────────────────────
const POOLS = [
  {
    id: "jrcorp",
    label: "JR Corp",
    balance: 5000,
    unit: "USD",
    dailyPct: 0.3,
    dyvAvailable: 23.0,
    dyvTotal: 23000,
    dyvClaimed: 2760,
    contract: "0x107f7d7A3C379367AAeAafCf576C2c075663EF58",
    color: "#fbbf24",
  },
  {
    id: "staker",
    label: "Staker ZUUX",
    balance: 2000,
    unit: "ZUUX",
    dailyPct: 0.3,
    dyvAvailable: 15.6,
    dyvTotal: 5200,
    dyvClaimed: 624,
    contract: "0xca296FE4031145A3e8d5DC32fE5f232765463cB8",
    color: "#38bdf8",
  },
  {
    id: "nft",
    label: "NFT ZUUX",
    balance: 3,
    unit: "NFT",
    dailyPct: 0.3,
    dyvAvailable: 7.5,
    dyvTotal: 750,
    dyvClaimed: 90,
    contract: "0x5877fa8dF889CA3049C82765a9410485B31adE5b",
    color: "#a78bfa",
  },
];

// mock claim history
const HISTORY = [
  { id: "jrcorp", label: "JR Corp",     amount: 2760, date: "2025-03-01" },
  { id: "staker", label: "Staker ZUUX", amount: 624,  date: "2025-02-28" },
  { id: "nft",    label: "NFT ZUUX",    amount: 90,   date: "2025-02-27" },
  { id: "jrcorp", label: "JR Corp",     amount: 1380, date: "2025-02-15" },
];

function fmt(n, dec = 2) {
  return Number(n ?? 0).toLocaleString("en-US", { maximumFractionDigits: dec });
}

function shortAddr(a) {
  return `${a.slice(0, 6)}...${a.slice(-4)}`;
}

export default function AirdropDYV() {
  const [showHistory, setShowHistory] = useState(false);

  const totalClaimed = HISTORY.reduce((s, h) => s + h.amount, 0);

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
        </motion.div>

        {/* ── Pool rows ── */}
        {POOLS.map((pool, i) => (
          <motion.div
            key={pool.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl px-4 py-4 flex items-center gap-4"
            style={{
              background: "linear-gradient(145deg, #0d1526, #0a1020)",
              border: `1px solid ${pool.color}22`,
              boxShadow: `0 0 24px ${pool.color}10`,
            }}
          >
            {/* Left: label + balance */}
            <div className="flex-1 min-w-0">
              <div
                className="text-[11px] font-semibold uppercase tracking-widest mb-0.5"
                style={{ color: pool.color }}
              >
                {pool.label}
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-white font-mono">
                  {fmt(pool.balance, 0)}
                </span>
                <span className="text-xs text-slate-500">{pool.unit}</span>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-[10px] font-mono rounded-full px-2 py-0.5"
                  style={{ background: `${pool.color}15`, color: pool.color }}
                >
                  {pool.dailyPct}% daily
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {fmt(pool.dyvAvailable, 2)} DYV disp.
                </span>
              </div>
            </div>

            {/* Right: Claim button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm text-white"
              style={{
                background: `linear-gradient(135deg, ${pool.color}cc, ${pool.color}77)`,
                boxShadow: `0 4px 20px ${pool.color}30`,
              }}
            >
              <Zap className="h-3.5 w-3.5" />
              Claim DYV
            </motion.button>
          </motion.div>
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
          {/* Toggle header */}
          <button
            onClick={() => setShowHistory((h) => !h)}
            className="w-full flex items-center justify-between px-4 py-4"
          >
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 text-left">
                Historial de retiros
              </div>
              <div className="text-lg font-black text-white font-mono mt-0.5">
                {fmt(totalClaimed, 0)}{" "}
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
                  {HISTORY.map((h, i) => {
                    const pool = POOLS.find((p) => p.id === h.id);
                    return (
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
                            style={{ background: pool?.color ?? "#888" }}
                          />
                          <div>
                            <div className="text-xs font-semibold text-white">{h.label}</div>
                            <div className="text-[10px] text-slate-600 font-mono">{h.date}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className="text-sm font-bold font-mono"
                            style={{ color: pool?.color ?? "#fff" }}
                          >
                            +{fmt(h.amount, 0)}
                          </div>
                          <div className="text-[10px] text-slate-600">DYV</div>
                        </div>
                      </div>
                    );
                  })}

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