import api from "../axios";
import { saveTokensToStore } from "../axios";
import type { User, TokenResponse } from "@/lib/legacy";

interface LoginInput {
  phone: string;
  password: string;
}

interface LoginResult {
  user: User | null;
  accessToken: string | null;
  errors: { msg: string }[] | null;
}

export const login = async (data: LoginInput): Promise<LoginResult> => {
  try {
    const response = await api.post<TokenResponse>('/buyer/login/', data);
    const { access, refresh, id, phone, name } = response.data;

    saveTokensToStore(access, refresh);
    if (typeof window !== "undefined") {
      localStorage.setItem("buyerId", String(id));
    }

    return {
      user: { id, phone, name },
      accessToken: access,
      errors: null,
    };
  } catch (error: any) {
    return {
      user: null,
      accessToken: null,
      errors: error.response?.data?.detail
        ? [{ msg: error.response.data.detail }]
        : error.response?.data?.non_field_errors
          ? error.response.data.non_field_errors.map((m: string) => ({ msg: m }))
          : [{ msg: "Сетевая ошибка или ошибка сервера" }],
    };
  }
};
