'use client';

import { IoChevronForwardOutline } from 'react-icons/io5';
import { currencyFormat } from '@/lib/legacy';

interface CartSummaryProps {
    count: number;
    total: number;
    onCheckout: () => void;
}

export const CartSummary = ({ count, total, onCheckout }: CartSummaryProps) => {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Сводка заказа</h2>

            <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Товары ({count})</span>
                    <span className="text-gray-900">{currencyFormat(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Доставка</span>
                    <span className="text-orange-500">Рассчитывается</span>
                </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-4">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Итого</span>
                    <span className="text-xl font-bold text-gray-900">{currencyFormat(total)}</span>
                </div>
            </div>

            <button
                onClick={onCheckout}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
                Оформить заказ
                <IoChevronForwardOutline className="w-5 h-5" />
            </button>
        </div>
    );
};
