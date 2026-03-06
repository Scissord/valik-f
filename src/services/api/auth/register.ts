import api from "../axios";

interface RegisterInput {
  phone: string;
  password: string;
  name: string;
}

interface RegisterResult {
  success: boolean;
  user?: { id: string | number; phone: string; name: string; chatId?: string };
  errors?: { msg: string }[];
}

export const registerUser = async (data: RegisterInput): Promise<RegisterResult> => {
  try {
    const response = await api.post('/buyer/register/', data);

    return {
      success: true,
      user: response.data,
    };
  } catch (error: any) {
    const errData = error.response?.data;
    let errors: { msg: string }[] = [{ msg: "Сетевая ошибка или ошибка сервера" }];

    if (errData) {
      // Django возвращает ошибки в виде объекта {field: [msg, ...]}
      errors = Object.values(errData)
        .flat()
        .map((m: any) => ({ msg: String(m) }));
    }

    return { success: false, errors };
  }
};
