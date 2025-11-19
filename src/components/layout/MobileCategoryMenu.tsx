"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { IoMenuOutline, IoCloseOutline, IoChevronForward } from "react-icons/io5";
import { ProductRepository } from "@/lib/infrastructure/repositories/product.repository";
import { httpClient } from "@/lib/infrastructure/http/http-client";
import { ProductCategory } from "@/lib/types/domain/product.types";
import { createPortal } from "react-dom";

export const MobileCategoryMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const repo = new ProductRepository(httpClient);
                const data = await repo.getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && categories.length === 0) {
            fetchCategories();
        }
    }, [isOpen, categories.length]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            // Prevent body scroll when menu is open
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 -ml-2 text-gray-700 hover:text-[#fc640c] transition-colors"
                aria-label="Меню категорий"
            >
                <IoMenuOutline className="w-7 h-7" />
            </button>

            {mounted && isOpen && createPortal(
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Drawer */}
                    <div
                        ref={menuRef}
                        className="fixed top-0 left-0 h-full w-[80%] max-w-xs bg-white z-[70] shadow-xl transform transition-transform duration-300 ease-in-out translate-x-0"
                    >
                        <div className="flex flex-col h-full">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h2 className="text-lg font-bold text-gray-800">Каталог</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    <IoCloseOutline className="w-6 h-6 text-gray-600" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-2">
                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fc640c]"></div>
                                    </div>
                                ) : (
                                    <nav className="px-2 space-y-1">
                                        {categories.map((category) => (
                                            <Link
                                                key={category.id}
                                                href={`/category/${category.slug}`}
                                                className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-[#fc640c] transition-colors group"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <span className="font-medium">{category.name}</span>
                                                <IoChevronForward className="w-4 h-4 text-gray-400 group-hover:text-[#fc640c]" />
                                            </Link>
                                        ))}
                                        {categories.length === 0 && !loading && (
                                            <div className="px-4 py-3 text-gray-500 text-center">
                                                Категории не найдены
                                            </div>
                                        )}
                                    </nav>
                                )}
                            </div>

                            <div className="p-4 border-t border-gray-100 bg-gray-50">
                                <div className="space-y-3">
                                    <Link
                                        href="/about"
                                        className="block text-gray-600 hover:text-[#fc640c] font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        О сервисе
                                    </Link>
                                    <Link
                                        href="/contacts"
                                        className="block text-gray-600 hover:text-[#fc640c] font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Контакты
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </>,
                document.body
            )}
        </div>
    );
};
