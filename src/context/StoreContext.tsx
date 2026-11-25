"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type {
  CartItem,
  GuestUser,
  OrderCustomer,
  OrderRecord,
  OrderStage,
  PaymentMethod,
  Product,
  ToastMessage,
} from "@/types/store";
import {
  FREE_DELIVERY_THRESHOLD_PKR,
  STANDARD_DELIVERY_FEE_PKR,
  generateOrderId,
} from "@/lib/utils";

const STORAGE_KEYS = {
  CART: "zelvyn_cart_v1",
  USER: "zelvyn_user_v1",
  ORDERS: "zelvyn_orders_v1",
  WISHLIST: "zelvyn_wishlist_v1",
  PROMO: "zelvyn_promo_v1",
} as const;

export const VALID_PROMO_CODES: Record<string, { rate: number; label: string }> = {
  REAL10: { rate: 0.1, label: "10% OFF — KEEPIN' IT REAL" },
  ZELVYN50: { rate: 0.5, label: "50% OFF — 11:11 ARCHIVE PASS" },
};

interface PersistedSnapshot {
  cart: CartItem[];
  promoCode: string | null;
  wishlist: string[];
  user: GuestUser | null;
  orders: OrderRecord[];
}

const DEFAULT_SNAPSHOT: PersistedSnapshot = {
  cart: [],
  promoCode: null,
  wishlist: [],
  user: null,
  orders: [],
};

let clientSnapshotCache: PersistedSnapshot | null = null;
const storeListeners = new Set<() => void>();

function readStorageSnapshot(): PersistedSnapshot {
  if (typeof window === "undefined") return DEFAULT_SNAPSHOT;
  if (clientSnapshotCache) return clientSnapshotCache;

  try {
    const rawCart = localStorage.getItem(STORAGE_KEYS.CART);
    const rawUser = localStorage.getItem(STORAGE_KEYS.USER);
    const rawOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const rawWishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    const rawPromo = localStorage.getItem(STORAGE_KEYS.PROMO);

    clientSnapshotCache = {
      cart: rawCart ? JSON.parse(rawCart) : [],
      user: rawUser ? JSON.parse(rawUser) : null,
      orders: rawOrders ? JSON.parse(rawOrders) : [],
      wishlist: rawWishlist ? JSON.parse(rawWishlist) : [],
      promoCode: rawPromo && VALID_PROMO_CODES[rawPromo] ? rawPromo : null,
    };
  } catch {
    clientSnapshotCache = DEFAULT_SNAPSHOT;
  }
  return clientSnapshotCache;
}

function updateSnapshot(
  updater: (prev: PersistedSnapshot) => PersistedSnapshot
) {
  const current = readStorageSnapshot();
  const next = updater(current);
  clientSnapshotCache = next;

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(next.cart));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(next.orders));
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(next.wishlist));
    if (next.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(next.user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    if (next.promoCode) {
      localStorage.setItem(STORAGE_KEYS.PROMO, next.promoCode);
    } else {
      localStorage.removeItem(STORAGE_KEYS.PROMO);
    }
  }

  storeListeners.forEach((listener) => listener());
}

function subscribeSnapshot(listener: () => void) {
  storeListeners.add(listener);
  if (typeof window === "undefined") {
    return () => {
      storeListeners.delete(listener);
    };
  }
  const onStorage = () => {
    clientSnapshotCache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    storeListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const emptySubscribe = () => () => {};

interface StoreContextValue {
  hydrated: boolean;
  cart: CartItem[];
  cartCount: number;
  subtotalPKR: number;
  discountPKR: number;
  shippingPKR: number;
  totalPKR: number;
  promoCode: string | null;
  promoLabel: string | null;
  wishlist: string[];
  user: GuestUser | null;
  orders: OrderRecord[];
  toasts: ToastMessage[];
  isCartOpen: boolean;
  isAuthOpen: boolean;
  isSearchOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setAuthOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  addToCart: (
    product: Product,
    size: number,
    color?: string,
    quantity?: number,
    openDrawer?: boolean
  ) => void;
  updateQuantity: (
    productId: string,
    size: number,
    color: string,
    delta: number
  ) => void;
  removeFromCart: (productId: string, size: number, color: string) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { ok: boolean; message: string };
  clearPromoCode: () => void;
  toggleWishlist: (productId: string, productName?: string) => void;
  loginUser: (payload: {
    fullName: string;
    phone: string;
    email: string;
    mode?: "guest" | "member";
    savedCity?: string;
    savedAddress?: string;
  }) => void;
  logoutUser: () => void;
  placeOrder: (payload: {
    customer: OrderCustomer;
    paymentMethod: PaymentMethod;
    paymentSummary: string;
  }) => OrderRecord;
  advanceOrderStage: (orderId: string) => void;
  pushToast: (title: string, description?: string) => void;
  dismissToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const snapshot = useSyncExternalStore(
    subscribeSnapshot,
    readStorageSnapshot,
    () => DEFAULT_SNAPSHOT
  );

  const { cart, promoCode, wishlist, user, orders } = snapshot;

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (title: string, description?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-3), { id, title, description }]);
      setTimeout(() => {
        dismissToast(id);
      }, 3600);
    },
    [dismissToast]
  );

  const addToCart = useCallback(
    (
      product: Product,
      size: number,
      color?: string,
      quantity = 1,
      openDrawer = true
    ) => {
      const selectedColor = color || product.colors[0]?.name || "Obsidian";
      updateSnapshot((prev) => {
        const existingIndex = prev.cart.findIndex(
          (item) =>
            item.productId === product.id &&
            item.size === size &&
            item.color === selectedColor
        );
        if (existingIndex > -1) {
          const nextCart = [...prev.cart];
          nextCart[existingIndex] = {
            ...nextCart[existingIndex],
            quantity: nextCart[existingIndex].quantity + quantity,
          };
          return { ...prev, cart: nextCart };
        }
        return {
          ...prev,
          cart: [
            ...prev.cart,
            {
              productId: product.id,
              slug: product.slug,
              name: product.name,
              sku: product.sku,
              image: product.image,
              pricePKR: product.pricePKR,
              size,
              color: selectedColor,
              quantity,
            },
          ],
        };
      });
      pushToast("Added to Bag", `${product.name} · EU ${size} · ${selectedColor}`);
      if (openDrawer) setCartOpen(true);
    },
    [pushToast]
  );

  const updateQuantity = useCallback(
    (productId: string, size: number, color: string, delta: number) => {
      updateSnapshot((prev) => ({
        ...prev,
        cart: prev.cart
          .map((item) => {
            if (
              item.productId === productId &&
              item.size === size &&
              item.color === color
            ) {
              return { ...item, quantity: item.quantity + delta };
            }
            return item;
          })
          .filter((item) => item.quantity > 0),
      }));
    },
    []
  );

  const removeFromCart = useCallback(
    (productId: string, size: number, color: string) => {
      updateSnapshot((prev) => ({
        ...prev,
        cart: prev.cart.filter(
          (item) =>
            !(
              item.productId === productId &&
              item.size === size &&
              item.color === color
            )
        ),
      }));
      pushToast("Item Removed", "Bag updated.");
    },
    [pushToast]
  );

  const clearCart = useCallback(() => {
    updateSnapshot((prev) => ({ ...prev, cart: [], promoCode: null }));
  }, []);

  const applyPromoCode = useCallback(
    (rawCode: string) => {
      const normalized = rawCode.trim().toUpperCase();
      if (!normalized) {
        return { ok: false, message: "Enter a promo code first." };
      }
      const match = VALID_PROMO_CODES[normalized];
      if (!match) {
        return {
          ok: false,
          message: "Invalid code. Try REAL10 or ZELVYN50.",
        };
      }
      updateSnapshot((prev) => ({ ...prev, promoCode: normalized }));
      pushToast("Promo Applied", match.label);
      return { ok: true, message: match.label };
    },
    [pushToast]
  );

  const clearPromoCode = useCallback(() => {
    updateSnapshot((prev) => ({ ...prev, promoCode: null }));
    pushToast("Promo Removed");
  }, [pushToast]);

  const toggleWishlist = useCallback(
    (productId: string, productName?: string) => {
      const currentlyExists = readStorageSnapshot().wishlist.includes(productId);
      updateSnapshot((prev) => {
        const exists = prev.wishlist.includes(productId);
        return {
          ...prev,
          wishlist: exists
            ? prev.wishlist.filter((id) => id !== productId)
            : [...prev.wishlist, productId],
        };
      });
      pushToast(
        currentlyExists ? "Removed from Archive" : "Saved to Archive",
        productName
          ? `${productName} ${currentlyExists ? "removed" : "saved"}.`
          : undefined
      );
    },
    [pushToast]
  );

  const loginUser = useCallback(
    (payload: {
      fullName: string;
      phone: string;
      email: string;
      mode?: "guest" | "member";
      savedCity?: string;
      savedAddress?: string;
    }) => {
      const nextUser: GuestUser = {
        isLoggedIn: true,
        mode: payload.mode || "guest",
        fullName: payload.fullName.trim(),
        phone: payload.phone.trim(),
        email: payload.email.trim(),
        savedCity: payload.savedCity,
        savedAddress: payload.savedAddress,
        loggedInAt: new Date().toISOString(),
      };
      updateSnapshot((prev) => ({ ...prev, user: nextUser }));
      pushToast(
        nextUser.mode === "guest" ? "Guest Session Active" : "Signed In",
        `${nextUser.fullName} · ${nextUser.phone}`
      );
    },
    [pushToast]
  );

  const logoutUser = useCallback(() => {
    updateSnapshot((prev) => ({ ...prev, user: null }));
    pushToast("Signed Out", "Guest session cleared.");
  }, [pushToast]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const subtotalPKR = useMemo(
    () => cart.reduce((sum, item) => sum + item.pricePKR * item.quantity, 0),
    [cart]
  );

  const promoRate = promoCode ? VALID_PROMO_CODES[promoCode]?.rate || 0 : 0;
  const promoLabel = promoCode
    ? VALID_PROMO_CODES[promoCode]?.label || null
    : null;

  const discountPKR = useMemo(
    () => Math.round(subtotalPKR * promoRate),
    [subtotalPKR, promoRate]
  );

  const afterDiscount = Math.max(0, subtotalPKR - discountPKR);
  const shippingPKR =
    cart.length === 0 || afterDiscount >= FREE_DELIVERY_THRESHOLD_PKR
      ? 0
      : STANDARD_DELIVERY_FEE_PKR;
  const totalPKR = afterDiscount + shippingPKR;

  const placeOrder = useCallback(
    (payload: {
      customer: OrderCustomer;
      paymentMethod: PaymentMethod;
      paymentSummary: string;
    }): OrderRecord => {
      const current = readStorageSnapshot();
      const order: OrderRecord = {
        orderId: generateOrderId(),
        createdAt: new Date().toISOString(),
        statusStage: 0,
        customer: payload.customer,
        paymentMethod: payload.paymentMethod,
        paymentSummary: payload.paymentSummary,
        items: [...current.cart],
        subtotalPKR,
        discountPKR,
        shippingPKR,
        totalPKR,
        promoCode: current.promoCode || undefined,
      };

      updateSnapshot((prev) => ({
        ...prev,
        orders: [order, ...prev.orders],
        user: {
          isLoggedIn: true,
          mode: prev.user?.mode || "guest",
          fullName: payload.customer.fullName,
          phone: payload.customer.phone,
          email: payload.customer.email,
          savedCity: payload.customer.city,
          savedAddress: payload.customer.address,
          loggedInAt: prev.user?.loggedInAt || new Date().toISOString(),
        },
        cart: [],
        promoCode: null,
      }));

      pushToast("Order Confirmed", `Reference ${order.orderId}`);
      return order;
    },
    [discountPKR, pushToast, shippingPKR, subtotalPKR, totalPKR]
  );

  const advanceOrderStage = useCallback(
    (orderId: string) => {
      updateSnapshot((prev) => ({
        ...prev,
        orders: prev.orders.map((order) => {
          if (order.orderId !== orderId) return order;
          const nextStage = Math.min(3, order.statusStage + 1) as OrderStage;
          return { ...order, statusStage: nextStage };
        }),
      }));
      pushToast("Tracking Updated", `${orderId} status advanced.`);
    },
    [pushToast]
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      hydrated,
      cart,
      cartCount,
      subtotalPKR,
      discountPKR,
      shippingPKR,
      totalPKR,
      promoCode,
      promoLabel,
      wishlist,
      user,
      orders,
      toasts,
      isCartOpen,
      isAuthOpen,
      isSearchOpen,
      setCartOpen,
      setAuthOpen,
      setSearchOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyPromoCode,
      clearPromoCode,
      toggleWishlist,
      loginUser,
      logoutUser,
      placeOrder,
      advanceOrderStage,
      pushToast,
      dismissToast,
    }),
    [
      hydrated,
      cart,
      cartCount,
      subtotalPKR,
      discountPKR,
      shippingPKR,
      totalPKR,
      promoCode,
      promoLabel,
      wishlist,
      user,
      orders,
      toasts,
      isCartOpen,
      isAuthOpen,
      isSearchOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyPromoCode,
      clearPromoCode,
      toggleWishlist,
      loginUser,
      logoutUser,
      placeOrder,
      advanceOrderStage,
      pushToast,
      dismissToast,
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return ctx;
}
