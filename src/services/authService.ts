import {
  User,
  LoginCredentials,
  RegisterData,
  LoginResponse,
} from "@/types/types";

const BASE_URL = "https://dummyjson.com";

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...credentials, expiresInMins: 60 }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Credenciales inválidas");
    }
    return data as LoginResponse;
  },

  async getCurrentUser(token: string): Promise<User> {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Token expirado o inválido");
    }
    return res.json() as Promise<User>;
  },

  async register(data: RegisterData): Promise<User> {
    const res = await fetch(`${BASE_URL}/users/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error("No se pudo completar el registro");
    }
    return res.json() as Promise<User>;
  },
};
