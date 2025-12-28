import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Вспомогательные функции для работы с токенами и сессией
// В будущем их можно вынести в отдельный модуль (например, src/services/auth.ts)

export const getAccessTokenFromStore = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
};

const getRefreshTokenFromStore = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refreshToken");
};

export const saveTokensToStore = (accessToken: string, refreshToken?: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("token", accessToken);
    if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
    }
};

export const logoutUser = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
};


const api = axios.create({
  baseURL,
  withCredentials: true, // Разрешаем отправку кук с каждым запросом
  headers: {
    "Content-Type": "application/json",
  },
});

// Перехватчик запросов для автоматического добавления Authorization хедера
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessTokenFromStore();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// --- Логика обновления токена ---

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Перехватчик ответов для обработки 401 ошибки и обновления токена
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Проверяем, что ошибка - 401, и это не повторный запрос после обновления токена
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Если токен уже обновляется, добавляем запрос в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers) {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
            }
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = getRefreshTokenFromStore();

      if (!refreshToken) {
        logoutUser();
        return Promise.reject(error);
      }

      try {
        // Используем чистый axios для запроса на обновление, чтобы избежать цикла перехватчиков
        const { data } = await axios.post(
          `${baseURL}/auth/refresh`, // Убедитесь, что эндпоинт верный
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );

        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        saveTokensToStore(newAccessToken, newRefreshToken);
        
        if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        
        processQueue(null, newAccessToken);
        
        // Повторяем исходный запрос с новым токеном
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        logoutUser(); // Если обновить токен не удалось, разлогиниваем пользователя
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export default api;