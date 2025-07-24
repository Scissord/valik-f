import api from "../axios";
import { UserRegister } from "@/interfaces";

interface RegisterResult {
  success: boolean;
  user?: any;
  accessToken?: string;
  errors?: { msg: string }[];
}

export const registerUser = async (data: UserRegister): Promise<RegisterResult> => {
  try {
    const response = await api.post('/auth/registration', data);

    return {
      success: true,
      user: response.data.user,
      accessToken: response.data.accessToken,
    };
  } catch (error: any) {
    return {
      success: false,
      errors: error.response?.data?.errors || [{ msg: "Сетевая ошибка или ошибка сервера" }],
    };
  }
}; 