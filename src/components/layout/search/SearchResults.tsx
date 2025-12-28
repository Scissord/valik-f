'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SearchResult } from '@/hooks/useSearch';

interface SearchResultsProps {
    results: SearchResult[];
    searchQuery: string;
    isLoading: boolean;
    isMobile?: boolean;
    onResultClick: () => void;
}

export const SearchResults = ({
    results,
    searchQuery,
    isLoading,
    isMobile = false,
    onResultClick
}: SearchResultsProps) => {
    const containerClass = isMobile
        ? 'fixed left-4 right-4 top-[120px] bg-white mt-2 py-2 rounded-lg shadow-lg max-h-[50vh] overflow-y-auto border border-gray-200 z-[100]'
        : 'absolute top-full left-0 right-0 bg-white mt-2 py-2 rounded-lg shadow-lg max-h-[400px] overflow-y-auto border border-gray-200 z-50';

    const getResultLink = (result: SearchResult) => {
        switch (result.type) {
            case 'product':
                return `/product/${result.slug}`;
            case 'category':
                return `/categories/${result.slug}`;
            case 'brand':
                return `/brands/${result.slug}`;
        }
    };

    const getTypeLabel = (result: SearchResult) => {
        switch (result.type) {
            case 'product':
                return (
                    <span className="flex items-center gap-1">
                        {result.category && <span className="text-gray-500">{result.category} •</span>}
                        <span>Товар</span>
                        {result.price && (
                            <span className="font-medium text-gray-900">
                                • {result.price.toLocaleString('ru-RU')} ₸
                            </span>
                        )}
                    </span>
                );
            case 'category':
                return 'Категория';
            case 'brand':
                return 'Бренд';
        }
    };

    if (results.length === 0) {
        return (
            <div className={containerClass}>
                <div className="px-4 py-3 text-sm text-gray-500 text-center italic">
                    {searchQuery.length >= 2 && !isLoading
                        ? 'Ничего не найдено'
                        : 'Введите запрос для поиска'}
                </div>
            </div>
        );
    }

    return (
        <div className={containerClass}>
            {results.map((result) => (
                <Link
                    href={getResultLink(result)}
                    key={`${result.type}-${result.id}`}
                    onClick={onResultClick}
                >
                    <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3">
                        {result.image && (
                            <div className="relative w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                                <Image
                                    src={result.image}
                                    alt={result.title}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                        )}
                        <div>
                            <div className="font-medium text-gray-800">{result.title}</div>
                            <div className="text-xs text-gray-500 mt-1">
                                {getTypeLabel(result)}
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};
