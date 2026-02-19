/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "kyro_user_finance_state_v1";

const MEMBERSHIP_PRICES = {
  Bronze: 0,
  Silver: 19.99,
  Gold: 39.99,
  Platinum: 79.99,
};

const DEFAULT_STATE = {
  membershipTier: "Bronze",
  usdBalance: 0,
  wallet: {
    connected: false,
    name: "",
    address: "",
  },
  assetHoldings: [
    { asset: "BTC", balance: 0, value: 0, change: "0.0%", action: "Buy" },
    { asset: "SOL", balance: 0, value: 0, change: "0.0%", action: "Swap" },
    { asset: "ETH", balance: 0, value: 0, change: "0.0%", action: "Trade" },
    { asset: "BNB", balance: 0, value: 0, change: "0.0%", action: "Sell" },
  ],
};

const UserFinanceContext = createContext(null);

const createAddressFromWalletName = (walletName) => {
  const tag = walletName.replace(/\s+/g, "").slice(0, 3).toUpperCase() || "WLT";
  const randomPart = Math.random().toString(16).slice(2, 10).toUpperCase();
  return `0x${tag}${randomPart}`.slice(0, 12) + "...";
};

const loadStoredState = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_STATE;
  try {
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      wallet: { ...DEFAULT_STATE.wallet, ...(parsed.wallet || {}) },
      assetHoldings: Array.isArray(parsed.assetHoldings)
        ? parsed.assetHoldings
        : DEFAULT_STATE.assetHoldings,
    };
  } catch {
    return DEFAULT_STATE;
  }
};

export const UserFinanceProvider = ({ children }) => {
  const [state, setState] = useState(loadStoredState);

  const persist = (updater) => {
    setState((prev) => {
      const next =
        typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const connectWallet = (walletName) => {
    const address = createAddressFromWalletName(walletName);
    persist((prev) => ({
      ...prev,
      wallet: {
        connected: true,
        name: walletName,
        address,
      },
    }));
    return address;
  };

  const disconnectWallet = () => {
    persist((prev) => ({
      ...prev,
      wallet: {
        connected: false,
        name: "",
        address: "",
      },
    }));
  };

  const depositFunds = (amount) => {
    const numeric = Number(amount);
    if (!Number.isFinite(numeric) || numeric <= 0) return 0;
    persist((prev) => ({
      ...prev,
      usdBalance: Number((prev.usdBalance + numeric).toFixed(2)),
    }));
    return numeric;
  };

  const canUpgradeToTier = (tierName) => {
    const price = MEMBERSHIP_PRICES[tierName] ?? 0;
    return state.usdBalance >= price;
  };

  const upgradeMembership = (tierName) => {
    const price = MEMBERSHIP_PRICES[tierName];
    if (price === undefined) {
      return { ok: false, reason: "Unknown tier." };
    }
    if (state.usdBalance < price) {
      return { ok: false, reason: "Insufficient funds." };
    }
    persist((prev) => ({
      ...prev,
      membershipTier: tierName,
      usdBalance: Number((prev.usdBalance - price).toFixed(2)),
    }));
    return { ok: true, spent: price };
  };

  const depositAndUpgradeMembership = (tierName, amount) => {
    const price = MEMBERSHIP_PRICES[tierName];
    const numeric = Number(amount);
    if (price === undefined) return { ok: false, reason: "Unknown tier." };
    if (!Number.isFinite(numeric) || numeric <= 0) {
      return { ok: false, reason: "Invalid deposit amount." };
    }

    let result = { ok: false, reason: "Unknown error." };
    persist((prev) => {
      const fundedBalance = Number((prev.usdBalance + numeric).toFixed(2));
      if (fundedBalance < price) {
        result = {
          ok: false,
          reason: "Insufficient funds after deposit.",
          balance: fundedBalance,
        };
        return {
          ...prev,
          usdBalance: fundedBalance,
        };
      }

      result = {
        ok: true,
        spent: price,
        balance: Number((fundedBalance - price).toFixed(2)),
      };
      return {
        ...prev,
        membershipTier: tierName,
        usdBalance: Number((fundedBalance - price).toFixed(2)),
      };
    });
    return result;
  };

  const resetToZero = () => {
    persist(DEFAULT_STATE);
  };

  const value = useMemo(
    () => ({
      membershipTier: state.membershipTier,
      usdBalance: state.usdBalance,
      wallet: state.wallet,
      assetHoldings: state.assetHoldings,
      membershipPrices: MEMBERSHIP_PRICES,
      connectWallet,
      disconnectWallet,
      depositFunds,
      canUpgradeToTier,
      upgradeMembership,
      depositAndUpgradeMembership,
      resetToZero,
    }),
    [state],
  );

  return (
    <UserFinanceContext.Provider value={value}>
      {children}
    </UserFinanceContext.Provider>
  );
};

export const useUserFinance = () => {
  const context = useContext(UserFinanceContext);
  if (!context) {
    throw new Error("useUserFinance must be used within UserFinanceProvider");
  }
  return context;
};
