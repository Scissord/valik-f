'use client';

import { useState, useEffect } from 'react';
import { GoodCategory } from '@/interfaces';
import { getCategories } from '@/api';
import Link from 'next/link';
import { IoChevronForward, IoGridOutline, IoSearchOutline, IoFilterOutline } from 'react-icons/io5';
import Image from 'next/image';

export const MobileCategoriesPage = () => {
  const [categories, setCategories] = useState<GoodCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Фильтрация категорий по поисковому запросу
  const filteredCategories = searchQuery 
    ? categories.filter(category => 
        category.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories;

  const renderCategoryCard = (category: GoodCategory) => {
    const productCount = category.totalProductCount || category._count?.goods || 0;
    const hasChildren = category.children && category.children.length > 0;
    
    return (
      <Link 
        href={`/categories/${category.id}`} 
        key={category.id}
        className="block"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-orange-50 rounded-full p-3 mr-4 flex items-center justify-center">
              <IoGridOutline className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{category.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{productCount} товаров</p>
            </div>
          </div>
          {hasChildren && (
            <div className="bg-gray-50 rounded-full p-2">
              <IoChevronForward className="h-5 w-5 text-gray-400" />
            </div>
          )}
        </div>
      </Link>
    );
  };

  // Функция для рендера скелетона загрузки
  const renderSkeletons = () => {
    return Array(4).fill(0).map((_, i) => (
      <div key={i} className="animate-pulse bg-white rounded-xl p-4 flex items-center">
        <div className="bg-gray-200 rounded-full h-12 w-12 mr-4"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Заголовок и поиск */}
      <div className="bg-white px-4 pt-6 pb-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Категории</h1>
        
        {/* Поисковая строка */}
        <div className="relative mb-2">
          <input
            type="text"
            placeholder="Поиск категорий..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </div>

      {/* Популярные категории */}
      <div className="px-4 py-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Популярные категории</h2>
        <div className="grid grid-cols-2 gap-3">
          {!loading && categories.slice(0, 4).map((category, index) => (
            <Link 
              href={`/categories/${category.id}`}
              key={category.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex flex-col items-center p-3"
            >
              <div className="bg-orange-50 rounded-full p-3 mb-2">
                <IoGridOutline className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="font-medium text-sm text-center text-gray-800">{category.title}</h3>
            </Link>
          ))}
          {loading && Array(4).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-xl p-4 flex flex-col items-center">
              <div className="bg-gray-200 rounded-full h-12 w-12 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Все категории */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Все категории</h2>
          <button className="flex items-center text-sm text-gray-600">
            <IoFilterOutline className="mr-1" /> Фильтр
          </button>
        </div>
        
        {loading ? (
          <div className="space-y-3">
            {renderSkeletons()}
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="space-y-3">
            {filteredCategories.map(category => renderCategoryCard(category))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm">
            <div className="flex justify-center mb-3">
              <div className="bg-gray-100 rounded-full p-4">
                <IoSearchOutline className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <p className="text-gray-500 font-medium">Категории не найдены</p>
            <p className="text-gray-400 text-sm mt-1">Попробуйте изменить запрос</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileCategoriesPage; 