"use client";

import { getProductsForMainPage, getCategories } from '@/api';
import { useEffect, useState } from "react";
import { Product, GoodCategory } from "@/interfaces";
import { HeroSection, ProductsSection, AdvantagesSection, CategoriesSection } from "@/components/landing";



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
    <>
      <ProductsSection products={products} />
      <div className="bg-white">
        <HeroSection />
        <AdvantagesSection />
        <CategoriesSection categories={categories} isLoadingCategories={isLoadingCategories} />
      </div>
    </>
  );
}
