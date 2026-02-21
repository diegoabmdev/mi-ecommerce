"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { authService } from "@/services/authService";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { User, Address, LoginCredentials } from "@/types/types";
import { toast } from "sonner";

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
    "novacart_addresses",
    [],
  );

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("novacart_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authService.getCurrentUser(token);
        setUser(userData);
      } catch {
        localStorage.removeItem("novacart_token");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem("novacart_token", response.accessToken);
      setUser(response as unknown as User);
      toast.success(`Bienvenido de vuelta, ${response.firstName}`);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al iniciar sesión";
      toast.error(message);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("novacart_token");
    toast.info("Has cerrado sesión");
  }, []);

  const addAddress = useCallback(
    (data: Omit<Address, "id" | "isDefault">) => {
      setAddresses((prev) => {
        const newAddr: Address = {
          ...data,
          id: crypto.randomUUID(),
          isDefault: prev.length === 0,
        };
        return [...prev, newAddr];
      });
      toast.success("Dirección guardada correctamente");
    },
    [setAddresses],
  );

  const deleteAddress = useCallback(
    (id: string) => {
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      toast.error("Dirección eliminada");
    },
    [setAddresses],
  );

  const updateAddress = useCallback(
    (id: string, data: Partial<Address>) => {
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === id ? { ...addr, ...data } : addr)),
      );
      toast.success("Dirección actualizada");
    },
    [setAddresses],
  );

  const setDefaultAddress = useCallback(
    (id: string) => {
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === id, // Solo la seleccionada será true
        })),
      );
      toast.success("Dirección predeterminada actualizada");
    },
    [setAddresses],
  );

  const contextValue = useMemo(
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

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe usarse dentro de UserProvider");
  return context;
};
