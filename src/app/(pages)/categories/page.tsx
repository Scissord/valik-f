import { getCategories } from "@/lib/legacy";
import { CategoryTree } from "@/components";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Все категории | Valik.kz",
    description: "Полный каталог строительных материалов и инструментов Valik.kz",
};

export default async function AllCategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="min-h-screen bg-white pt-24 pb-12">
            <div className="mx-auto max-w-2xl px-4 sm:px-6">
                <div className="flex items-center gap-2 mb-6">
                    <Link
                        href="/"
                        className="p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Назад на главную"
                    >
                        <IoArrowBack className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Каталог</h1>
                </div>

                <div className="bg-white rounded-2xl">
                    {categories.length > 0 ? (
                        <CategoryTree categories={categories} />
                    ) : (
                        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
                            <p>Категории загружаются или список пуст</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
