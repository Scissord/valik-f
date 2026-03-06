import api from "../axios";

interface ResetPasswordResult {
    success: boolean;
    message?: string;
    error?: string;
}

/**
 * POST /buyer/password-reset/
 * Сброс пароля — генерирует временный пароль и отправляет его в WhatsApp.
 */
export const resetPassword = async (phone: string): Promise<ResetPasswordResult> => {
    try {
        const response = await api.post('/buyer/password-reset/', { phone });
        return { success: true, message: response.data.message };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.error || "Ошибка при сбросе пароля",
        };
    }
};
