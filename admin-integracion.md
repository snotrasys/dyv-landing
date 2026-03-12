# MultiTokenVesting — Guía de Integración Frontend

> **Contrato en producción · Base Mainnet**
> Dirección: `0x4e7B51797D952ea5c50B061F358B05C8c6349295`
> Explorer: [basescan.org/address/0x4e7B51797D952ea5c50B061F358B05C8c6349295](https://basescan.org/address/0x4e7B51797D952ea5c50B061F358B05C8c6349295)

---

## Índice

1. [Setup](#1-setup)
2. [ABI mínimo por caso de uso](#2-abi-mínimo-por-caso-de-uso)
3. [ABI completo](#3-abi-completo)
4. [Tipos TypeScript](#4-tipos-typescript)
5. [Leer datos (sin wallet)](#5-leer-datos-sin-wallet)
6. [Dashboard del beneficiario](#6-dashboard-del-beneficiario)
7. [Claim de tokens](#7-claim-de-tokens)
8. [Dashboard de admin](#8-dashboard-de-admin)
9. [Escuchar eventos en tiempo real](#9-escuchar-eventos-en-tiempo-real)
10. [Integración con wagmi v2 + viem](#10-integración-con-wagmi-v2--viem)
11. [Helpers de formato](#11-helpers-de-formato)
12. [Errores del contrato](#12-errores-del-contrato)
13. [Basis Points — referencia rápida](#13-basis-points--referencia-rápida)

---

## 1. Setup

### Red

| Propiedad | Valor |
|---|---|
| Red | **Base Mainnet** |
| Chain ID | `8453` |
| RPC público | `https://mainnet.base.org` |
| Explorer | `https://basescan.org` |

### Instalación

```bash
# ethers.js v6
npm install ethers

# o viem + wagmi
npm install viem wagmi
```

### Constantes del contrato

```typescript
// constants/vesting.ts
export const VESTING_CONTRACT_ADDRESS =
  "0x4e7B51797D952ea5c50B061F358B05C8c6349295" as const;

export const BASE_CHAIN_ID = 8453;

export const BASE_RPC = "https://mainnet.base.org";
```

---

## 2. ABI mínimo por caso de uso

Usa solo el fragmento que necesitas para mantener el bundle pequeño.

### Beneficiario (leer + claim)

```typescript
export const VESTING_ABI_BENEFICIARY = [
  // Leer
  "function getVestingInfo(uint256 vestingId) view returns ((uint256 vestingId, address beneficiary, address token, uint256 totalAmount, uint256 claimedAmount, uint256 claimableNow, uint256 remainingAmount, uint256 dailyBps, uint256 startTimestamp, uint256 elapsedDays, bool active, bool revoked) info)",
  "function getBeneficiaryTotals(address beneficiary) view returns ((address beneficiary, uint256 totalVestings, uint256 totalAmount, uint256 totalClaimed, uint256 totalClaimable, uint256 totalRemaining) info)",
  "function getBeneficiaryVestingsBatch(address beneficiary, uint256 offset, uint256 limit) view returns ((uint256 vestingId, address beneficiary, address token, uint256 totalAmount, uint256 claimedAmount, uint256 claimableNow, uint256 remainingAmount, uint256 dailyBps, uint256 startTimestamp, uint256 elapsedDays, bool active, bool revoked)[] vestings, uint256 total)",
  "function getActiveVestingsBatch(address beneficiary, uint256 offset, uint256 limit) view returns ((uint256 vestingId, address beneficiary, address token, uint256 totalAmount, uint256 claimedAmount, uint256 claimableNow, uint256 remainingAmount, uint256 dailyBps, uint256 startTimestamp, uint256 elapsedDays, bool active, bool revoked)[] vestings, uint256 total)",
  "function claimableAmount(uint256 vestingId) view returns (uint256)",
  // Escribir
  "function claim(uint256 vestingId)",
  "function claimAll()",
  // Eventos
  "event Claimed(uint256 indexed vestingId, address indexed beneficiary, uint256 amount)",
] as const;
```

### Admin

```typescript
export const VESTING_ABI_ADMIN = [
  "function createVesting(address beneficiary, address token, uint256 totalAmount, uint256 dailyBps) returns (uint256 vestingId)",
  "function revokeVesting(uint256 vestingId)",
  "function removeBeneficiary(address beneficiary)",
  "function addAdmin(address account)",
  "function removeAdmin(address account)",
  "function getAllVestingsBatch(uint256 offset, uint256 limit) view returns ((uint256 vestingId, address beneficiary, address token, uint256 totalAmount, uint256 claimedAmount, uint256 claimableNow, uint256 remainingAmount, uint256 dailyBps, uint256 startTimestamp, uint256 elapsedDays, bool active, bool revoked)[] vestings, uint256 total)",
  "function getAllBeneficiariesBatch(uint256 offset, uint256 limit) view returns ((address beneficiary, uint256 totalVestings, uint256 totalAmount, uint256 totalClaimed, uint256 totalClaimable, uint256 totalRemaining)[] info, uint256 total)",
  "function getMultipleBeneficiariesInfo(address[] calldata beneficiaries, uint256 offset, uint256 limit) view returns ((address beneficiary, uint256 totalVestings, uint256 totalAmount, uint256 totalClaimed, uint256 totalClaimable, uint256 totalRemaining)[] info, uint256 total)",
  "function getGlobalTotals() view returns (uint256 totalVestingsCreated, uint256 totalActiveVestings, uint256 totalBeneficiaries, (address token, uint256 totalLocked, uint256 totalDistributed)[] tokenTotals)",
  "event VestingCreated(uint256 indexed vestingId, address indexed beneficiary, address indexed token, uint256 totalAmount, uint256 dailyBps)",
  "event VestingRevoked(uint256 indexed vestingId, uint256 amountReturnedToAdmin, uint256 amountSentToBeneficiary)",
  "event BeneficiaryRemoved(address indexed beneficiary)",
] as const;
```

---

## 3. ABI completo

```typescript
export const VESTING_ABI = [
  { "inputs": [{ "internalType": "address", "name": "deployer", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" },
  { "inputs": [], "name": "InvalidDailyBps", "type": "error" },
  { "inputs": [], "name": "InvalidPagination", "type": "error" },
  { "inputs": [], "name": "NotAdmin", "type": "error" },
  { "inputs": [{ "internalType": "uint256", "name": "vestingId", "type": "uint256" }, { "internalType": "address", "name": "caller", "type": "address" }], "name": "NotBeneficiary", "type": "error" },
  { "inputs": [{ "internalType": "uint256", "name": "vestingId", "type": "uint256" }], "name": "NothingToClaim", "type": "error" },
  { "inputs": [{ "internalType": "uint256", "name": "vestingId", "type": "uint256" }], "name": "VestingAlreadyRevoked", "type": "error" },
  { "inputs": [{ "internalType": "uint256", "name": "vestingId", "type": "uint256" }], "name": "VestingInactive", "type": "error" },
  { "inputs": [{ "internalType": "uint256", "name": "vestingId", "type": "uint256" }], "name": "VestingNotFound", "type": "error" },
  { "inputs": [], "name": "ZeroAddress", "type": "error" },
  { "inputs": [], "name": "ZeroAmount", "type": "error" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }], "name": "AdminAdded", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }], "name": "AdminRemoved", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "beneficiary", "type": "address" }], "name": "BeneficiaryRemoved", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "vestingId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "beneficiary", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Claimed", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" }], "name": "RoleAdminChanged", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleGranted", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleRevoked", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "vestingId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "beneficiary", "type": "address" }, { "indexed": true, "internalType": "address", "name": "token", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "totalAmount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "dailyBps", "type": "uint256" }], "name": "VestingCreated", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "vestingId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amountReturnedToAdmin", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amountSentToBeneficiary", "type": "uint256" }], "name": "VestingRevoked", "type": "event" },
  { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "addAdmin", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "beneficiaryVestings", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "beneficiariesList", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "vestingId", "type": "uint256" }], "name": "claim", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "claimAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "vestingId", "type": "uint256" }], "name": "claimableAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "beneficiary", "type": "address" }, { "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "totalAmount", "type": "uint256" }, { "internalType": "uint256", "name": "dailyBps", "type": "uint256" }], "name": "createVesting", "outputs": [{ "internalType": "uint256", "name": "vestingId", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "emergencyWithdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "beneficiary", "type": "address" }, { "internalType": "uint256", "name": "offset", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" }], "name": "getActiveVestingsBatch", "outputs": [{ "components": [{ "internalType": "uint256", "name": "vestingId", "type": "uint256" }, { "internalType": "address", "name": "beneficiary", "type": "address" }, { "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "totalAmount", "type": "uint256" }, { "internalType": "uint256", "name": "claimedAmount", "type": "uint256" }, { "internalType": "uint256", "name": "claimableNow", "type": "uint256" }, { "internalType": "uint256", "name": "remainingAmount", "type": "uint256" }, { "internalType": "uint256", "name": "dailyBps", "type": "uint256" }, { "internalType": "uint256", "name": "startTimestamp", "type": "uint256" }, { "internalType": "uint256", "name": "elapsedDays", "type": "uint256" }, { "internalType": "bool", "name": "active", "type": "bool" }, { "internalType": "bool", "name": "revoked", "type": "bool" }], "internalType": "struct MultiTokenVesting.VestingInfo[]", "name": "vestings", "type": "tuple[]" }, { "internalType": "uint256", "name": "total", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "offset", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" }], "name": "getAllBeneficiariesBatch", "outputs": [{ "components": [{ "internalType": "address", "name": "beneficiary", "type": "address" }, { "internalType": "uint256", "name": "totalVestings", "type": "uint256" }, { "internalType": "uint256", "name": "totalAmount", "type": "uint256" }, { "internalType": "uint256", "name": "totalClaimed", "type": "uint256" }, { "internalType": "uint256", "name": "totalClaimable", "type": "uint256" }, { "internalType": "uint256", "name": "totalRemaining", "type": "uint256" }], "internalType": "struct MultiTokenVesting.BeneficiaryInfo[]", "name": "", "type": "tuple[]" }, { "internalType": "uint256", "name": "total", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "offset", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" }], "name": "getAllVestingsBatch", "outputs": [{ "components": [{ "internalType": "uint256", "name": "vestingId", "type": "uint256" }, { "internalType": "address", "name": "beneficiary", "type": "address" }, { "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "totalAmount", "type": "uint256" }, { "internalType": "uint256", "name": "claimedAmount", "type": "uint256" }, { "internalType": "uint256", "name": "claimableNow", "type": "uint256" }, { "internalType": "uint256", "name": "remainingAmount", "type": "uint256" }, { "internalType": "uint256", "name": "dailyBps", "type": "uint256" }, { "internalType": "uint256", "name": "startTimestamp", "type": "uint256" }, { "internalType": "uint256", "name": "elapsedDays", "type": "uint256" }, { "internalType": "bool", "name": "active", "type": "bool" }, { "internalType": "bool", "name": "revoked", "type": "bool" }], "internalType": "struct MultiTokenVesting.VestingInfo[]", "name": "vestings", "type": "tuple[]" }, { "internalType": "uint256", "name": "total", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "beneficiary", "type": "address" }], "name": "getBeneficiaryTotals", "outputs": [{ "components": [{ "internalType": "address", "name": "beneficiary", "type": "address" }, { "internalType": "uint256", "name": "totalVestings", "type": "uint256" }, { "internalType": "uint256", "name": "totalAmount", "type": "uint256" }, { "internalType": "uint256", "name": "totalClaimed", "type": "uint256" }, { "internalType": "uint256", "name": "totalClaimable", "type": "uint256" }, { "internalType": "uint256", "name": "totalRemaining", "type": "uint256" }], "internalType": "struct MultiTokenVesting.BeneficiaryInfo", "name": "info", "type": "tuple" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "beneficiary", "type": "address" }, { "internalType": "uint256", "name": "offset", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" }], "name": "getBeneficiaryVestingsBatch", "outputs": [{ "components": [{ "internalType": "uint256", "name": "vestingId", "type": "uint256" }, { "internalType": "address", "name": "beneficiary", "type": "address" }, { "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "totalAmount", "type": "uint256" }, { "internalType": "uint256", "name": "claimedAmount", "type": "uint256" }, { "internalType": "uint256", "name": "claimableNow", "type": "uint256" }, { "internalType": "uint256", "name": "remainingAmount", "type": "uint256" }, { "internalType": "uint256", "name": "dailyBps", "type": "uint256" }, { "internalType": "uint256", "name": "startTimestamp", "type": "uint256" }, { "internalType": "uint256", "name": "elapsedDays", "type": "uint256" }, { "internalType": "bool", "name": "active", "type": "bool" }, { "internalType": "bool", "name": "revoked", "type": "bool" }], "internalType": "struct MultiTokenVesting.VestingInfo[]", "name": "vestings", "type": "tuple[]" }, { "internalType": "uint256", "name": "total", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getGlobalTotals", "outputs": [{ "internalType": "uint256", "name": "_totalVestingsCreated", "type": "uint256" }, { "internalType": "uint256", "name": "_totalActiveVestings", "type": "uint256" }, { "internalType": "uint256", "name": "_totalBeneficiaries", "type": "uint256" }, { "components": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "totalLocked", "type": "uint256" }, { "internalType": "uint256", "name": "totalDistributed", "type": "uint256" }], "internalType": "struct MultiTokenVesting.TokenTotals[]", "name": "tokenTotals", "type": "tuple[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address[]", "name": "beneficiaries", "type": "address[]" }, { "internalType": "uint256", "name": "offset", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" }], "name": "getMultipleBeneficiariesInfo", "outputs": [{ "components": [{ "internalType": "address", "name": "beneficiary", "type": "address" }, { "internalType": "uint256", "name": "totalVestings", "type": "uint256" }, { "internalType": "uint256", "name": "totalAmount", "type": "uint256" }, { "internalType": "uint256", "name": "totalClaimed", "type": "uint256" }, { "internalType": "uint256", "name": "totalClaimable", "type": "uint256" }, { "internalType": "uint256", "name": "totalRemaining", "type": "uint256" }], "internalType": "struct MultiTokenVesting.BeneficiaryInfo[]", "name": "", "type": "tuple[]" }, { "internalType": "uint256", "name": "total", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "vestingId", "type": "uint256" }], "name": "getVestingInfo", "outputs": [{ "components": [{ "internalType": "uint256", "name": "vestingId", "type": "uint256" }, { "internalType": "address", "name": "beneficiary", "type": "address" }, { "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "totalAmount", "type": "uint256" }, { "internalType": "uint256", "name": "claimedAmount", "type": "uint256" }, { "internalType": "uint256", "name": "claimableNow", "type": "uint256" }, { "internalType": "uint256", "name": "remainingAmount", "type": "uint256" }, { "internalType": "uint256", "name": "dailyBps", "type": "uint256" }, { "internalType": "uint256", "name": "startTimestamp", "type": "uint256" }, { "internalType": "uint256", "name": "elapsedDays", "type": "uint256" }, { "internalType": "bool", "name": "active", "type": "bool" }, { "internalType": "bool", "name": "revoked", "type": "bool" }], "internalType": "struct MultiTokenVesting.VestingInfo", "name": "info", "type": "tuple" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "hasRole", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "isBeneficiary", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "nextVestingId", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "removeAdmin", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "beneficiary", "type": "address" }], "name": "removeBeneficiary", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "vestingId", "type": "uint256" }], "name": "revokeVesting", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "vestingId", "type": "uint256" }], "name": "vestedAmount", "outputs": [{ "internalType": "uint256", "name": "vested", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "VERSION", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "VESTING_ADMIN_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "totalActiveVestings", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "totalBeneficiariesCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "totalVestingsCreated", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalLocked", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalDistributed", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
] as const;
```

---

## 4. Tipos TypeScript

```typescript
// types/vesting.ts

export interface VestingInfo {
  vestingId: bigint;
  beneficiary: string;
  token: string;
  totalAmount: bigint;
  claimedAmount: bigint;
  claimableNow: bigint;      // tokens disponibles para retirar RIGHT NOW
  remainingAmount: bigint;   // tokens aún no devengados
  dailyBps: bigint;          // tasa diaria en BPS (150 = 1.5%/día)
  startTimestamp: bigint;    // Unix timestamp de inicio
  elapsedDays: bigint;       // días completos transcurridos
  active: boolean;
  revoked: boolean;
}

export interface BeneficiaryInfo {
  beneficiary: string;
  totalVestings: bigint;
  totalAmount: bigint;
  totalClaimed: bigint;
  totalClaimable: bigint;    // suma de claimableNow de vestings activos
  totalRemaining: bigint;    // suma de remainingAmount de vestings activos
}

export interface TokenTotals {
  token: string;
  totalLocked: bigint;       // comprometido en vestings activos
  totalDistributed: bigint;  // histórico total entregado
}

export interface GlobalTotals {
  totalVestingsCreated: bigint;
  totalActiveVestings: bigint;
  totalBeneficiaries: bigint;
  tokenTotals: TokenTotals[];
}

// Resultado paginado genérico
export interface Paginated<T> {
  items: T[];
  total: bigint;
  hasMore: boolean;
}
```

---

## 5. Leer datos (sin wallet)

Se puede leer el contrato con un **proveedor público** sin que el usuario tenga wallet conectada.

```typescript
import { ethers } from "ethers";
import { VESTING_CONTRACT_ADDRESS, VESTING_ABI_BENEFICIARY, BASE_RPC } from "./constants/vesting";

// Proveedor de solo lectura — no necesita wallet
const provider = new ethers.JsonRpcProvider(BASE_RPC);

const contract = new ethers.Contract(
  VESTING_CONTRACT_ADDRESS,
  VESTING_ABI_BENEFICIARY,
  provider
);

// Obtener info de un vesting específico
async function getVestingInfo(vestingId: bigint) {
  const info = await contract.getVestingInfo(vestingId);
  return info;
}

// Obtener totales del beneficiario
async function getBeneficiaryTotals(walletAddress: string) {
  const totals = await contract.getBeneficiaryTotals(walletAddress);
  return totals;
}
```

---

## 6. Dashboard del beneficiario

### Obtener todos sus vestings paginados

```typescript
// Cargar los vestings activos de un usuario (se recomienda activos primero)
async function loadActiveVestings(
  walletAddress: string,
  page = 0,
  pageSize = 10
): Promise<Paginated<VestingInfo>> {
  const offset = BigInt(page * pageSize);
  const limit  = BigInt(pageSize);

  const [vestings, total] = await contract.getActiveVestingsBatch(
    walletAddress,
    offset,
    limit
  );

  return {
    items: [...vestings],
    total,
    hasMore: offset + limit < total,
  };
}

// Cargar todos (activos + histórico)
async function loadAllVestings(
  walletAddress: string,
  page = 0,
  pageSize = 10
): Promise<Paginated<VestingInfo>> {
  const [vestings, total] = await contract.getBeneficiaryVestingsBatch(
    walletAddress,
    BigInt(page * pageSize),
    BigInt(pageSize)
  );
  return { items: [...vestings], total, hasMore: (page + 1) * pageSize < Number(total) };
}
```

### Renderizar estado de un vesting

```typescript
import { formatUnits } from "ethers";

function formatVesting(v: VestingInfo, tokenDecimals = 18) {
  const pct = (amount: bigint) =>
    v.totalAmount > 0n
      ? ((Number(amount) / Number(v.totalAmount)) * 100).toFixed(2) + "%"
      : "0%";

  return {
    id: v.vestingId.toString(),
    status: v.revoked ? "Revoked" : v.active ? "Active" : "Completed",
    totalAmount:     formatUnits(v.totalAmount, tokenDecimals),
    claimed:         formatUnits(v.claimedAmount, tokenDecimals),
    claimableNow:    formatUnits(v.claimableNow, tokenDecimals),
    remaining:       formatUnits(v.remainingAmount, tokenDecimals),
    progressPct:     pct(v.claimedAmount),
    claimablePct:    pct(v.claimableNow),
    dailyRate:       `${Number(v.dailyBps) / 100}% / day`,
    elapsedDays:     v.elapsedDays.toString(),
    startDate:       new Date(Number(v.startTimestamp) * 1000).toLocaleDateString(),
  };
}
```

---

## 7. Claim de tokens

### claim() — reclamar un vesting específico

```typescript
import { BrowserProvider } from "ethers";

async function claimVesting(vestingId: bigint) {
  // Obtener signer del usuario (MetaMask / WalletConnect / etc.)
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    VESTING_CONTRACT_ADDRESS,
    VESTING_ABI_BENEFICIARY,
    signer
  );

  // Verificar que hay algo para reclamar antes de enviar TX
  const claimable = await contract.claimableAmount(vestingId);
  if (claimable === 0n) {
    throw new Error("Nothing to claim right now");
  }

  const tx = await contract.claim(vestingId);
  const receipt = await tx.wait();

  // Parsear evento Claimed para obtener el monto exacto entregado
  const iface = new ethers.Interface(VESTING_ABI_BENEFICIARY);
  for (const log of receipt.logs) {
    try {
      const parsed = iface.parseLog({ topics: [...log.topics], data: log.data });
      if (parsed?.name === "Claimed") {
        console.log("Claimed:", formatUnits(parsed.args.amount, 18), "tokens");
      }
    } catch {}
  }

  return receipt;
}
```

### claimAll() — reclamar todos los vestings activos

```typescript
async function claimAllVestings() {
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    VESTING_CONTRACT_ADDRESS,
    VESTING_ABI_BENEFICIARY,
    signer
  );

  // Opcional: verificar que al menos 1 vesting tiene algo para reclamar
  const address = await signer.getAddress();
  const totals = await contract.getBeneficiaryTotals(address);
  if (totals.totalClaimable === 0n) {
    throw new Error("No claimable tokens across any vesting");
  }

  const tx = await contract.claimAll();
  return tx.wait();
}
```

---

## 8. Dashboard de admin

### Crear un vesting

> ⚠️ El admin debe tener **aprobado** al contrato de vesting antes de llamar `createVesting`.
> Paso 1: `token.approve(VESTING_CONTRACT, amount)` → Paso 2: `createVesting(...)`

```typescript
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
] as const;

async function createVesting(
  beneficiary: string,
  tokenAddress: string,
  totalAmount: bigint,
  dailyBps: bigint   // 150 = 1.5% / day
) {
  const provider = new BrowserProvider(window.ethereum);
  const signer   = await provider.getSigner();

  const token   = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
  const vesting = new ethers.Contract(VESTING_CONTRACT_ADDRESS, VESTING_ABI_ADMIN, signer);

  // 1️⃣ Aprobar si no hay allowance suficiente
  const allowance = await token.allowance(await signer.getAddress(), VESTING_CONTRACT_ADDRESS);
  if (allowance < totalAmount) {
    const approveTx = await token.approve(VESTING_CONTRACT_ADDRESS, totalAmount);
    await approveTx.wait();
  }

  // 2️⃣ Crear el vesting
  const tx = await vesting.createVesting(beneficiary, tokenAddress, totalAmount, dailyBps);
  const receipt = await tx.wait();

  // Parsear vestingId del evento
  const iface = new ethers.Interface(VESTING_ABI_ADMIN);
  for (const log of receipt.logs) {
    try {
      const parsed = iface.parseLog({ topics: [...log.topics], data: log.data });
      if (parsed?.name === "VestingCreated") {
        return { vestingId: parsed.args.vestingId as bigint, receipt };
      }
    } catch {}
  }
}
```

### Ver todos los vestings del contrato

```typescript
async function loadAllVestingsAdmin(page = 0, pageSize = 20) {
  const provider = new ethers.JsonRpcProvider(BASE_RPC);
  const contract = new ethers.Contract(VESTING_CONTRACT_ADDRESS, VESTING_ABI_ADMIN, provider);

  const [vestings, total] = await contract.getAllVestingsBatch(
    BigInt(page * pageSize),
    BigInt(pageSize)
  );

  return { vestings: [...vestings], total, pages: Math.ceil(Number(total) / pageSize) };
}
```

### Totales globales del contrato

```typescript
async function getGlobalStats() {
  const provider = new ethers.JsonRpcProvider(BASE_RPC);
  const contract = new ethers.Contract(VESTING_CONTRACT_ADDRESS, VESTING_ABI_ADMIN, provider);

  const [created, active, beneficiaries, tokenTotals] = await contract.getGlobalTotals();

  return {
    created:       Number(created),
    active:        Number(active),
    beneficiaries: Number(beneficiaries),
    tokens: tokenTotals.map((t: TokenTotals) => ({
      address: t.token,
      locked:      formatUnits(t.totalLocked, 18),
      distributed: formatUnits(t.totalDistributed, 18),
    })),
  };
}
```

### Revocar un vesting

```typescript
async function revokeVesting(vestingId: bigint) {
  const provider = new BrowserProvider(window.ethereum);
  const signer   = await provider.getSigner();
  const contract = new ethers.Contract(VESTING_CONTRACT_ADDRESS, VESTING_ABI_ADMIN, signer);

  const tx = await contract.revokeVesting(vestingId);
  return tx.wait();
}
```

---

## 9. Escuchar eventos en tiempo real

```typescript
// Escuchar claims en tiempo real (para actualizar UI sin polling)
function listenToClaims(onClaim: (vestingId: bigint, beneficiary: string, amount: bigint) => void) {
  const provider = new ethers.WebSocketProvider("wss://base-mainnet.g.alchemy.com/v2/YOUR_KEY");
  const contract = new ethers.Contract(VESTING_CONTRACT_ADDRESS, VESTING_ABI_BENEFICIARY, provider);

  contract.on("Claimed", (vestingId, beneficiary, amount) => {
    onClaim(vestingId, beneficiary, amount);
  });

  // Retorna función para limpiar el listener
  return () => contract.removeAllListeners("Claimed");
}

// Escuchar solo los claims de un beneficiario específico
function listenToMyClaims(myAddress: string, onClaim: (vestingId: bigint, amount: bigint) => void) {
  const provider = new ethers.WebSocketProvider("wss://base-mainnet.g.alchemy.com/v2/YOUR_KEY");
  const contract = new ethers.Contract(VESTING_CONTRACT_ADDRESS, VESTING_ABI_BENEFICIARY, provider);

  // El segundo parámetro filtra por el topic indexado de `beneficiary`
  const filter = contract.filters.Claimed(null, myAddress);
  contract.on(filter, (vestingId, _beneficiary, amount) => {
    onClaim(vestingId, amount);
  });

  return () => contract.removeAllListeners(filter);
}
```

---

## 10. Integración con wagmi v2 + viem

```typescript
// hooks/useVesting.ts
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { VESTING_CONTRACT_ADDRESS, VESTING_ABI } from "../constants/vesting";

// Hook para leer los vestings activos del usuario conectado
export function useActiveVestings(address: `0x${string}` | undefined, page = 0, pageSize = 10) {
  return useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_ABI,
    functionName: "getActiveVestingsBatch",
    args: [address!, BigInt(page * pageSize), BigInt(pageSize)],
    query: { enabled: !!address },
  });
}

// Hook para los totales del usuario
export function useBeneficiaryTotals(address: `0x${string}` | undefined) {
  return useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_ABI,
    functionName: "getBeneficiaryTotals",
    args: [address!],
    query: { enabled: !!address },
  });
}

// Hook para info de un vesting específico
export function useVestingInfo(vestingId: bigint) {
  return useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_ABI,
    functionName: "getVestingInfo",
    args: [vestingId],
  });
}

// Hook para hacer claim
export function useClaim() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claim = (vestingId: bigint) => {
    writeContract({
      address: VESTING_CONTRACT_ADDRESS,
      abi: VESTING_ABI,
      functionName: "claim",
      args: [vestingId],
    });
  };

  const claimAll = () => {
    writeContract({
      address: VESTING_CONTRACT_ADDRESS,
      abi: VESTING_ABI,
      functionName: "claimAll",
    });
  };

  return { claim, claimAll, isPending, isConfirming, isSuccess, hash };
}

// Hook para totales globales (admin)
export function useGlobalTotals() {
  return useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_ABI,
    functionName: "getGlobalTotals",
  });
}
```

---

## 11. Helpers de formato

```typescript
import { formatUnits } from "ethers";

/** Convierte bigint de wei a string legible: "1,234.56" */
export function formatToken(amount: bigint, decimals = 18, maximumFractionDigits = 4): string {
  return Number(formatUnits(amount, decimals)).toLocaleString("en-US", {
    maximumFractionDigits,
  });
}

/** Convierte BPS a porcentaje legible: 150 → "1.5%" */
export function bpsToPercent(bps: bigint): string {
  return `${(Number(bps) / 100).toFixed(2)}%`;
}

/** Porcentaje de progreso de un vesting (0–100) */
export function vestingProgress(v: VestingInfo): number {
  if (v.totalAmount === 0n) return 0;
  return Math.min(100, Number((v.claimedAmount * 10000n) / v.totalAmount) / 100);
}

/** Días restantes estimados hasta completar el vesting */
export function daysUntilComplete(v: VestingInfo): number | null {
  if (!v.active || v.totalAmount === 0n || v.dailyBps === 0n) return null;
  const remaining = v.remainingAmount;
  if (remaining === 0n) return 0;
  // remaining / (totalAmount * dailyBps / 10000)
  const dailyAmount = (v.totalAmount * v.dailyBps) / 10000n;
  if (dailyAmount === 0n) return null;
  return Math.ceil(Number(remaining) / Number(dailyAmount));
}

/** Timestamp Unix → fecha ISO  */
export function tsToDate(ts: bigint): string {
  return new Date(Number(ts) * 1000).toISOString().split("T")[0];
}
```

---

## 12. Errores del contrato

El contrato usa errores personalizados. Así los capturas en el frontend:

```typescript
import { ethers } from "ethers";

const ERROR_SIGNATURES: Record<string, string> = {
  "0x1d0d8404": "InvalidDailyBps",
  "0x8d86bf0a": "InvalidPagination",
  "0x7bfa4b9f": "NotAdmin",
  "0x38323900": "NotBeneficiary",
  "0x7dc3e7b6": "NothingToClaim",
  "0x9d5db4b4": "VestingAlreadyRevoked",
  "0x45f11f77": "VestingInactive",
  "0x1f75e96e": "VestingNotFound",
  "0xd92e233d": "ZeroAddress",
  "0x1f2a2005": "ZeroAmount",
};

export function parseContractError(error: unknown): string {
  const msg = (error as { message?: string })?.message ?? "";

  // Buscar selector en el mensaje de error
  for (const [selector, name] of Object.entries(ERROR_SIGNATURES)) {
    if (msg.includes(selector)) {
      return friendlyError(name);
    }
  }

  // Ethers también puede exponer error.reason
  const reason = (error as { reason?: string })?.reason;
  if (reason) return reason;

  return "Transaction failed. Check your wallet and try again.";
}

function friendlyError(name: string): string {
  const map: Record<string, string> = {
    InvalidDailyBps:       "Daily rate must be between 0.01% and 100%.",
    InvalidPagination:     "Page size must be greater than 0.",
    NotAdmin:              "You don't have admin permissions.",
    NotBeneficiary:        "You are not the beneficiary of this vesting.",
    NothingToClaim:        "No tokens available to claim right now.",
    VestingAlreadyRevoked: "This vesting has already been revoked.",
    VestingInactive:       "This vesting is no longer active.",
    VestingNotFound:       "Vesting not found.",
    ZeroAddress:           "Address cannot be zero.",
    ZeroAmount:            "Amount must be greater than zero.",
  };
  return map[name] ?? name;
}
```

---

## 13. Basis Points — referencia rápida

> El campo `dailyBps` representa la tasa de liberación diaria en **basis points**.
> `10 000 BPS = 100%`. El contrato hace `min(totalAmount, earned)` — **nunca entrega más del 100%**.

| dailyBps | % diario | Días hasta 100% |
|---|---|---|
| `10` | 0.1% | 1000 días |
| `50` | 0.5% | 200 días |
| `100` | 1% | 100 días |
| `150` | 1.5% | ~67 días |
| `200` | 2% | 50 días |
| `500` | 5% | 20 días |
| `1000` | 10% | 10 días |
| `10000` | 100% | 1 día |

Los tokens no reclamados **se acumulan sin penalización**. Si el usuario no reclama en 7 días, al día 8 puede retirar los 8 días acumulados de una sola vez.

---

*Generado el 2026-03-11 · Contrato `v1.0.0` · Base Mainnet*
