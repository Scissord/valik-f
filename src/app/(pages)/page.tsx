import type { Metadata } from "next";
import { fetchProductsForMainPage, fetchCategories } from "@/lib/server-api";
import { CategoriesSection, ProductsSection } from "@/components";

export const metadata: Metadata = {
    title: "Каталог строительных материалов",
    description: "Каталог строительных материалов и инструментов на Valik.kz. Широкий ассортимент для ремонта и строительства с доставкой по Казахстану.",
    alternates: {
        canonical: "/",
    },
};

export default async function HomePage() {
    const [productsData, allCategories] = await Promise.all([
        fetchProductsForMainPage(1, 12),
        fetchCategories(),
    ]);

    const products = productsData.products || [];
    const categories = allCategories.filter((cat) => !cat.parent_id);

    return (
        <div className="bg-white pt-24 pb-12 relative">
            <h1 className="sr-only">Каталог строительных материалов</h1>
            <CategoriesSection categories={categories} isLoadingCategories={false} />
            <ProductsSection products={products} />
        </div>
    );
}
