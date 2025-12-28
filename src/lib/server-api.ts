/**
 * Server-side API functions for SSR pages
 * These functions use native fetch and work on the server
 */

import type { Product, GoodCategory } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface ProductsResponse {
    products: Product[];
    total: number;
    totalPages: number;
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
            `${API_URL}/products/main?page=${page}&limit=${limit}`,
            {
                next: { revalidate: 60 }, // Cache for 60 seconds
            }
        );

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
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
        const response = await fetch(`${API_URL}/categories/tree`, {
            next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data && Array.isArray(data)) {
            return data.filter(
                (category: GoodCategory) => category && category.id && category.title
            );
        }

        return [];
    } catch (error) {
        console.error("[Server API] Error fetching categories:", error);
        return [];
    }
}
