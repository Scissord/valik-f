import { UserLogin } from "@/interfaces";

interface LoginResult {
  success: boolean;
  user: any | null;
  accessToken: string | null;
  errors: { msg: string }[] | null;
}

export const login = async (data: UserLogin): Promise<LoginResult> => {
  try {
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        user: null,
        accessToken: null,
        errors: result.errors || [{ msg: "Ошибка при авторизации!" }],
      };
    };

    return {
      success: true,
      user: result.user,
      accessToken: result.accessToken,
      errors: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      user: null,
      accessToken: null,
      errors: [{ msg: "Сетевая ошибка или ошибка сервера" }],
    };
  }
};
