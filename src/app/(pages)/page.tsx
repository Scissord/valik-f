import { fetchProductsForMainPage, fetchCategories } from "@/lib/server-api";
import { CategoriesSection, ProductsSection } from "@/components";

export default async function Home() {
  // Данные загружаются на сервере — HTML приходит уже готовый!
  const [productsData, allCategories] = await Promise.all([
    fetchProductsForMainPage(1, 8),
    fetchCategories(),
  ]);

  const products = productsData.products || [];
  const categories = allCategories.filter((cat) => !cat.parent_id);

  return (
    <div className="bg-gray-50 pt-24 pb-12">
      <CategoriesSection categories={categories} isLoadingCategories={false} />
      <ProductsSection products={products} />
    </div>
  );
}
