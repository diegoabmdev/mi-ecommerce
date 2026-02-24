import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { UserProvider, useUser } from "@/context/UserContext";
import { authService } from "@/services/authService";
import { LoginResponse, User } from "@/types/types";

vi.mock("@/services/authService", () => ({
  authService: {
    login: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

if (!global.crypto.randomUUID) {
  Object.defineProperty(global.crypto, "randomUUID", {
    value: vi.fn(() => `uuid-${Math.random().toString(36).substr(2, 9)}`),
  });
}

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("UserContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <UserProvider>{children}</UserProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("debería inicializar con usuario null y cargar desde token si existe", async () => {
    const mockUser = { id: 1, firstName: "Diego" } as User;
    localStorage.setItem("novacart_token", "fake-token");
    vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useUser(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toEqual(mockUser);
  });

  it("debería gestionar direcciones correctamente (CRUD)", async () => {
    const { result } = renderHook(() => useUser(), { wrapper });

    // 1. Agregar
    await act(async () => {
      result.current.addAddress({ name: "Casa" } as any);
    });
    
    const idCasa = result.current.addresses[0].id;
    expect(result.current.addresses).toHaveLength(1);

    await act(async () => {
      result.current.updateAddress(idCasa, { city: "Valparaíso" });
    });
    expect(result.current.addresses[0].city).toBe("Valparaíso");

    await act(async () => {
      result.current.addAddress({ name: "Oficina" } as any);
    });
    const idOficina = result.current.addresses[1].id;

    await act(async () => {
      result.current.setDefaultAddress(idOficina);
    });

    await act(async () => {
      result.current.deleteAddress(idCasa);
    });

    expect(result.current.addresses).toHaveLength(1);
    expect(result.current.addresses[0].name).toBe("Oficina");
  });

  it("NO debería permitir eliminar la única dirección existente", async () => {
    const { result } = renderHook(() => useUser(), { wrapper });

    await act(async () => {
      result.current.addAddress({ name: "Única" } as any);
    });
    
    const idUnico = result.current.addresses[0].id;

    await act(async () => {
      result.current.deleteAddress(idUnico);
    });

    expect(result.current.addresses).toHaveLength(1);
  });

  it("NO debería permitir eliminar una dirección si es predeterminada", async () => {
    const { result } = renderHook(() => useUser(), { wrapper });

    await act(async () => {
      result.current.addAddress({ name: "Principal" } as any); // isDefault: true
    });
    await act(async () => {
      result.current.addAddress({ name: "Secundaria" } as any); // isDefault: false
    });

    const idPrincipal = result.current.addresses.find(a => a.name === "Principal")!.id;

    await act(async () => {
      result.current.deleteAddress(idPrincipal);
    });

    expect(result.current.addresses).toHaveLength(2);
    expect(result.current.addresses.find(a => a.id === idPrincipal)?.isDefault).toBe(true);
  });

  it("debería limpiar el estado al hacer logout", async () => {
    localStorage.setItem("novacart_token", "active-token");
    vi.mocked(authService.getCurrentUser).mockResolvedValue({ id: 1 } as User);

    const { result } = renderHook(() => useUser(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("novacart_token")).toBeNull();
  });
});