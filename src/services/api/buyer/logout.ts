import api from "../axios";
import { logoutUser } from "../axios";

/**
 * POST /buyer/logout/
 * Аннулирует refresh токен на сервере и очищает localStorage
 */
export const logout = async (): Promise<void> => {
    try {
        const refresh = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
        if (refresh) {
            await api.post('/buyer/logout/', { refresh });
        }
    } catch (error) {
        console.error("Ошибка при выходе:", error);
    } finally {
        logoutUser();
        if (typeof window !== "undefined") {
            localStorage.removeItem("buyerId");
        }
    }
};
