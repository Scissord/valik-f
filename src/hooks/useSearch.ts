import { useState, useCallback, useEffect, useRef } from 'react';

export interface SearchResult {
    id: string;
    title: string;
    type: 'product' | 'category' | 'brand';
    price?: number;
    slug?: string;
    image?: string;
    category?: string;
}

import api from "@/services/api/axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface UseSearchOptions {
    debounceMs?: number;
    minQueryLength?: number;
}

export const useSearch = (options: UseSearchOptions = {}) => {
    const { debounceMs = 500, minQueryLength = 2 } = options;

    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Выполнение поискового запроса
    const performSearch = useCallback(async (query: string) => {
        if (!query || query.length < minQueryLength) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.get(`${baseURL}/search?q=${encodeURIComponent(query)}`);
            const data = response.data;

            // Обработка и преобразование результатов
            const processedResults: SearchResult[] = [];
            const seenKeys = new Map<string, number>();

            const addResult = (item: any, type: 'product' | 'category' | 'brand') => {
                const uniqueKey = `${type}-${item.id}`;

                let image = undefined;
                let category = undefined;

                if (type === 'product') {
                    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
                        image = item.images[0];
                    } else if (typeof item.images === 'string') {
                        image = item.images;
                    }

                    if (item.category) {
                        category = typeof item.category === 'object' ? item.category.title : item.category;
                    }
                }

                if (seenKeys.has(uniqueKey)) {
                    const index = seenKeys.get(uniqueKey)!;
                    const existing = processedResults[index];

                    if (!existing.image && image) {
                        existing.image = image;
                    }
                    if (!existing.category && category) {
                        existing.category = category;
                    }
                } else {
                    const index = processedResults.length;
                    seenKeys.set(uniqueKey, index);

                    processedResults.push({
                        id: item.id,
                        title: item.title,
                        type: type,
                        price: item.price,
                        slug: item.id,
                        image,
                        category
                    });
                }
            };

            if (data.products && Array.isArray(data.products)) {
                data.products.forEach((product: any) => addResult(product, 'product'));
            }

            if (data.categories && Array.isArray(data.categories)) {
                data.categories.forEach((category: any) => addResult(category, 'category'));
            }

            if (data.brands && Array.isArray(data.brands)) {
                data.brands.forEach((brand: any) => addResult(brand, 'brand'));
            }

            setResults(processedResults);
        } catch (error) {
            console.error("[SEARCH] Ошибка при поиске:", error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, [minQueryLength]);

    // Debounced search
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            performSearch(searchQuery);
        }, debounceMs);

        setShowResults(searchQuery.length >= minQueryLength);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [searchQuery, debounceMs, minQueryLength, performSearch]);

    const clearSearch = useCallback(() => {
        setSearchQuery("");
        setResults([]);
        setShowResults(false);
    }, []);

    return {
        searchQuery,
        setSearchQuery,
        results,
        isLoading,
        showResults,
        setShowResults,
        clearSearch
    };
};
