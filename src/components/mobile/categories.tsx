'use client';

import React, { useState, useEffect } from 'react';
import { GoodCategory } from '@/interfaces';
import { getCategories } from '@/api';
import Link from 'next/link';
import { 
  IoConstructOutline, IoSearchOutline, IoHomeOutline, IoCarOutline
} from 'react-icons/io5';
import { FaTools, FaTractor, FaPaintRoller } from 'react-icons/fa';
import { GiBrickWall, GiWoodBeam, GiHeatHaze } from 'react-icons/gi';
import { 
  MdWallpaper, MdOutlineLayers, MdOutlineDoorFront, MdChair,
  MdOutlineFormatPaint, MdAgriculture, MdOutlineWater, MdHvac,
  MdHomeRepairService, MdStyle, MdMicrowave, MdHardware,
  MdElectricalServices, MdHandyman
} from "react-icons/md";

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

  const filteredCategories = searchQuery 
    ? categories.filter(category => 
        category.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories;

  const getCategoryIcon = (categoryTitle: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'обои': <MdWallpaper className="h-7 w-7" />,
      'сантехника': <MdOutlineWater className="h-7 w-7" />,
      'покрытия для пола': <MdOutlineLayers className="h-7 w-7" />,
      'кафель': <MdOutlineLayers className="h-7 w-7" />,
      'двери': <MdOutlineDoorFront className="h-7 w-7" />,
      'мебель': <MdChair className="h-7 w-7" />,
      'лаки, краски, клей': <MdOutlineFormatPaint className="h-7 w-7" />,
      'инструменты': <FaTools className="h-7 w-7" />,
      'для дома, сада и огорода': <MdAgriculture className="h-7 w-7" />,
      'водоснабжение, отопление и вентиляция': <MdHvac className="h-7 w-7" />,
      'оборудование': <MdHomeRepairService className="h-7 w-7" />,
      'декор': <MdStyle className="h-7 w-7" />,
      'бытовая техника': <MdMicrowave className="h-7 w-7" />,
      'крепёж': <MdHardware className="h-7 w-7" />,
      'строительные материалы': <GiBrickWall className="h-7 w-7" />,
      'электротовары': <MdElectricalServices className="h-7 w-7" />,
      'автомобильные товары': <IoCarOutline className="h-7 w-7" />,
      'ручной инструмент': <MdHandyman className="h-7 w-7" />,
      // Резервные ключи
      'отделка': <FaPaintRoller className="h-7 w-7" />,
      'дерево': <GiWoodBeam className="h-7 w-7" />,
      'отопление': <GiHeatHaze className="h-7 w-7" />,
      'сад': <MdAgriculture className="h-7 w-7" />,
      'техника': <FaTractor className="h-7 w-7" />,
      'дом': <IoHomeOutline className="h-7 w-7" />,
    };
    
    const title = categoryTitle.toLowerCase();
    for (const [keyword, icon] of Object.entries(iconMap)) {
      if (title.includes(keyword)) {
        return icon;
      }
    }
    
    return <IoConstructOutline className="h-7 w-7" />;
  };

  const renderCategoryCard = (category: GoodCategory) => {
    const icon = getCategoryIcon(category.title);
    
    return (
      <Link 
        href={`/categories/${category.id}`} 
        key={category.id}
        className="group bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center text-center border-2 border-gray-100 transition-all duration-300 hover:border-yellow-400 hover:bg-white"
      >
        <div className="text-gray-600 mb-3 transition-colors duration-300 group-hover:text-yellow-500">
          {icon}
        </div>
        <h3 className="font-semibold text-sm text-gray-800 leading-tight">{category.title}</h3>
      </Link>
    );
  };

  const renderSkeletons = () => {
    return Array(8).fill(0).map((_, i) => (
      <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-28"></div>
    ));
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="px-4 pt-6 pb-4 sticky top-0 bg-white z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Каталог</h1>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск по каталогу"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
          />
          <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </div>
      
      <div className="px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-3 gap-3">
            {renderSkeletons()}
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {filteredCategories.map(category => renderCategoryCard(category))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 rounded-full p-5">
                <IoSearchOutline className="h-10 w-10 text-gray-400" />
              </div>
            </div>
            <p className="text-lg text-gray-600 font-medium">Ничего не найдено</p>
            <p className="text-gray-500 text-sm mt-1">Попробуйте изменить ваш запрос</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileCategoriesPage; 