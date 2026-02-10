import { fetchProductsForMainPage, fetchCategories } from "@/lib/server-api";
import { CategoriesSection, ProductsSection } from "@/components";
import { ChatBotFab } from "@/components/layout/ChatBotFab";

export default async function MarketPage() {
    // Данные загружаются на сервере — HTML приходит уже готовый!
    const [productsData, allCategories] = await Promise.all([
        fetchProductsForMainPage(1, 50),
        fetchCategories(),
    ]);

    const products = productsData.products || [];
    const categories = allCategories.filter((cat) => !cat.parent_id);

    return (
        <div className="bg-white pt-24 pb-12 relative">
            <CategoriesSection categories={categories} isLoadingCategories={false} />
            <ProductsSection products={products} />
            <ChatBotFab />
        </div>
    );
}
