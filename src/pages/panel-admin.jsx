import { useState, useEffect, useContext, useCallback } from "react";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Plus, Trash2, RefreshCw, AlertCircle,
  ExternalLink, X, Loader2, Wallet,
} from "lucide-react";
import { useWeb3Modal } from "@web3modal/ethers5/react";
import { useWeb3ModalProvider } from "@web3modal/ethers5/react";
import { toast } from "react-hot-toast";
import Web3Context from "../context/Web3Context";
import { abi_MultiTokenVesting } from "../hooks/abiHelpers";

const VESTING_CONTRACT = "0x4e7B51797D952ea5c50B061F358B05C8c6349295";
const BASE_RPC = "https://mainnet.base.org";
const PAGE_SIZE = 10;

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

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

function getReadContract() {
  const provider = new ethers.providers.JsonRpcProvider(BASE_RPC);
  return new ethers.Contract(VESTING_CONTRACT, abi_MultiTokenVesting, provider);
}

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN PAGE
// ═══════════════════════════════════════════════════════════════════════════
export default function PanelAdmin() {
  const { accounts } = useContext(Web3Context);
  const { open } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();

  const [globalStats, setGlobalStats]   = useState(null);
  const [vestings, setVestings]         = useState([]);
  const [vestingTotal, setVestingTotal] = useState(0);
  const [page, setPage]                 = useState(0);
  const [isAdmin, setIsAdmin]           = useState(false);
  const [loading, setLoading]           = useState(true);
  const [showCreate, setShowCreate]     = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [revoking, setRevoking]         = useState(null);
  const [refreshKey, setRefreshKey]     = useState(0);

  const [form, setForm] = useState({
    beneficiary: "", token: "", amount: "", dailyBps: "150", tokenSymbol: "",
  });

  const getSignedContract = useCallback(() => {
    if (!walletProvider) return null;
    const provider = new ethers.providers.Web3Provider(walletProvider);
    return new ethers.Contract(VESTING_CONTRACT, abi_MultiTokenVesting, provider.getSigner());
  }, [walletProvider]);

  // Load global stats
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const c = getReadContract();
        const [created, active_, beneficiaries, tokenTotals] = await c.getGlobalTotals();
        if (!active) return;
        setGlobalStats({
          created:       created.toNumber(),
          active:        active_.toNumber(),
          beneficiaries: beneficiaries.toNumber(),
          tokenTotals:   tokenTotals.map(t => ({
            token:       t.token,
            locked:      numBn(t.totalLocked),
            distributed: numBn(t.totalDistributed),
          })),
        });
      } catch (e) { console.error("loadStats", e); }
    })();
    return () => { active = false; };
  }, [refreshKey]);

  // Load vestings (paginated)
  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const c = getReadContract();
        const [items, total] = await c.getAllVestingsBatch(
          ethers.BigNumber.from(page * PAGE_SIZE),
          ethers.BigNumber.from(PAGE_SIZE)
        );
        if (!active) return;
        setVestings(items);
        setVestingTotal(total.toNumber());
      } catch (e) { console.error("loadVestings", e); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [page, refreshKey]);

  // Check admin role when wallet changes
  useEffect(() => {
    if (!accounts) { setIsAdmin(false); return; }
    (async () => {
      try {
        const c = getReadContract();
        const role = await c.VESTING_ADMIN_ROLE();
        setIsAdmin(await c.hasRole(role, accounts));
      } catch { setIsAdmin(false); }
    })();
  }, [accounts]);

  // Auto-fetch token symbol when token address changes
  useEffect(() => {
    if (!ethers.utils.isAddress(form.token)) {
      setForm(prev => ({ ...prev, tokenSymbol: "" }));
      return;
    }
    (async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(BASE_RPC);
        const token = new ethers.Contract(form.token, ERC20_ABI, provider);
        const symbol = await token.symbol();
        setForm(prev => ({ ...prev, tokenSymbol: symbol }));
      } catch { setForm(prev => ({ ...prev, tokenSymbol: "?" })); }
    })();
  }, [form.token]);

  // ── create vesting ──────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!accounts || !walletProvider) { toast.error("Conecta tu wallet"); return; }
    if (!ethers.utils.isAddress(form.beneficiary)) { toast.error("Dirección de beneficiario inválida"); return; }
    if (!ethers.utils.isAddress(form.token))        { toast.error("Dirección de token inválida"); return; }
    if (!form.amount || Number(form.amount) <= 0)   { toast.error("Monto inválido"); return; }
    const bps = Math.round(Number(form.dailyBps));
    if (bps < 1 || bps > 10000) { toast.error("BPS debe estar entre 1 y 10000"); return; }

    setSubmitting(true);
    try {
      const provider = new ethers.providers.Web3Provider(walletProvider);
      const signer = provider.getSigner();

      const tokenContract = new ethers.Contract(form.token, ERC20_ABI, signer);
      const decimals    = await tokenContract.decimals();
      const totalAmount = ethers.utils.parseUnits(form.amount, decimals);

      const allowance = await tokenContract.allowance(accounts, VESTING_CONTRACT);
      if (allowance.lt(totalAmount)) {
        const approveTx = await tokenContract.approve(VESTING_CONTRACT, totalAmount);
        toast.loading("Aprobando token…", { id: "vesting-tx" });
        await approveTx.wait();
      }

      toast.loading("Creando vesting…", { id: "vesting-tx" });
      const vestingContract = new ethers.Contract(VESTING_CONTRACT, abi_MultiTokenVesting, signer);
      const tx = await vestingContract.createVesting(
        form.beneficiary, form.token, totalAmount, ethers.BigNumber.from(bps)
      );
      await tx.wait();

      toast.success("Vesting creado", { id: "vesting-tx" });
      setForm({ beneficiary: "", token: "", amount: "", dailyBps: "150", tokenSymbol: "" });
      setShowCreate(false);
      setRefreshKey(k => k + 1);
    } catch (e) {
      toast.error(e?.reason || e?.message?.slice(0, 80) || "Error en la transacción", { id: "vesting-tx" });
    } finally {
      setSubmitting(false);
    }
  };

  // ── revoke vesting ──────────────────────────────────────────────────────
  const handleRevoke = async (vestingId) => {
    if (!accounts || !walletProvider) return;
    const idStr = vestingId.toString();
    setRevoking(idStr);
    try {
      const tx = await getSignedContract().revokeVesting(vestingId);
      toast.loading("Revocando vesting…", { id: `revoke-${idStr}` });
      await tx.wait();
      toast.success("Vesting revocado", { id: `revoke-${idStr}` });
      setRefreshKey(k => k + 1);
    } catch (e) {
      toast.error(e?.reason || "Error al revocar", { id: `revoke-${idStr}` });
    } finally {
      setRevoking(null);
    }
  };

  const totalPages = Math.ceil(vestingTotal / PAGE_SIZE);

  // ── render ──────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen p-4 pt-8"
      style={{ background: "radial-gradient(ellipse at 70% -5%, #1a0a2e 0%, #080b18 65%)" }}
    >
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-2"
        >
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed33, #4f46e533)", border: "1px solid #7c3aed44" }}
            >
              <Shield className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Vesting Admin</h1>
              <p className="text-[11px] font-mono text-slate-500">
                {accounts
                  ? <>{shortAddr(accounts)}{isAdmin && <span className="text-purple-400"> · Admin</span>}</>
                  : "Sin wallet conectada"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRefreshKey(k => k + 1)}
              className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-white bg-white/[0.04] border border-white/[0.06]"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => open()}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-bold text-white"
              style={{ background: accounts ? "rgba(124,58,237,0.25)" : "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            >
              <Wallet className="h-3.5 w-3.5" />
              {accounts ? shortAddr(accounts) : "Conectar wallet"}
            </button>
          </div>
        </motion.div>

        {/* Global stats */}
        {globalStats && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="grid grid-cols-3 gap-2"
          >
            {[
              { label: "Vestings creados", value: globalStats.created,       color: "#a78bfa" },
              { label: "Vestings activos", value: globalStats.active,        color: "#60a5fa" },
              { label: "Beneficiarios",    value: globalStats.beneficiaries, color: "#34d399" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="rounded-2xl px-3 py-3 text-center"
                style={{ background: "linear-gradient(145deg, #110d22, #0c0a1a)", border: `1px solid ${color}18` }}
              >
                <div className="text-[10px] text-slate-500 uppercase tracking-wide leading-tight">{label}</div>
                <div className="text-2xl font-black font-mono mt-1" style={{ color }}>{value}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Token totals */}
        {globalStats?.tokenTotals?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className="rounded-2xl p-4"
            style={{ background: "linear-gradient(145deg, #110d22, #0c0a1a)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-3">
              Tokens en el contrato
            </div>
            {globalStats.tokenTotals.map((t, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <a
                  href={`https://basescan.org/token/${t.token}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-[11px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1"
                >
                  {shortAddr(t.token)} <ExternalLink className="h-2.5 w-2.5" />
                </a>
                <div className="flex gap-4 text-right">
                  <div>
                    <div className="text-[9px] text-slate-600 uppercase">Bloqueado</div>
                    <div className="text-xs font-mono font-bold text-blue-300">{fmt(t.locked, 2)}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-600 uppercase">Distribuido</div>
                    <div className="text-xs font-mono font-bold text-emerald-300">{fmt(t.distributed, 2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Vestings list */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(145deg, #110d22, #0c0a1a)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* List header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.05]">
            <div>
              <span className="text-sm font-black text-white">Todos los vestings</span>
              <span className="ml-2 text-[11px] text-slate-600">({vestingTotal})</span>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowCreate(v => !v)}
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #7c3aed99, #4f46e599)" }}
              >
                {showCreate ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                {showCreate ? "Cerrar" : "Nuevo"}
              </button>
            )}
          </div>

          {/* Create form */}
          <AnimatePresence>
            {showCreate && isAdmin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-b border-white/[0.05]"
              >
                <div className="p-4 space-y-3" style={{ background: "rgba(124,58,237,0.06)" }}>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-purple-400">Crear vesting</div>

                  {[
                    { label: "Wallet beneficiaria",            key: "beneficiary", ph: "0x…",      mono: true  },
                    { label: "Contrato del token ERC-20",      key: "token",       ph: "0x…",      mono: true  },
                    { label: "Monto total de tokens",          key: "amount",      ph: "1000000",  type: "number" },
                    { label: "ROI diario en BPS (150 = 1.5%)", key: "dailyBps",    ph: "150",      type: "number" },
                  ].map(({ label, key, ph, mono, type = "text" }) => (
                    <div key={key}>
                      <div className="text-[10px] text-slate-500 mb-1">{label}</div>
                      <div className="relative">
                        <input
                          type={type}
                          value={form[key]}
                          onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                          placeholder={ph}
                          className={`w-full rounded-xl px-3 py-2.5 text-sm text-white bg-white/[0.04] border border-white/[0.07] outline-none focus:border-purple-500/50 placeholder-slate-700 ${mono ? "font-mono" : ""}`}
                        />
                        {key === "token" && form.tokenSymbol && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-purple-300">
                            {form.tokenSymbol}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Preview */}
                  {form.amount && form.dailyBps && (
                    <div
                      className="rounded-xl px-3 py-2.5 text-xs space-y-1.5"
                      style={{ background: "#7c3aed10", border: "1px solid #7c3aed22" }}
                    >
                      <div className="text-[9px] uppercase tracking-wide text-slate-600 mb-1">Vista previa</div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">% diario</span>
                        <span className="text-purple-300 font-mono font-bold">
                          {(Number(form.dailyBps) / 100).toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tokens/día aprox</span>
                        <span className="text-cyan-300 font-mono font-bold">
                          {fmt((Number(form.amount) * Number(form.dailyBps)) / 10000, 2)} {form.tokenSymbol}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Días para 100%</span>
                        <span className="text-white font-mono font-bold">
                          {Number(form.dailyBps) > 0 ? Math.ceil(10000 / Number(form.dailyBps)) : "—"}d
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleCreate}
                      disabled={submitting}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                    >
                      {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                      Crear vesting
                    </button>
                    <button
                      onClick={() => setShowCreate(false)}
                      className="px-4 py-2.5 rounded-xl text-sm text-slate-400 bg-white/[0.03] border border-white/[0.06]"
                    >✕</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vestings list body */}
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
            </div>
          ) : vestings.length === 0 ? (
            <div className="text-center py-10 text-slate-600 text-sm">Sin vestings creados</div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {vestings.map(v => {
                const claimed  = numBn(v.claimedAmount);
                const total    = numBn(v.totalAmount);
                const claimable = numBn(v.claimableNow);
                const pct      = total > 0 ? Math.min(100, (claimed / total) * 100) : 0;
                const idStr    = v.vestingId.toString();
                const isRevokingThis = revoking === idStr;

                return (
                  <div
                    key={idStr}
                    className="px-4 py-3.5"
                    style={{ opacity: (!v.active || v.revoked) ? 0.45 : 1 }}
                  >
                    {/* Row 1 */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                          v.revoked ? "bg-red-500" : v.active ? "bg-emerald-400" : "bg-slate-600"
                        }`} />
                        <a
                          href={`https://basescan.org/address/${v.beneficiary}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-[11px] font-mono text-slate-300 hover:text-white truncate"
                        >
                          {shortAddr(v.beneficiary)}
                        </a>
                        <span className="text-[9px] text-slate-700 flex-shrink-0">#{idStr}</span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded-full ${
                          v.revoked ? "bg-red-500/15 text-red-400"
                          : v.active ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-slate-500/15 text-slate-400"
                        }`}>
                          {v.revoked ? "Revocado" : v.active ? "Activo" : "Completado"}
                        </span>
                        {isAdmin && v.active && !v.revoked && (
                          <button
                            onClick={() => handleRevoke(v.vestingId)}
                            disabled={isRevokingThis}
                            className="h-6 w-6 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-40"
                          >
                            {isRevokingThis
                              ? <Loader2 className="h-3 w-3 animate-spin" />
                              : <Trash2 className="h-3 w-3" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Row 2: amounts */}
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[11px] font-mono text-white font-bold">{fmt(total, 0)}</span>
                      <span className="text-[10px] font-mono text-slate-600">{shortAddr(v.token)}</span>
                      <span
                        className="text-[10px] rounded-full px-2 py-0.5"
                        style={{ background: "#7c3aed18", color: "#a78bfa" }}
                      >
                        {bpsToPct(v.dailyBps)}%/día
                      </span>
                      {claimable > 0 && (
                        <span className="text-[10px] text-emerald-300">
                          +{fmt(claimable, 2)} disponible
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-white/[0.05]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-slate-600">{pct.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.05]">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 0}
                className="text-[11px] text-slate-400 disabled:text-slate-700 hover:text-white transition-colors"
              >← Anterior</button>
              <span className="text-[11px] text-slate-600">Página {page + 1} / {totalPages}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages - 1}
                className="text-[11px] text-slate-400 disabled:text-slate-700 hover:text-white transition-colors"
              >Siguiente →</button>
            </div>
          )}
        </motion.div>

        {/* Not-admin warning */}
        {accounts && !isAdmin && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)" }}
          >
            <AlertCircle className="h-4 w-4 text-yellow-400 flex-shrink-0" />
            <p className="text-[11px] text-yellow-300">
              La wallet conectada no tiene permisos de admin. Solo puedes ver los datos del contrato.
            </p>
          </motion.div>
        )}

        <div className="pb-8" />
      </div>
    </div>
  );
}
