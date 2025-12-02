"use client";

import { getProductsForMainPage, getCategories, Product, GoodCategory } from '@/lib/legacy';
import { useEffect, useState } from "react";
import { ProductsSection, CategoriesSection } from "@/components";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<GoodCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загружаем продукты
        const productsResult = await getProductsForMainPage({
          page: 1,
          limit: 8,
        });
        setProducts(productsResult.products || []);

        // Загружаем категории
        setIsLoadingCategories(true);
        const categoriesResult = await getCategories();

        if (categoriesResult && categoriesResult.length > 0) {
          const parentCategories = categoriesResult.filter(category => !category.parent_id);
          setCategories(parentCategories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-50 pt-15 pb-8">
      <CategoriesSection categories={categories} isLoadingCategories={isLoadingCategories} />
      <ProductsSection products={products} />
    </div>
  );
}
