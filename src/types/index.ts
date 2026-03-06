export interface Product {
    id: string | number;
    title: string;
    slug?: string;
    description?: string;
    price: number;
    images: string[];
    category_id?: number | string;
    brand_id?: number | string;
    unit_id?: number | string;
    supplier_id?: number | string;
    category?: Category | string;
    brand?: Brand | string;
    unit?: string;
    rating?: number;
    article?: string | null;
    inStock?: number;
    quantity?: number; // Для использования в корзине
    created_at?: string | number;
    updated_at?: string | number;
    deleted_at?: string | number | null;
}

export interface Category {
    id: string | number;
    title: string;
    slug: string;
    image?: string;
    parent_id?: string | number | null;
    children?: Category[];
    totalProductCount?: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}

export interface Brand {
    id: string | number;
    title: string;
    slug: string;
    image?: string;
}

export interface User {
    id: string | number;
    name: string;
    phone: string;
    avatar?: string | null;
    chatId?: string | null;
    email?: string | null;
    is_active?: boolean;
    is_staff?: boolean;
    last_login?: string | null;
}

export interface TokenResponse {
    id: string | number;
    phone: string;
    name: string;
    access: string;
    refresh: string;
}

export interface CartItem extends Product {
    quantity: number;
    added_at?: number | string;
}

export interface Order {
    id: string;
    user_id: string;
    status: number;
    total: number;
    items: OrderItem[];
    created_at: string | number;
    address?: string;
    phone?: string;
    full_name?: string;
    additional_info?: string;
}

export interface OrderItem {
    id: string;
    product_id: string;
    quantity: number;
    price: number;
    total: number;
    product?: Product;
}

// Aliases for compatibility
export type ProductItem = Product;
export type IProduct = Product;
export type CartProduct = CartItem;

export interface ChatMessage {
    text: string;
    isUser: boolean;
    id: string;
    timestamp?: string;
    chatId?: string;
}

export interface Chat {
    id: string;
    title: string;
    lastMessage?: string;
    lastTimestamp?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ServerMessage {
    id: number;
    chat_id: number;
    content: string;
    role: 'user' | 'assistant' | 'system';
    created_at: string;
    updated_at: string;
}

export interface ServerChat {
    id: number;
    user_id: number;
    title: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    messages: ServerMessage[];
}

// Registration/Login types are now handled in their respective components via Zod or inline interfaces.


export type GoodCategory = Category;

export type IOrder = Order;
