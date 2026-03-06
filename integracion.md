# DYV_V2 Smart Contract - Guía de Integración para el Frontend

Este documento proporciona los detalles, métodos y advertencias necesarias para que el equipo de frontend se integre correctamente con el contrato inteligente `DYV_V2`.

## 📌 Resumen General
El contrato `DYV_V2` es una dApp de inversión/ROI donde los usuarios depositan un token base (`TOKEN_MASTER`) para ganar dividendos que pueden ser retirados en un token de recompensa (`TOKEN_REWARD`).

**Requisitos previos para todas las transacciones:**
1. El usuario debe tener su billetera conectada (Ej. con Ethers.js, Wagmi o Web3.js).
2. Estar conectados en la red correcta.
3. El formato de los tokens enviados al contrato se manejan con `6` decimales. Ejemplo: `1 token = 1_000_000`.

---

## 📖 1. Funciones de Lectura (View / Call)
Estos métodos sirven para obtener y renderizar datos en el dashboard y **no requieren firma ni pago de gas**.

### 🔹 Datos Generales del Contrato
*   **`isPaused()`**: Retorna `bool`. Si es `true`, el contrato no aceptará depósitos ni retiros. *(Importante para deshabilitar los botones de interactuar).*
*   **`MIN_INVEST()`**: Retorna `uint`. Indica el monto mínimo requerido para invertir.
*   **`MIN_WITHDRAW()`**: Retorna `uint`. Indica el monto mínimo de dividendos requeridos para retirar.
*   **`getPublicData()`**: Retorna estadísticas de toda la plataforma:
    *   `[0] totalUsers_`: Total de usuarios históricos.
    *   `[1] totalInvested_`: Monto total de tokens ingresados a la plataforma.
    *   `[2] totalWithdrawn_`: Total retirado por la plataforma.
    *   `[3] totalDeposits_`: Número total de depósitos realizados.
    *   `[4] balance_`: Balance de `TOKEN_MASTER` disponible en el contrato.
    *   `[5] maxProfit`: Límite máximo de ganancia preestablecido en el contrato (Ej. 500_000 para 500%).
    *   `[6] daysFormdeploy`: Iteraciones de tiempo transcurridas desde el despliegue del contrato (basado en TIME_STEP).

*   **`getPrice(uint amount)`**: Retorna la equivalencia en `TOKEN_REWARD` calculada usando la conversión directa del pool de Uniswap/Pancake V3 para una cantidad determinada de `TOKEN_MASTER`. (Útil en el frontend para anticipar e indicarle al usuario cuánto va a recibir).

### 🔹 Datos del Panel de Usuario
*   **`getUserData(address userAddress)`**: **Función principal para el dashboard.** Retorna toda la información relacionada con una billetera específica en una tupla (o un array):
    *   `[0] totalWithdrawn_`: Saldo total ya retirado.
    *   `[1] totalRewards`: Total de comisiones ganadas por referidos.
    *   `[2] depositBalance`: **Saldo disponible de dividendos listo para ser retirado.** (Revisar que este valor sea `>= MIN_WITHDRAW`).
    *   `[3] totalDeposits_`: Monto total invertido.
    *   `[4] nextAssignment_`: (Timestamp) Fecha y hora a partir de la cual el usuario puede volver a retirar/invertir (basado en el tiempo de espera).
    *   `[5] amountOfDeposits`: Cantidad de tickets/depósitos hechos por el usuario.
    *   `[6] checkpoint`: Último timestamp en que el usuario hizo una acción.
    *   `[7] maxWithdraw`: Cantidad total de ganancia que se le permite retirar a este usuario.
    *   `[8] referrer_`: La dirección wallet que refirió a este usuario.
    *   `[9] referrerCount_`: Arreglo de 7 posiciones con la cantidad de referidos que tiene en cada nivel de profundidad.

*   **`checkUser(address userAddress)`**: Retorna `bool`.
    *   Si es `true`, el usuario ya cumplió el tiempo de espera mínimo requerido (1 minuto).
    *   Si es `false`, debe seguir esperando.
*   **`userHasMaxWithDraw(address userAddress)`**: Retorna `bool`.
    *   Si es `true`, el usuario ya alacanzó su tope de ganancias (`MAX_PROFIT`). Se le debe avisar o impedir apretar el botón de withdraw.

---

## ✍️ 2. Funciones de Escritura (Transactions)
Estos métodos alteran el estado. El usuario los debe firmar.

### 💰 A. Realizar un Depósito (Invest)
Para invertir, el usuario debe depositar `TOKEN_MASTER`.

⚠️ **Paso 0 - OBLIGATORIO: Aprobar el Token (`Approve`)**
El frontend **tiene que confirmar** que el contrato `DYV_V2` tiene la asignación (`allowance`) suficiente para mover los `TOKEN_MASTER` de la wallet del usuario.
*   Llama a `allowance(userAddress, DYV_V2_ADDRESS)` en el contrato ERC20 de `TOKEN_MASTER`.
*   Si el resultado es menor al monto de inversión (`investAmt`), tienes que disparar primero la función **`approve(DYV_V2_ADDRESS, investAmt)`** del token ERC20 Master.

**Paso 1 - Función de Inversión (`invest`)**
*   **Firma:** `invest(address referrer, uint investAmt)`
*   **Parámetros:**
    *   `referrer`: Dirección del referido (Opcional, si no hay referido pasar `0x0000000000000000000000000000000000000000` o la cuenta de la empresa/defWallet).
    *   `investAmt`: La cantidad del monto, convertida a los 6 decimales.

### 💸 B. Reclamar Ganancias (Withdraw)
El usuario reclama sus dividendos acumulados (`depositBalance`). El contrato determinará su valor equivalente llamando internamente a `getPrice(...)` basado en el pool de Pancake/Uniswap V3 y transferirá los fondos en `TOKEN_REWARD` directamente al usuario. *(Nota: El contrato no ejecuta swaps durante el retiro, sino que lo hace al momento de recibir depósitos `invest`).*

*   **Firma:** `withdraw()`
*   **Condiciones previas antes de enviar:**
    *   Debe haber pasado el tiempo de espera: `checkUser(address) == true`.
    *   Y el usuario no debe tener su tope de ganancia máximo: `userHasMaxWithDraw(address) == false`.
    *   El saldo `depositBalance` debe ser al menos `>= MIN_WITHDRAW`.

---

## ⚠️ 3. Manejo de Errores Comunes
Es importante que se atrapen los siguientes errores y se muestre un Toast/Modal lógico en el lado del cliente (Frontend):

*   `"Pausable: paused"`: El backend de la DApp congeló las interacciones. (Desactivar botones).
*   `"try again later"`: El usuario está llamando la función Withdraw antes de que pase el bloque de tiempo. Mostrar una cuenta regresiva validando contra el `nextAssignment_`.
*   `"you have max withdraw"`: El usuario excedió el 500% (o el limite respectivo) de rentabilidad y ya no le corresponden más beneficios.
*   `"insufficient deposit"`: Está mandando menos de 1 token para invertir.
*   `"User has no dividends"`: Está dando Clic a retirar pero no ha generado el mínimo (o nada) para su retiro y la Lógica falla. Validar que la ganancia a retirar es `>= MIN_WITHDRAW`.
*   `"wait 10 blocks"`: Medida anti-spam. El usuario intentó una acción antes de esperar 10 bloques desde su última transacción.
