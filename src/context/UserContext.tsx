// src/context/UserContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { authService } from "@/services/authService";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { User, Address, LoginCredentials, Order } from "@/types/types";
import { toast } from "sonner";

const AUTH_TOKEN_KEY = "novacart_token";
const ADDRESSES_KEY = "novacart_addresses";
const ORDERS_KEY = "novacart_orders";

interface UserContextType {
  user: User | null;
  addresses: Address[];
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  addAddress: (data: Omit<Address, "id" | "isDefault">) => void;
  deleteAddress: (id: string) => void;
  updateAddress: (id: string, data: Partial<Address>) => void;
  setDefaultAddress: (id: string) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useLocalStorage<Order[]>(ORDERS_KEY, []);

  const [addresses, setAddresses] = useLocalStorage<Address[]>(
    ADDRESSES_KEY,
    [],
  );

  const hasFetched = useRef(false);

  const createDefaultAddress = (userData: User): Address => ({
    id: "default-api",
    name: "Casa (DummyJSON)",
    address: userData.address?.address || "Calle Principal 123",
    city: userData.address?.city || "Santiago",
    state: userData.address?.state || "Metropolitana",
    postalCode: userData.address?.postalCode || "123456",
    country: userData.address?.country || "Chile",
    isDefault: true,
  });

  const addOrder = useCallback(
    (order: Order) => {
      setOrders((prev) => [order, ...prev]);
    },
    [setOrders],
  );

  useEffect(() => {
    if (hasFetched.current) return;

    const initAuth = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        setIsLoading(false);
        hasFetched.current = true;
        return;
      }

      try {
        const userData = await authService.getCurrentUser(token);
        setUser(userData);

        const stored = localStorage.getItem(ADDRESSES_KEY);
        if (!stored || JSON.parse(stored).length === 0) {
          const defaultAddr = createDefaultAddress(userData);
          setAddresses([defaultAddr]);
        }
      } catch (error) {
        console.error("Auth init error:", error);
        localStorage.removeItem(AUTH_TOKEN_KEY);
      } finally {
        setIsLoading(false);
        hasFetched.current = true;
      }
    };

    initAuth();
  }, [setAddresses]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const response = await authService.login(credentials);

        localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);

        const userData = response as unknown as User;

        const storedAddresses = localStorage.getItem(ADDRESSES_KEY);
        const parsedAddresses = storedAddresses
          ? JSON.parse(storedAddresses)
          : [];

        if (parsedAddresses.length === 0) {
          const defaultAddr = createDefaultAddress(userData);
          localStorage.setItem(ADDRESSES_KEY, JSON.stringify([defaultAddr]));
          setAddresses([defaultAddr]);
        }

        setUser(userData);
        toast.success(`Bienvenido, ${userData.firstName}`);
      } catch (error: any) {
        toast.error(error.message || "Error al iniciar sesión");
        throw error;
      }
    },
    [setAddresses],
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setAddresses([]);
    localStorage.removeItem(ADDRESSES_KEY);
    toast.info("Sesión cerrada");
  }, [setAddresses]);

  const addAddress = useCallback(
    (data: Omit<Address, "id" | "isDefault">) => {
      setAddresses((prev) => [
        ...prev,
        { ...data, id: crypto.randomUUID(), isDefault: prev.length === 0 },
      ]);
      toast.success("Dirección añadida");
    },
    [setAddresses],
  );

  const deleteAddress = useCallback(
    (id: string) => {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    },
    [setAddresses],
  );

  const updateAddress = useCallback(
    (id: string, data: Partial<Address>) => {
      setAddresses((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...data } : a)),
      );
    },
    [setAddresses],
  );

  const setDefaultAddress = useCallback(
    (id: string) => {
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id })),
      );
    },
    [setAddresses],
  );

  const value = useMemo(
    () => ({
      user,
      addresses,
      isLoading,
      login,
      logout,
      addAddress,
      deleteAddress,
      updateAddress,
      setDefaultAddress,
      orders,
      addOrder,
    }),
    [
      user,
      addresses,
      isLoading,
      login,
      logout,
      addAddress,
      deleteAddress,
      updateAddress,
      setDefaultAddress,
      orders,
      addOrder,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  return context;
};
