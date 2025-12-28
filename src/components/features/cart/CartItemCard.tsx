'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { IoAddOutline, IoRemoveOutline, IoTrashOutline } from 'react-icons/io5';
import { CartItem, currencyFormat } from '@/lib/legacy';

interface CartItemCardProps {
    product: CartItem;
    updateProductQuantity: (product: CartItem, quantity: number) => void;
    deleteProduct: (product: CartItem) => void;
}

export const CartItemCard = ({ product, updateProductQuantity, deleteProduct }: CartItemCardProps) => {
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        startX.current = e.touches[0].clientX;
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const diff = startX.current - e.touches[0].clientX;
        if (diff > 0) {
            setSwipeOffset(Math.min(diff, 80));
        } else {
            setSwipeOffset(0);
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        if (swipeOffset > 60) {
            setSwipeOffset(80);
        } else {
            setSwipeOffset(0);
        }
    };

    const handleDelete = () => {
        deleteProduct(product);
    };

    return (
        <div className="relative overflow-hidden rounded-xl mb-3">
            {/* Delete button behind - mobile only */}
            <div
                className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 flex items-center justify-center sm:hidden"
                onClick={handleDelete}
            >
                <IoTrashOutline className="w-6 h-6 text-white" />
            </div>

            {/* Main card */}
            <div
                ref={cardRef}
                className="relative bg-white border border-gray-100 rounded-xl p-4 transition-transform duration-200 ease-out"
                style={{ transform: `translateX(-${swipeOffset}px)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="flex gap-4">
                    {/* Image */}
                    <Link href={`/product/${product.id}`} className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                            <Image
                                src={product.images?.[0] || "/placeholder.jpg"}
                                width={80}
                                height={80}
                                alt={product.title}
                                className="object-contain"
                            />
                        </div>
                    </Link>

                    {/* Content */}
                    <div className="flex-grow min-w-0">
                        <Link
                            href={`/product/${product.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-orange-500 transition-colors line-clamp-2"
                        >
                            {product.title}
                        </Link>

                        <div className="mt-2 flex items-center justify-between">
                            {/* Quantity controls */}
                            <div className="flex items-center bg-gray-50 rounded-lg">
                                <button
                                    onClick={() => updateProductQuantity(product, Math.max(1, product.quantity - 1))}
                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-orange-500 transition-colors"
                                    disabled={product.quantity <= 1}
                                >
                                    <IoRemoveOutline className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center text-sm font-medium">{product.quantity}</span>
                                <button
                                    onClick={() => updateProductQuantity(product, product.quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-orange-500 transition-colors"
                                >
                                    <IoAddOutline className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                                <div className="text-sm font-semibold text-gray-900">
                                    {currencyFormat(product.price * product.quantity)}
                                </div>
                                {product.quantity > 1 && (
                                    <div className="text-xs text-gray-500">
                                        {currencyFormat(product.price)} / шт
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Desktop delete button */}
                    <button
                        onClick={handleDelete}
                        className="hidden sm:flex flex-shrink-0 w-8 h-8 items-center justify-center text-gray-400 hover:text-red-500 transition-colors self-center"
                    >
                        <IoTrashOutline className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
