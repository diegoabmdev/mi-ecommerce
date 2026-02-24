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
import { User, Address, LoginCredentials } from "@/types/types";
import { toast } from "sonner";

const AUTH_TOKEN_KEY = "novacart_token";
const ADDRESSES_KEY = "novacart_addresses";

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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [addresses, setAddresses] = useLocalStorage<Address[]>(
    ADDRESSES_KEY,
    [],
  );

  // 2. Protege el efecto de inicialización con una Ref para evitar re-ejecuciones accidentales
  const hasFetched = useRef(false);

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
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setUser(null);
      } finally {
        setIsLoading(false);
        hasFetched.current = true;
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);
      // Asegúrate de que response tenga la forma de User o mapealo correctamente
      setUser(response as unknown as User);
      toast.success(`Bienvenido de vuelta, ${response.firstName}`);
    } catch (error: any) {
      toast.error(error.message || "Error al iniciar sesión");
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    toast.info("Has cerrado sesión");
  }, []);

  // 3. Optimizamos las funciones de direcciones envolviéndolas correctamente
  const addAddress = useCallback(
    (data: Omit<Address, "id" | "isDefault">) => {
      setAddresses((prev) => {
        const newAddress: Address = {
          ...data,
          id: crypto.randomUUID(),
          isDefault: prev.length === 0,
        };
        return [...prev, newAddress];
      });
      toast.success("Dirección añadida");
    },
    [setAddresses],
  );

  const deleteAddress = useCallback(
    (id: string) => {
      setAddresses((prev) => {
        if (prev.length <= 1) {
          toast.error("Debes mantener al menos una dirección");
          return prev;
        }
        const addressToDelete = prev.find((addr) => addr.id === id);
        if (addressToDelete?.isDefault) {
          toast.error("No puedes eliminar tu dirección predeterminada");
          return prev;
        }
        toast.error("Dirección eliminada");
        return prev.filter((addr) => addr.id !== id);
      });
    },
    [setAddresses],
  );

  const updateAddress = useCallback(
    (id: string, data: Partial<Address>) => {
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === id ? { ...addr, ...data } : addr)),
      );
      toast.success("Cambios guardados");
    },
    [setAddresses],
  );

  const setDefaultAddress = useCallback(
    (id: string) => {
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === id,
        })),
      );
      toast.success("Dirección principal actualizada");
    },
    [setAddresses],
  );

  // 4. El valor del contexto debe ser lo más estable posible
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
