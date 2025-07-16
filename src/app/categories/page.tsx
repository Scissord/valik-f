'use client';

import { useState, useEffect } from 'react';
import { GoodCategory } from '@/interfaces';
import { getCategories } from '@/api';
import Link from 'next/link';
import { IoChevronForward, IoGridOutline } from 'react-icons/io5';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<GoodCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const renderCategoryCard = (category: GoodCategory) => {
    const productCount = category.totalProductCount || category._count?.goods || 0;
    const hasChildren = category.children && category.children.length > 0;
    
    return (
      <Link 
        href={`/categories/${category.id}`} 
        key={category.id}
        className="block"
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-orange-50 rounded-full p-3 mr-4">
              <IoGridOutline className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{category.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{productCount} товаров</p>
            </div>
          </div>
          {hasChildren && (
            <IoChevronForward className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Категории</h1>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg p-4 flex items-center">
              <div className="bg-gray-200 rounded-full h-12 w-12 mr-4"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="space-y-2">
          {categories.map(category => renderCategoryCard(category))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">Категории не найдены</p>
        </div>
      )}
    </div>
  );
} 