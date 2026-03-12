import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Plus, Trash2, Upload, Wallet,
  Zap, Eye, EyeOff, Clock,
  CheckCircle, ExternalLink, Edit3, X, RefreshCw, LogOut
} from "lucide-react";

// ─── helpers ────────────────────────────────────────────────────────────────
function fmt(n, dec = 2) {
  return Number(n ?? 0).toLocaleString("en-US", { maximumFractionDigits: dec });
}
function shortAddr(a = "") {
  if (a.length < 10) return a;
  return `${a.slice(0, 6)}...${a.slice(-4)}`;
}
function bpsToDisplay(bps) {
  return (Number(bps) / 100).toFixed(2);
}

// ─── mock state ──────────────────────────────────────────────────────────────
const OWNER_WALLET = "0xAdminWallet000000000000000000000000000001";

const MOCK_GRANTS = [
  {
    wallet:      "0xJuan000000000000000000000000000000000001",
    name:        "Juan",
    token:       "0xDYVToken000000000000000000000000000000002",
    tokenSymbol: "DYV",
    totalAmount: 1_000_000,
    claimed:     20_000,
    dailyRoiBps: 200,   // 2%
    startTime:   "2025-03-01",
    active:      true,
  },
  {
    wallet:      "0xMaria00000000000000000000000000000000003",
    name:        "Maria",
    token:       "0xDYVToken000000000000000000000000000000002",
    tokenSymbol: "DYV",
    totalAmount: 500_000,
    claimed:     3_750,
    dailyRoiBps: 150,   // 1.5%
    startTime:   "2025-03-05",
    active:      true,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// EDIT MODAL
// ═══════════════════════════════════════════════════════════════════════════
function EditModal({ grant, onSave, onClose }) {
  const [amount,  setAmount]  = useState(String(grant.totalAmount));
  const [roi,     setRoi]     = useState(bpsToDisplay(grant.dailyRoiBps));
  const [wallet,  setWallet]  = useState(grant.wallet);
  const [token,   setToken]   = useState(grant.token);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-md rounded-3xl p-6 space-y-4"
        style={{
          background: "linear-gradient(160deg, #111830, #0c1020)",
          border: "1px solid rgba(124,58,237,0.3)",
          boxShadow: "0 0 80px rgba(124,58,237,0.2)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white">Modificar Grant</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{grant.name}</p>
          </div>
          <button onClick={onClose}
            className="h-8 w-8 rounded-xl bg-white/[0.05] flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {[
          { label: "Wallet beneficiaria", val: wallet,  set: setWallet,  mono: true,  ph: "0x..." },
          { label: "Token ERC-20 (contrato)", val: token, set: setToken, mono: true,  ph: "0x..." },
          { label: "Monto total de tokens", val: amount, set: setAmount, mono: false, ph: "1000000", type: "number" },
          { label: "ROI diario (%)", val: roi, set: setRoi, mono: false,  ph: "2.0", type: "number", step: "0.1" },
        ].map(({ label, val, set, mono, ph, type = "text", step }) => (
          <div key={label}>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5">{label}</div>
            <input
              type={type}
              step={step}
              value={val}
              onChange={e => set(e.target.value)}
              placeholder={ph}
              className={`w-full rounded-xl px-4 py-2.5 text-sm text-white bg-white/[0.04] border border-white/[0.07] outline-none focus:border-purple-500/60 placeholder-slate-700 ${mono ? "font-mono" : ""}`}
            />
          </div>
        ))}

        {/* Preview */}
        <div className="rounded-xl p-3 space-y-1"
          style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)" }}
        >
          <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1.5">Vista previa</div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Monto total</span>
            <span className="font-mono font-bold text-white">{fmt(Number(amount) || 0, 0)} tokens</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">ROI diario</span>
            <span className="font-mono font-bold text-purple-300">{roi || 0}%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Diario aprox</span>
            <span className="font-mono font-bold text-cyan-300">
              {fmt((Number(amount) || 0) * (Number(roi) || 0) / 100, 2)} tokens
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Días para completar</span>
            <span className="font-mono font-bold text-white">
              {Number(roi) > 0 ? Math.ceil(100 / Number(roi)) : "—"} días
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={() => onSave({ amount: Number(amount), roi: Number(roi), wallet, token })}
            className="flex-1 py-3 rounded-xl font-bold text-sm text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
          >
            Guardar cambios
          </button>
          <button onClick={onClose}
            className="px-4 py-3 rounded-xl text-sm text-slate-400 bg-white/[0.03] border border-white/[0.06]"
          >
            Cancelar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN PAGE
// ═══════════════════════════════════════════════════════════════════════════
function AdminPage({ onSwitch }) {
  const [grants, setGrants]         = useState(MOCK_GRANTS);
  const [editTarget, setEditTarget] = useState(null);
  const [showAdd, setShowAdd]       = useState(false);

  // new grant form
  const [nWallet,  setNWallet]  = useState("");
  const [nName,    setNName]    = useState("");
  const [nToken,   setNToken]   = useState("");
  const [nAmount,  setNAmount]  = useState("");
  const [nRoi,     setNRoi]     = useState("2");

  function addGrant() {
    if (!nWallet || !nToken || !nAmount) return;
    setGrants(prev => [...prev, {
      wallet:      nWallet,
      name:        nName || shortAddr(nWallet),
      token:       nToken,
      tokenSymbol: "TOKEN",
      totalAmount: Number(nAmount),
      claimed:     0,
      dailyRoiBps: Math.round(Number(nRoi) * 100),
      startTime:   new Date().toISOString().split("T")[0],
      active:      true,
    }]);
    setNWallet(""); setNName(""); setNToken(""); setNAmount(""); setNRoi("2");
    setShowAdd(false);
  }

  function saveEdit({ amount, roi, wallet, token }) {
    setGrants(prev => prev.map(g =>
      g.wallet === editTarget.wallet
        ? { ...g, totalAmount: amount, dailyRoiBps: Math.round(roi * 100), wallet, token }
        : g
    ));
    setEditTarget(null);
  }

  function revokeGrant(wallet) {
    setGrants(prev => prev.map(g => g.wallet === wallet ? { ...g, active: false } : g));
  }

  const totalAllocated = grants.filter(g => g.active).reduce((s, g) => s + g.totalAmount, 0);
  const totalClaimed   = grants.filter(g => g.active).reduce((s, g) => s + g.claimed, 0);

  return (
    <>
      <div className="min-h-screen p-4 pt-8"
        style={{ background: "radial-gradient(ellipse at 70% -5%, #1a0a2e 0%, #080b18 65%)" }}
      >
        <div className="max-w-lg mx-auto space-y-4">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-2"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #7c3aed33, #4f46e533)", border: "1px solid #7c3aed44" }}
              >
                <Shield className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white">Vesting Admin</h1>
                <p className="text-[11px] text-slate-500 font-mono">{shortAddr(OWNER_WALLET)}</p>
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

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
            className="grid grid-cols-3 gap-2"
          >
            {[
              { label: "Grants activos", value: grants.filter(g => g.active).length, color: "#a78bfa" },
              { label: "Total asignado", value: fmt(totalAllocated, 0),               color: "#60a5fa" },
              { label: "Total reclamado",value: fmt(totalClaimed, 0),                 color: "#34d399" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-2xl px-3 py-3 text-center"
                style={{ background: "linear-gradient(145deg, #110d22, #0c0a1a)", border: `1px solid ${color}18` }}
              >
                <div className="text-[10px] text-slate-500 uppercase tracking-wide leading-tight">{label}</div>
                <div className="text-xl font-black font-mono mt-1" style={{ color }}>{value}</div>
              </div>
            ))}
          </motion.div>

          {/* Grant list */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "linear-gradient(145deg, #110d22, #0c0a1a)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.05]">
              <span className="text-sm font-black text-white">Grants</span>
              <button onClick={() => setShowAdd(v => !v)}
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #7c3aed99, #4f46e599)" }}
              >
                <Plus className="h-3.5 w-3.5" />
                Nuevo
              </button>
            </div>

            {/* Add form */}
            <AnimatePresence>
              {showAdd && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                  className="overflow-hidden border-b border-white/[0.05]"
                >
                  <div className="p-4 space-y-3" style={{ background: "rgba(124,58,237,0.06)" }}>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-purple-400">Nuevo grant</div>

                    <input value={nName} onChange={e => setNName(e.target.value)} placeholder="Nombre (ej: Juan)"
                      className="w-full rounded-xl px-3 py-2.5 text-sm text-white bg-white/[0.04] border border-white/[0.07] outline-none focus:border-purple-500/50 placeholder-slate-700"
                    />
                    <input value={nWallet} onChange={e => setNWallet(e.target.value)} placeholder="Wallet 0x..."
                      className="w-full rounded-xl px-3 py-2.5 text-sm text-white font-mono bg-white/[0.04] border border-white/[0.07] outline-none focus:border-purple-500/50 placeholder-slate-700"
                    />
                    <input value={nToken} onChange={e => setNToken(e.target.value)} placeholder="Contrato token ERC-20 0x..."
                      className="w-full rounded-xl px-3 py-2.5 text-sm text-white font-mono bg-white/[0.04] border border-white/[0.07] outline-none focus:border-purple-500/50 placeholder-slate-700"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-[10px] text-slate-500 mb-1.5">Monto de tokens</div>
                        <input type="number" value={nAmount} onChange={e => setNAmount(e.target.value)} placeholder="1000000"
                          className="w-full rounded-xl px-3 py-2.5 text-sm text-white font-mono bg-white/[0.04] border border-white/[0.07] outline-none focus:border-purple-500/50 placeholder-slate-700"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 mb-1.5">ROI diario %</div>
                        <input type="number" step="0.1" value={nRoi} onChange={e => setNRoi(e.target.value)} placeholder="2.0"
                          className="w-full rounded-xl px-3 py-2.5 text-sm text-white font-mono bg-white/[0.04] border border-white/[0.07] outline-none focus:border-purple-500/50 placeholder-slate-700"
                        />
                      </div>
                    </div>

                    {/* Preview */}
                    {nAmount && nRoi && (
                      <div className="rounded-xl px-3 py-2.5 text-xs space-y-1"
                        style={{ background: "#7c3aed10", border: "1px solid #7c3aed22" }}
                      >
                        <div className="flex justify-between">
                          <span className="text-slate-500">Diario</span>
                          <span className="text-purple-300 font-mono font-bold">
                            {fmt(Number(nAmount) * Number(nRoi) / 100, 2)} tokens
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Días para 100%</span>
                          <span className="text-white font-mono font-bold">
                            {Number(nRoi) > 0 ? Math.ceil(100 / Number(nRoi)) : "—"}d
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button onClick={addGrant}
                        className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                      >
                        Crear grant
                      </button>
                      <button onClick={() => setShowAdd(false)}
                        className="px-4 py-2.5 rounded-xl text-sm text-slate-400 bg-white/[0.03] border border-white/[0.06]"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Items */}
            <div className="divide-y divide-white/[0.04]">
              {grants.map((g, i) => {
                const claimedPct = g.totalAmount > 0 ? (g.claimed / g.totalAmount) * 100 : 0;
                const daily      = (g.totalAmount * g.dailyRoiBps) / 10000;
                const daysLeft   = daily > 0 ? Math.ceil((g.totalAmount - g.claimed) / daily) : "—";
                return (
                  <motion.div key={g.wallet} layout
                    className="px-4 py-3.5"
                    style={{ opacity: g.active ? 1 : 0.4 }}
                  >
                    {/* Row 1 */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${g.active ? "bg-emerald-400" : "bg-slate-600"}`} />
                        <span className="text-sm font-black text-white">{g.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">{shortAddr(g.wallet)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setEditTarget(g)}
                          className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => revokeGrant(g.wallet)}
                          className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Row 2: stats */}
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-[11px] font-mono text-white font-bold">
                        {fmt(g.totalAmount, 0)} <span className="text-slate-500">{g.tokenSymbol}</span>
                      </span>
                      <span className="text-[10px] rounded-full px-2 py-0.5"
                        style={{ background: "#7c3aed18", color: "#a78bfa" }}
                      >
                        {bpsToDisplay(g.dailyRoiBps)}%/día
                      </span>
                      <span className="text-[10px] text-slate-500">
                        +{fmt(daily, 2)}/día · {daysLeft}d restantes
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-white/[0.05]">
                        <div className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-700"
                          style={{ width: `${claimedPct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-600 flex-shrink-0">
                        {claimedPct.toFixed(1)}%
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <div className="pb-8" />
        </div>
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editTarget && (
          <EditModal grant={editTarget} onSave={saveEdit} onClose={() => setEditTarget(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// USER PAGE
// ═══════════════════════════════════════════════════════════════════════════
function UserPage({ onSwitch }) {
  // Simula wallet conectada — en producción viene de Web3Context
  const [connectedAs, setConnectedAs] = useState(MOCK_GRANTS[0].wallet); // mock Juan
  const [claimed, setClaimed] = useState(MOCK_GRANTS[0].claimed);
  const [showFull, setShowFull] = useState(false);

  const grant = { ...MOCK_GRANTS.find(g => g.wallet === connectedAs), claimed };

  const daily       = grant ? (grant.totalAmount * grant.dailyRoiBps) / 10000 : 0;
  const available   = grant ? Math.min(daily * 10, grant.totalAmount - claimed) : 0; // mock 10 días
  const claimedPct  = grant ? (claimed / grant.totalAmount) * 100 : 0;
  const daysLeft    = daily > 0 ? Math.ceil((grant.totalAmount - claimed) / daily) : 0;

  const HISTORY = [
    { amount: daily, date: "2025-03-10" },
    { amount: daily, date: "2025-03-09" },
    { amount: daily, date: "2025-03-08" },
  ];

  if (!grant || !grant.active) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4"
        style={{ background: "radial-gradient(ellipse at 50% 20%, #0a1530 0%, #060b18 65%)" }}
      >
        <div className="text-5xl">🔒</div>
        <h2 className="text-xl font-black text-white">Sin asignación</h2>
        <p className="text-sm text-slate-500 text-center">Esta wallet no tiene tokens asignados en este contrato.</p>
        <button onClick={onSwitch}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-400 border border-white/[0.08]"
        >
          <Shield className="h-4 w-4" /> Ir al Admin
        </button>
      </div>
    );
  }

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
            <h1 className="text-2xl font-black text-white">Hola, {grant.name} 👋</h1>
            <button onClick={() => setShowFull(v => !v)}
              className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500 hover:text-slate-300 font-mono"
            >
              {showFull ? grant.wallet : shortAddr(grant.wallet)}
              {showFull ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </button>
          </div>
          <button onClick={onSwitch}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-semibold text-slate-400 hover:text-white"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <Shield className="h-3.5 w-3.5" /> Admin
          </button>
        </motion.div>

        {/* Main stats card */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.08 }}
          className="rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #0d1e3a 0%, #091526 100%)",
            border: "1px solid rgba(56,189,248,0.15)",
            boxShadow: "0 0 60px rgba(14,90,180,0.12)",
          }}
        >
          {/* Token header */}
          <div className="px-5 pt-5 pb-4 border-b border-white/[0.05] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl flex items-center justify-center font-black text-base"
                style={{ background: "#0891b222", border: "1px solid #0891b233", color: "#38bdf8" }}
              >
                {grant.tokenSymbol[0]}
              </div>
              <div>
                <div className="text-sm font-black text-white">{grant.tokenSymbol} Vesting</div>
                <div className="text-[11px] text-slate-500 font-mono">{shortAddr(grant.token)}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
              style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">Activo</span>
            </div>
          </div>

          {/* 4 stats */}
          <div className="px-5 py-4 grid grid-cols-2 gap-3">
            {[
              { label: "Total asignado",  val: `${fmt(grant.totalAmount, 0)}`, sub: grant.tokenSymbol, color: "#60a5fa" },
              { label: "ROI diario",      val: `${bpsToDisplay(grant.dailyRoiBps)}%`, sub: `≈ ${fmt(daily, 2)} ${grant.tokenSymbol}/día`, color: "#a78bfa" },
              { label: "Ya reclamado",    val: `${fmt(claimed, 0)}`, sub: `${claimedPct.toFixed(2)}% completado`, color: "#34d399" },
              { label: "Días restantes",  val: daysLeft, sub: "para liberación total", color: "#fbbf24" },
            ].map(({ label, val, sub, color }) => (
              <div key={label} className="rounded-2xl px-4 py-3"
                style={{ background: `${color}08`, border: `1px solid ${color}15` }}
              >
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</div>
                <div className="text-xl font-black font-mono mt-0.5" style={{ color }}>{val}</div>
                <div className="text-[10px] text-slate-600 mt-0.5">{sub}</div>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="px-5 pb-5">
            <div className="flex justify-between text-[11px] mb-1.5">
              <span className="text-slate-500 uppercase tracking-wide">Progreso</span>
              <span className="font-mono text-cyan-400">{claimedPct.toFixed(2)}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${claimedPct}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #0891b2, #38bdf8)" }}
              />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-slate-700 font-mono">
              <span>{fmt(claimed, 0)} reclamado</span>
              <span>{fmt(grant.totalAmount, 0)} total</span>
            </div>
          </div>
        </motion.div>

        {/* Claim card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-2xl px-5 py-5"
          style={{
            background: "linear-gradient(145deg, #0d2a1e, #091a14)",
            border: "1px solid rgba(52,211,153,0.2)",
            boxShadow: "0 0 40px rgba(52,211,153,0.07)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-widest mb-1">
                Disponible ahora
              </div>
              <div className="text-4xl font-black text-white font-mono leading-none">
                {fmt(available, 4)}
              </div>
              <div className="text-sm text-emerald-400 font-mono mt-1">{grant.tokenSymbol}</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
              onClick={() => setClaimed(c => Math.min(c + available, grant.totalAmount))}
              className="h-18 flex flex-col items-center justify-center gap-1 px-5 py-4 rounded-2xl font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #059669, #0d9488)",
                boxShadow: "0 0 35px rgba(5,150,105,0.4)",
              }}
            >
              <Zap className="h-6 w-6" />
              <span className="text-[11px] uppercase tracking-widest">Claim</span>
            </motion.button>
          </div>
        </motion.div>

        {/* History */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(145deg, #0d1526, #0a1020)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="px-4 py-3.5 border-b border-white/[0.05] flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-bold text-white">Historial</span>
            <span className="ml-auto text-[11px] font-mono text-slate-500">{fmt(claimed, 0)} reclamado total</span>
          </div>
          {HISTORY.map((h, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-white/[0.03]">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-white font-mono">
                    +{fmt(h.amount, 4)} {grant.tokenSymbol}
                  </div>
                  <div className="text-[10px] text-slate-600 font-mono">{h.date}</div>
                </div>
              </div>
              <ExternalLink className="h-3 w-3 text-slate-700 hover:text-slate-400 cursor-pointer transition-colors" />
            </div>
          ))}
        </motion.div>

        <div className="pb-10" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════
export default function VestingPanel() {
  const [page, setPage] = useState("user");
  return (
    <AnimatePresence mode="wait">
      {page === "admin" ? (
        <motion.div key="admin"
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}
        >
          <AdminPage onSwitch={() => setPage("user")} />
        </motion.div>
      ) : (
        <motion.div key="user"
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.2 }}
        >
          <UserPage onSwitch={() => setPage("admin")} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}