"use client";

import { getProductsForMainPage, getCategories, Product, GoodCategory } from '@/lib/legacy';
import { useEffect, useState } from "react";
import { HeroSection, ProductsSection, CategoriesSection } from "@/components";



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
          // Берем только родительские категории (без parent_id) и первые 6
          const parentCategories = categoriesResult
            .filter(category => !category.parent_id)
            .slice(0, 6);
          setCategories(parentCategories);
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
    <div className="bg-gray-50 pt-24 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <ProductsSection products={products} />
        <HeroSection />
        <CategoriesSection categories={categories} isLoadingCategories={isLoadingCategories} />
      </div>
    </div>
  );
}
