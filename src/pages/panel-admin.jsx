import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Users, Plus, Trash2, Upload, Wallet,
  ChevronRight, Zap, Eye, EyeOff, Settings,
  CheckCircle, Clock, ExternalLink
} from "lucide-react";

// ─── helpers ───────────────────────────────────────────────────────────────
function fmt(n, dec = 2) {
  return Number(n ?? 0).toLocaleString("en-US", { maximumFractionDigits: dec });
}
function shortAddr(a = "") {
  return `${a.slice(0, 6)}...${a.slice(-4)}`;
}

// ─── mock state ────────────────────────────────────────────────────────────
const MOCK_TOKEN = {
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  symbol: "DYV",
  decimals: 18,
  balance: "2,500,000",
};

const MOCK_ALLOCATIONS = [
  { wallet: "0xABCd1234567890abcdef1234567890ABCDEF1234", amount: 10000, vestingPct: 1.0, claimed: 1200, active: true },
  { wallet: "0x9876FEDCBA9876fedcba9876FEDCBA9876fedcba", amount: 5000,  vestingPct: 0.5, claimed: 250,  active: true },
  { wallet: "0x1111222233334444AABB5566778899CCDDEE0011", amount: 25000, vestingPct: 2.0, claimed: 5000, active: false },
];

// ─── ADMIN PAGE ─────────────────────────────────────────────────────────────
function AdminPage({ onSwitch }) {
  const [tokenAddr, setTokenAddr]         = useState("");
  const [tokenLoaded, setTokenLoaded]     = useState(false);
  const [allocations, setAllocations]     = useState(MOCK_ALLOCATIONS);
  const [newWallet, setNewWallet]         = useState("");
  const [newAmount, setNewAmount]         = useState("");
  const [newVesting, setNewVesting]       = useState("1");
  const [showAddForm, setShowAddForm]     = useState(false);
  const [activeTab, setActiveTab]         = useState("allocations"); // allocations | stats

  function addAllocation() {
    if (!newWallet || !newAmount) return;
    setAllocations(prev => [...prev, {
      wallet: newWallet,
      amount: Number(newAmount),
      vestingPct: Number(newVesting),
      claimed: 0,
      active: true,
    }]);
    setNewWallet(""); setNewAmount(""); setNewVesting("1");
    setShowAddForm(false);
  }

  function removeAllocation(i) {
    setAllocations(prev => prev.filter((_, idx) => idx !== i));
  }

  const totalAllocated = allocations.reduce((s, a) => s + a.amount, 0);
  const totalClaimed   = allocations.reduce((s, a) => s + a.claimed, 0);

  return (
    <div className="min-h-screen p-4 pt-8"
      style={{ background: "radial-gradient(ellipse at 70% -5%, #1a0a2e 0%, #080b18 60%)" }}
    >
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-2"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed44, #4f46e544)", border: "1px solid #7c3aed44" }}
            >
              <Shield className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Admin Panel</h1>
              <p className="text-[11px] text-slate-500 uppercase tracking-widest">Vesting Manager</p>
            </div>
          </div>
          <button onClick={onSwitch}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <Eye className="h-3.5 w-3.5" />
            Vista usuario
          </button>
        </motion.div>

        {/* Token loader */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="rounded-2xl p-4"
          style={{ background: "linear-gradient(145deg, #110d22, #0c0a1a)", border: "1px solid #7c3aed22" }}
        >
          <div className="text-[11px] font-semibold uppercase tracking-widest text-purple-400 mb-3">
            Token ERC-20
          </div>
          <div className="flex gap-2">
            <input
              value={tokenAddr}
              onChange={e => setTokenAddr(e.target.value)}
              placeholder="0x... dirección del token"
              className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white font-mono bg-white/[0.04] border border-white/[0.07] outline-none focus:border-purple-500/50 placeholder-slate-700"
            />
            <button
              onClick={() => setTokenLoaded(true)}
              className="px-4 py-2.5 rounded-xl font-bold text-sm text-white flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            >
              <Upload className="h-4 w-4" />
              Cargar
            </button>
          </div>

          {/* Token info (mock loaded) */}
          {tokenLoaded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              className="mt-3 grid grid-cols-3 gap-2"
            >
              {[
                { label: "Símbolo",  value: MOCK_TOKEN.symbol },
                { label: "Decimals", value: MOCK_TOKEN.decimals },
                { label: "Balance",  value: `${MOCK_TOKEN.balance} ${MOCK_TOKEN.symbol}` },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl px-3 py-2 text-center"
                  style={{ background: "#7c3aed12", border: "1px solid #7c3aed22" }}
                >
                  <div className="text-[10px] text-slate-500 uppercase">{label}</div>
                  <div className="text-xs font-bold text-purple-300 mt-0.5">{value}</div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: "Wallets",    value: allocations.length,          color: "#a78bfa" },
            { label: "Asignado",   value: `${fmt(totalAllocated, 0)}`, color: "#60a5fa" },
            { label: "Reclamado",  value: `${fmt(totalClaimed, 0)}`,   color: "#34d399" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-2xl px-4 py-3 text-center"
              style={{ background: "linear-gradient(145deg, #110d22, #0c0a1a)", border: `1px solid ${color}18` }}
            >
              <div className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</div>
              <div className="text-lg font-black font-mono mt-0.5" style={{ color }}>{value}</div>
            </div>
          ))}
        </motion.div>

        {/* Allocations list */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(145deg, #110d22, #0c0a1a)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.05]">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-bold text-white">Wallets asignadas</span>
            </div>
            <button
              onClick={() => setShowAddForm(v => !v)}
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed99, #4f46e599)" }}
            >
              <Plus className="h-3.5 w-3.5" />
              Agregar
            </button>
          </div>

          {/* Add form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-b border-white/[0.05]"
              >
                <div className="p-4 space-y-3"
                  style={{ background: "rgba(124,58,237,0.06)" }}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-purple-400">
                    Nueva asignación
                  </div>
                  <input
                    value={newWallet}
                    onChange={e => setNewWallet(e.target.value)}
                    placeholder="Wallet 0x..."
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-white font-mono bg-white/[0.04] border border-white/[0.07] outline-none focus:border-purple-500/50 placeholder-slate-700"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[10px] text-slate-500 mb-1.5">Monto de tokens</div>
                      <input
                        type="number"
                        value={newAmount}
                        onChange={e => setNewAmount(e.target.value)}
                        placeholder="10000"
                        className="w-full rounded-xl px-3 py-2.5 text-sm text-white font-mono bg-white/[0.04] border border-white/[0.07] outline-none focus:border-purple-500/50 placeholder-slate-700"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 mb-1.5">Vesting % diario</div>
                      <input
                        type="number"
                        step="0.1"
                        value={newVesting}
                        onChange={e => setNewVesting(e.target.value)}
                        placeholder="1.0"
                        className="w-full rounded-xl px-3 py-2.5 text-sm text-white font-mono bg-white/[0.04] border border-white/[0.07] outline-none focus:border-purple-500/50 placeholder-slate-700"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addAllocation}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white"
                      style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                    >
                      Confirmar
                    </button>
                    <button onClick={() => setShowAddForm(false)}
                      className="px-4 py-2.5 rounded-xl text-sm text-slate-400 bg-white/[0.03] border border-white/[0.06]"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* List */}
          <div className="divide-y divide-white/[0.04]">
            {allocations.map((a, i) => {
              const claimedPct = ((a.claimed / a.amount) * 100).toFixed(1);
              const dailyAmt   = (a.amount * a.vestingPct) / 100;
              return (
                <motion.div key={i} layout
                  className="px-4 py-3 flex items-center gap-3"
                >
                  {/* Status dot */}
                  <div className={`h-2 w-2 rounded-full flex-shrink-0 ${a.active ? "bg-emerald-400" : "bg-slate-600"}`} />

                  {/* Wallet + stats */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-slate-300">{shortAddr(a.wallet)}</span>
                      <span className="text-[10px] rounded-full px-2 py-0.5 font-mono"
                        style={{ background: "#7c3aed18", color: "#a78bfa" }}
                      >
                        {a.vestingPct}%/día
                      </span>
                    </div>
                    {/* Mini progress */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400"
                          style={{ width: `${claimedPct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {fmt(a.claimed, 0)} / {fmt(a.amount, 0)}
                      </span>
                    </div>
                  </div>

                  {/* Daily */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-[10px] text-slate-600">daily</div>
                    <div className="text-xs font-bold font-mono text-purple-300">+{fmt(dailyAmt, 1)}</div>
                  </div>

                  {/* Delete */}
                  <button onClick={() => removeAllocation(i)}
                    className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Deploy button */}
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl font-black text-base text-white flex items-center justify-center gap-3"
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5, #0891b2)", boxShadow: "0 0 40px rgba(124,58,237,0.3)" }}
        >
          <Upload className="h-5 w-5" />
          Guardar configuración on-chain
        </motion.button>

        <div className="pb-8" />
      </div>
    </div>
  );
}

// ─── USER CLAIM PAGE ────────────────────────────────────────────────────────
function UserPage({ onSwitch }) {
  // mock: user is 2nd wallet
  const CONNECTED = "0x9876FEDCBA9876fedcba9876FEDCBA9876fedcba";
  const userAlloc = MOCK_ALLOCATIONS.find(
    a => a.wallet.toLowerCase() === CONNECTED.toLowerCase()
  );

  const [claimed, setClaimed]     = useState(userAlloc?.claimed ?? 0);
  const [showAddr, setShowAddr]   = useState(false);

  if (!userAlloc) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "radial-gradient(ellipse at 50% 20%, #0a1530 0%, #060b18 65%)" }}
      >
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-black text-white">Sin asignación</h2>
          <p className="text-sm text-slate-500 mt-2">Esta wallet no tiene tokens asignados.</p>
        </div>
      </div>
    );
  }

  const total        = userAlloc.amount;
  const dailyAmt     = (total * userAlloc.vestingPct) / 100;
  const available    = Math.min(dailyAmt * 12, total - claimed); // mock 12 days elapsed
  const claimedPct   = (claimed / total) * 100;
  const daysLeft     = Math.ceil((total - claimed) / dailyAmt);

  return (
    <div className="min-h-screen flex items-start justify-center p-4 pt-10"
      style={{ background: "radial-gradient(ellipse at 30% 10%, #061a30 0%, #060b18 65%)" }}
    >
      <div className="w-full max-w-md space-y-4">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Tu Vesting</h1>
            <button
              onClick={() => setShowAddr(v => !v)}
              className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500 hover:text-slate-300 transition-colors font-mono"
            >
              {showAddr ? CONNECTED : shortAddr(CONNECTED)}
              {showAddr ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </button>
          </div>
          <button onClick={onSwitch}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <Shield className="h-3.5 w-3.5" />
            Admin
          </button>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 }}
          className="rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #0d1e3a 0%, #091526 100%)",
            border: "1px solid rgba(56,189,248,0.15)",
            boxShadow: "0 0 60px rgba(14,90,180,0.15)",
          }}
        >
          {/* Token header */}
          <div className="px-6 pt-6 pb-4 border-b border-white/[0.05]">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl flex items-center justify-center font-black text-lg"
                style={{ background: "linear-gradient(135deg, #0891b244, #06b6d444)", border: "1px solid #0891b233", color: "#38bdf8" }}
              >
                D
              </div>
              <div>
                <div className="text-base font-black text-white">{MOCK_TOKEN.symbol} Token</div>
                <div className="text-[11px] text-slate-500 font-mono">{shortAddr(MOCK_TOKEN.address)}</div>
              </div>
              <div className="ml-auto flex items-center gap-1.5 rounded-full px-2.5 py-1"
                style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">Activo</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="px-6 py-5 grid grid-cols-2 gap-4">
            {[
              { label: "Total asignado",  value: `${fmt(total, 0)}`,   sub: MOCK_TOKEN.symbol, color: "#60a5fa" },
              { label: "Vesting diario",  value: `${userAlloc.vestingPct}%`,  sub: `≈ ${fmt(dailyAmt, 2)} ${MOCK_TOKEN.symbol}/día`, color: "#a78bfa" },
              { label: "Ya reclamado",    value: `${fmt(claimed, 0)}`, sub: `${claimedPct.toFixed(1)}% del total`, color: "#34d399" },
              { label: "Días restantes",  value: daysLeft,             sub: "para liberación total", color: "#fbbf24" },
            ].map(({ label, value, sub, color }) => (
              <div key={label} className="rounded-2xl px-4 py-3"
                style={{ background: `${color}08`, border: `1px solid ${color}15` }}
              >
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</div>
                <div className="text-xl font-black font-mono mt-0.5" style={{ color }}>{value}</div>
                <div className="text-[10px] text-slate-600 mt-0.5">{sub}</div>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="px-6 pb-5">
            <div className="flex justify-between text-[11px] mb-2">
              <span className="text-slate-500 uppercase tracking-wide">Progreso de vesting</span>
              <span className="font-mono text-cyan-400">{claimedPct.toFixed(2)}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/[0.04] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${claimedPct}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #0891b2, #38bdf8, #67e8f9)" }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-slate-700 font-mono">
              <span>{fmt(claimed, 0)} reclamado</span>
              <span>{fmt(total, 0)} total</span>
            </div>
          </div>
        </motion.div>

        {/* Available claim card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl px-5 py-5"
          style={{
            background: "linear-gradient(145deg, #0d2a1e, #091a14)",
            border: "1px solid rgba(52,211,153,0.2)",
            boxShadow: "0 0 40px rgba(52,211,153,0.07)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-widest">Disponible para reclamar</div>
              <div className="text-3xl font-black text-white font-mono mt-1">
                {fmt(available, 4)}
              </div>
              <div className="text-xs text-emerald-400 font-mono mt-0.5">{MOCK_TOKEN.symbol}</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setClaimed(c => Math.min(c + available, total))}
              className="flex flex-col items-center justify-center h-16 w-16 rounded-2xl font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #059669, #0d9488)",
                boxShadow: "0 0 30px rgba(5,150,105,0.35)",
              }}
            >
              <Zap className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] uppercase tracking-wide">Claim</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Claim history (mock) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(145deg, #0d1526, #0a1020)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="px-4 py-3.5 border-b border-white/[0.05] flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-bold text-white">Historial de claims</span>
          </div>
          {[
            { amount: 125.0,  date: "2025-03-10" },
            { amount: 125.0,  date: "2025-03-09" },
            { amount: 125.0,  date: "2025-03-08" },
          ].map((h, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-white/[0.03]">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-white font-mono">+{fmt(h.amount, 2)} {MOCK_TOKEN.symbol}</div>
                  <div className="text-[10px] text-slate-600 font-mono">{h.date}</div>
                </div>
              </div>
              <ExternalLink className="h-3 w-3 text-slate-700 hover:text-slate-400 cursor-pointer transition-colors" />
            </div>
          ))}
        </motion.div>

        <div className="pb-8" />
      </div>
    </div>
  );
}

// ─── ROOT ───────────────────────────────────────────────────────────────────
export default function VestingPanel() {
  const [page, setPage] = useState("user"); // "admin" | "user"

  return (
    <AnimatePresence mode="wait">
      {page === "admin" ? (
        <motion.div key="admin" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }}>
          <AdminPage onSwitch={() => setPage("user")} />
        </motion.div>
      ) : (
        <motion.div key="user" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.22 }}>
          <UserPage onSwitch={() => setPage("admin")} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}