'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GoodCategory } from '@/interfaces';
import { getCategories } from '@/api';
import Link from 'next/link';
import { MobileCategoriesPage } from '@/components/mobile';
import { Breadcrumbs, BreadcrumbItem } from '@/components';
import { 
  IoConstructOutline, IoHomeOutline, IoCarOutline
} from 'react-icons/io5';
import { FaTools, FaTractor, FaPaintRoller } from 'react-icons/fa';
import { GiBrickWall, GiWoodBeam, GiHeatHaze } from 'react-icons/gi';
import { 
  MdWallpaper, MdOutlineLayers, MdOutlineDoorFront, MdChair,
  MdOutlineFormatPaint, MdAgriculture, MdOutlineWater, MdHvac,
  MdHomeRepairService, MdStyle, MdMicrowave, MdHardware,
  MdElectricalServices, MdHandyman
} from "react-icons/md";


export default function CategoriesPage() {
  const [categories, setCategories] = useState<GoodCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Функция для получения иконки в зависимости от категории
  const getCategoryIcon = (categoryTitle: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'обои': <MdWallpaper className="h-9 w-9" />,
      'сантехника': <MdOutlineWater className="h-9 w-9" />,
      'покрытия для пола': <MdOutlineLayers className="h-9 w-9" />,
      'кафель': <MdOutlineLayers className="h-9 w-9" />, // Используем ту же иконку, что и для полов
      'двери': <MdOutlineDoorFront className="h-9 w-9" />,
      'мебель': <MdChair className="h-9 w-9" />,
      'лаки, краски, клей': <MdOutlineFormatPaint className="h-9 w-9" />,
      'инструменты': <FaTools className="h-9 w-9" />,
      'для дома, сада и огорода': <MdAgriculture className="h-9 w-9" />,
      'водоснабжение, отопление и вентиляция': <MdHvac className="h-9 w-9" />,
      'оборудование': <MdHomeRepairService className="h-9 w-9" />,
      'декор': <MdStyle className="h-9 w-9" />,
      'бытовая техника': <MdMicrowave className="h-9 w-9" />,
      'крепёж': <MdHardware className="h-9 w-9" />,
      'строительные материалы': <GiBrickWall className="h-9 w-9" />,
      'электротовары': <MdElectricalServices className="h-9 w-9" />,
      'автомобильные товары': <IoCarOutline className="h-9 w-9" />,
      'ручной инструмент': <MdHandyman className="h-9 w-9" />,
      // Резервные ключи
      'отделка': <FaPaintRoller className="h-9 w-9" />,
      'дерево': <GiWoodBeam className="h-9 w-9" />,
      'отопление': <GiHeatHaze className="h-9 w-9" />,
      'сад': <MdAgriculture className="h-9 w-9" />,
      'техника': <FaTractor className="h-9 w-9" />,
      'дом': <IoHomeOutline className="h-9 w-9" />,
    };
    
    const title = categoryTitle.toLowerCase();
    // Поиск по полному совпадению или по вхождению
    for (const [keyword, icon] of Object.entries(iconMap)) {
      if (title.includes(keyword)) {
        return icon;
      }
    }
    
    return <IoConstructOutline className="h-9 w-9" />;
  };
  
  const filteredCategories = searchQuery
    ? categories.filter(category =>
        category.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories;

  const renderCategoryCard = (category: GoodCategory) => {
    const icon = getCategoryIcon(category.title);
    
    return (
      <Link 
        href={`/categories/${category.id}`} 
        key={category.id}
        className="group bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center border-2 border-transparent transition-all duration-300 hover:border-orange-500 hover:shadow-lg"
      >
        <div className="text-gray-700 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:text-orange-500">
          {icon}
        </div>
        <h3 className="font-semibold text-base text-gray-800">{category.title}</h3>
      </Link>
    );
  };

  return (
    <>
      <div className="md:hidden">
        <MobileCategoriesPage />
      </div>

      <div className="hidden md:block bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          {/* Хлебные крошки */}
          <Breadcrumbs 
            items={[{ label: "Каталог", isActive: true }]} 
            className="mb-8" 
          />
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Каталог товаров</h1>
            <p className="mt-2 text-lg text-gray-500">Все необходимое для строительства и ремонта в одном месте</p>
          </div>
          
          <div className="flex justify-center mb-10">
            <div className="relative w-full max-w-lg">
              <input 
                type="text" 
                placeholder="Найти категорию, например 'Инструменты'" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center h-40">
                  <div className="bg-gray-300 rounded-full h-12 w-12 mb-4"></div>
                  <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : filteredCategories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredCategories.map(category => renderCategoryCard(category))}
            </div>
          ) : (
            <div className="text-center py-16 col-span-full">
              <div className="mx-auto w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-gray-100">
                 <IoConstructOutline className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-xl font-medium text-gray-600">Категории не найдены</p>
              <p className="text-gray-500 mt-2">По вашему запросу "{searchQuery}" ничего не найдено.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 