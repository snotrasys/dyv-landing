# Airdrop — Guía de Integración Frontend

## Resumen

Contrato de distribución de tokens con **vesting lineal al 3% diario**. Los usuarios son registrados por el owner con un monto asignado y pueden reclamar rewards acumulados progresivamente hasta agotar su `totalAmount`.

> **Nota (Testing):** En el contrato desplegado `DAY = 1 hours`, es decir, un "día" de vesting equivale a 1 hora. En producción será `1 days`.

---

## Configuración

```ts
// config/airdrop.ts
export const AIRDROP_ADDRESS = "0xb35d3c48AEab92BE02192e77EcBfD63fDc2Ec9F4" as const;
export const TOKEN_ADDRESS = "0x12e54508785649a2C360169a06479e5007C8100A" as const;
export const TOKEN_DECIMALS = 6;
export const AIRDROP_ABI = [...] as const; // ABI generado al compilar
```

---

## Struct User

```ts
type AirdropUser = {
  userAddress: `0x${string}`; // dirección del usuario
  totalAmount: bigint;        // total asignado (6 decimales)
  claimedAmount: bigint;      // monto ya reclamado (6 decimales)
  lastClaimed: bigint;        // timestamp del último claim
};
```

---

## Funciones de Lectura (sin gas)

| Función | Parámetros | Retorna | Descripción |
|---------|------------|---------|-------------|
| `getUserInfo(wallet)` | `address` | `(User, uint256)` | Struct del usuario + balance claimable |
| `getBalance(wallet)` | `address` | `uint256` | Balance pendiente de claim |
| `getUser(wallet)` | `address` | `User` | Datos raw del usuario |
| `INIT_DATE()` | — | `uint256` | Timestamp de deploy del contrato |
| `rewardToDistribute()` | — | `uint256` | Total de rewards registrados |
| `getInvestors()` | — | `address[]` | Lista completa de inversores |
| `getInvestorBatch(init, len)` | `uint, uint` | `(address[], uint[])` | Inversores paginados |
| `getUserInfoBatch(wallets)` | `address[]` | `(User[], uint[])` | Info de múltiples usuarios |

## Función de Escritura (requiere gas)

| Función | Parámetros | Descripción |
|---------|------------|-------------|
| `claim()` | — | Reclama todos los rewards acumulados |

> `claim()` no requiere `approve` previo. El contrato ya posee los tokens.

---

## Hooks con Wagmi

### Leer info del usuario

```ts
import { useReadContract } from "wagmi";
import { AIRDROP_ADDRESS, AIRDROP_ABI } from "@/config/airdrop";

export function useAirdropUser(wallet?: `0x${string}`) {
  return useReadContract({
    address: AIRDROP_ADDRESS,
    abi: AIRDROP_ABI,
    functionName: "getUserInfo",
    args: wallet ? [wallet] : undefined,
    query: { enabled: !!wallet },
  });
}
```

### Leer balance claimable

```ts
export function useAirdropBalance(wallet?: `0x${string}`) {
  return useReadContract({
    address: AIRDROP_ADDRESS,
    abi: AIRDROP_ABI,
    functionName: "getBalance",
    args: wallet ? [wallet] : undefined,
    query: {
      enabled: !!wallet,
      refetchInterval: 30_000, // refrescar cada 30s
    },
  });
}
```

### Claim de rewards

```ts
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

export function useAirdropClaim() {
  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const claim = () =>
    writeContract({
      address: AIRDROP_ADDRESS,
      abi: AIRDROP_ABI,
      functionName: "claim",
    });

  return { claim, isPending, isConfirming, isSuccess };
}
```

---

## Estados del Usuario en UI

| Estado | Condición | Qué mostrar |
|--------|-----------|-------------|
| No registrado | `userAddress === "0x0..."` | "No elegible para airdrop" |
| Acumulando | `balance === 0n && claimedAmount < totalAmount` | "Acumulando rewards..." |
| Rewards disponibles | `balance > 0n` | Botón **Claim** habilitado |
| Totalmente reclamado | `claimedAmount >= totalAmount` | "100% reclamado" |

---

## Cálculos para UI

```ts
import { formatUnits } from "viem";

// Token tiene 6 decimales
const TOKEN_DECIMALS = 6;

// Balance formateado
const formattedBalance = formatUnits(balance, TOKEN_DECIMALS);

// Progreso de vesting (%)
const progress = Number((claimedAmount * 10000n) / totalAmount) / 100;

// Monto restante por reclamar
const remaining = totalAmount - claimedAmount;
```

---

## Eventos

```solidity
event Claim(address indexed user, uint amount);
event AddUser(uint userCount, uint totalRewards);
```

Usar `Claim` para mostrar historial de claims del usuario o notificaciones post-transacción.

---

## Ejemplo de Componente

```tsx
"use client";

import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { useAirdropUser, useAirdropClaim } from "@/hooks/useAirdrop";

export function AirdropCard() {
  const { address } = useAccount();
  const { data, refetch } = useAirdropUser(address);
  const { claim, isPending, isConfirming, isSuccess } = useAirdropClaim();

  if (!data) return null;

  const [user, balance] = data;
  const isEligible = user.userAddress !== "0x0000000000000000000000000000000000000000";

  if (!isEligible) return <p>No elegible para airdrop</p>;

  const progress = Number((user.claimedAmount * 10000n) / user.totalAmount) / 100;

  return (
    <div>
      <p>Total asignado: {formatUnits(user.totalAmount, 6)} TOKEN</p>
      <p>Reclamado: {formatUnits(user.claimedAmount, 6)} TOKEN ({progress}%)</p>
      <p>Disponible: {formatUnits(balance, 6)} TOKEN</p>

      <button
        onClick={() => claim()}
        disabled={balance === 0n || isPending || isConfirming}
      >
        {isPending ? "Firmando..." : isConfirming ? "Confirmando..." : "Claim"}
      </button>

      {isSuccess && <p>Claim exitoso! Recargando...</p>}
    </div>
  );
}
```

---

## Consideraciones

- **Formateo:** El token tiene **6 decimales**. Usar `formatUnits(amount, 6)` para mostrar montos legibles.
- **Testing:** 1 "día" de vesting = 1 hora. El 3% se acumula cada hora, no cada 24h.
- **Vesting lineal:** El balance crece continuamente (~3% por período), no por epochs.
- **Refetch post-claim:** Invalidar las queries de `getUserInfo` y `getBalance` tras confirmar la transacción.
- **El usuario no se registra solo:** Solo el owner agrega usuarios vía `addUsers()`. El frontend solo necesita leer y llamar `claim()`.
- **Sin approve necesario:** El contrato ya tiene los tokens depositados; `claim()` transfiere directamente.
