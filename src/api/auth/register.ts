import { UserRegister } from "@/interfaces";

interface RegisterResult {
  success: boolean;
  user?: any;
  accessToken?: string;
  errors?: { msg: string }[];
}

export const registerUser = async (data: UserRegister): Promise<RegisterResult> => {
  try {
    const response = await fetch('http://localhost:8080/auth/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        errors: result.errors || [{ msg: "Ошибка при регистрации!" }],
      };
    }

    return {
      success: true,
      user: result.user,
      accessToken: result.accessToken,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      errors: [{ msg: "Сетевая ошибка или ошибка сервера" }],
    };
  }
}; 