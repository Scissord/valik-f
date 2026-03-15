/**
 * Server-side API functions for SSR pages
 * These functions use native fetch and work on the server
 */

import type { Product, GoodCategory } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ProductsResponse {
    products: Product[];
    total: number;
    totalPages: number;
}

/**
 * Normalize product data from API
 */
function normalizeProduct(product: any): Product {
    const images = Array.isArray(product.images) && product.images.length > 0 
        ? product.images 
        : product.image ? [product.image] : [];

    return {
        ...product,
        category: typeof product.category === 'object' && product.category !== null
            ? (product.category.name || 'Не указана')
            : String(product.category || 'Не указана'),
        brand: typeof product.brand === 'object' && product.brand !== null
            ? (product.brand.name || 'Не указан')
            : String(product.brand || 'Не указан'),
        unit: typeof product.unit === 'object' && product.unit !== null
            ? (product.unit.name || 'шт')
            : String(product.unit || 'шт'),
        price: Number(product.price) || 0,
        images: images,
    };
}

/**
 * Fetch products for main page (server-side)
 */
export async function fetchProductsForMainPage(
    page: number = 1,
    limit: number = 8
): Promise<ProductsResponse> {
    try {
        const response = await fetch(
            `${API_URL}/product/main-products/?page=${page}&limit=${limit}`,
            {
                next: { revalidate: 60 }, // Cache for 60 seconds
            }
        );

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        
        // ✅ Нормализуем продукты
        return {
            ...data,
            products: (data.products || []).map(normalizeProduct),
        };
    } catch (error) {
        console.error("[Server API] Error fetching products:", error);
        return { products: [], total: 0, totalPages: 0 };
    }
}

/**
 * Fetch categories tree (server-side)
 */
export async function fetchCategories(): Promise<GoodCategory[]> {
    try {
        const response = await fetch(`${API_URL}/product/categories/tree/`, {
            next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data && Array.isArray(data)) {
            return data.filter(
                (category: GoodCategory) => category && category.id && category.name
            );
        }

        return [];
    } catch (error) {
        console.error("[Server API] Error fetching categories:", error);
        return [];
    }
}
