export * from "./categories/get_categories";
export * from "./products/get_products_for_main_page";
export * from "./products/get_products_for_category";
export * from "./products/get_product";
export * from "./orders/create_order";
export * from "./orders/find_order";
export * from "./orders/get_orders";
export * from "./orders/check_order_status";
export * from "./auth/login";
export * from "./auth/register";
export * from "./auth/getProfile";
export * from "./ai/getChats";
export * from "./ai/getChatHistory";
export * from "./ai/sendMessage";
export * from "./ai/deleteChat";
import { getProduct } from "./products/get_product";
import { getProductsForCategory } from "./products/get_products_for_category";
import { getProductsForMainPage } from "./products/get_products_for_main_page";
import { getCategories } from "./categories/get_categories";
import { getProfile } from "./auth/getProfile";
import { login } from "./auth/login";
import { registerUser } from './auth/register';
import { update } from "./users/update";

export const UserAPI = {
    getProfile,
    login,
    registration: registerUser,
    update,
}

export const ProductAPI = {
    getProduct,
    getProductsForMainPage,
    getProductsForCategory,
}

export const CategoriesAPI = {
    getCategories,
}
