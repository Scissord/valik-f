import api from "../axios";
import { User, UserRegister } from "@/interfaces";

interface RegistrationResult {
  user: User | null;
  accessToken: string | null;
  errors: { msg: string }[] | null;
}

export const registerUser = async (data: UserRegister): Promise<RegistrationResult> => {
  try {
    const response = await api.post('/auth/registration', data);

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
