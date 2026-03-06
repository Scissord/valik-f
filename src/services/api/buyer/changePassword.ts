import api from "../axios";

interface ChangePasswordInput {
    buyer_id: string | number;
    old_password: string;
    new_password: string;
}

interface ChangePasswordResult {
    success: boolean;
    message?: string;
    error?: string;
}

/**
 * POST /buyer/change-password/
 * Смена пароля покупателя (требует старый пароль).
 */
export const changePassword = async (
    data: ChangePasswordInput
): Promise<ChangePasswordResult> => {
    try {
        const response = await api.post('/buyer/change-password/', data);
        return { success: true, message: response.data.detail };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.detail || "Ошибка при смене пароля",
        };
    }
};
