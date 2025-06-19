import { User, UserRegistration } from "@/interfaces";

interface RegistrationResult {
  user: User | null;
  accessToken: string | null;
  errors: { msg: string }[] | null;
}

export const registration = async (data: UserRegistration): Promise<RegistrationResult> => {
  try {
    const response = await fetch('http://localhost:8080/auth/registration', {
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
        user: null,
        accessToken: null,
        errors: result.errors || [{ msg: "Ошибка при авторизации!" }],
      };
    };

    return {
      user: result.user,
      accessToken: result.accessToken,
      errors: null,
    };
  } catch (error) {
    console.log(error);
    return {
      user: null,
      accessToken: null,
      errors: [{ msg: "Сетевая ошибка или ошибка сервера" }],
    };
  }
};
