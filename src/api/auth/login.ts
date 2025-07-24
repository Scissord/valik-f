import api from "../axios";
import { User, UserLogin } from "@/interfaces";

interface LoginResult {
  user: User | null;
  accessToken: string | null;
  errors: { msg: string }[] | null;
}

export const login = async (data: UserLogin): Promise<LoginResult> => {
  try {
    const response = await api.post('/auth/login', data);
    
    return {
      user: response.data.user,
      accessToken: response.data.accessToken,
      errors: null,
    };
  } catch (error: any) {
    return {
      user: null,
      accessToken: null,
      errors: error.response?.data?.errors || [{ msg: "Сетевая ошибка или ошибка сервера" }],
    };
  }
};
