import { ReactNode } from 'react';
import { 
  IoLayersOutline
} from "react-icons/io5";
import { 
  FaToolbox, 
  FaScrewdriver, 
  FaPaintRoller, 
  FaPlug,
  FaFaucet,
  FaCar
} from "react-icons/fa";
import { 
  GiBrickWall, 
  GiHeatHaze,
  GiWoodBeam
} from "react-icons/gi";
import { 
  MdWallpaper, 
  MdOutlineLayers, 
  MdOutlineDoorFront, 
  MdChair,
  MdAgriculture, 
  MdHomeRepairService, 
  MdStyle, 
  MdMicrowave
} from "react-icons/md";

// Функция для получения иконки категории по названию или ID
export const getCategoryIcon = (categoryName: string, _categoryId?: string): ReactNode => {
  const name = categoryName.toLowerCase();
  
  // Обои
  if (name.includes('обои')) {
    return <MdWallpaper className="w-6 h-6" />;
  }
  
  // Инструменты
  if (name.includes('инструмент')) {
    return <FaToolbox className="w-6 h-6" />;
  }
  
  // Отделочные материалы (проверяем первыми, так как более специфичные)
  if (name.includes('отделочн')) {
    return <GiWoodBeam className="w-6 h-6" />;
  }
  
  // Строительные материалы
  if (name.includes('строительн') || name.includes('кирпич') || name.includes('блок')) {
    return <GiBrickWall className="w-6 h-6" />;
  }
  
  // Покрытия для пола
  if (name.includes('покрытия для пола') || name.includes('пол')) {
    return <MdOutlineLayers className="w-6 h-6" />;
  }
  
  // Кафель
  if (name.includes('кафель') || name.includes('плитк')) {
    return <MdWallpaper className="w-6 h-6" />;
  }
  
  // Двери и фурнитура
  if (name.includes('двер') || name.includes('фурнитур')) {
    return <MdOutlineDoorFront className="w-6 h-6" />;
  }
  
  // Мебель
  if (name.includes('мебель')) {
    return <MdChair className="w-6 h-6" />;
  }
  
  // Краски, лаки, клей
  if (name.includes('краск') || name.includes('лак') || name.includes('клей')) {
    return <FaPaintRoller className="w-6 h-6" />;
  }
  
  // Крепёж
  if (name.includes('крепёж') || name.includes('крепеж')) {
    return <FaScrewdriver className="w-6 h-6" />;
  }
  
  // Сантехника
  if (name.includes('сантехник')) {
    return <FaFaucet className="w-6 h-6" />;
  }
  
  // Электротовары
  if (name.includes('электр')) {
    return <FaPlug className="w-6 h-6" />;
  }
  
  // Водоснабжение, отопление и вентиляция
  if (name.includes('водоснабжен') || name.includes('отоплен') || name.includes('вентиляц')) {
    return <GiHeatHaze className="w-6 h-6" />;
  }
  
  // Оборудование
  if (name.includes('оборудован')) {
    return <MdHomeRepairService className="w-6 h-6" />;
  }
  
  // Декор
  if (name.includes('декор')) {
    return <MdStyle className="w-6 h-6" />;
  }
  
  // Бытовая техника
  if (name.includes('техник') || name.includes('быт')) {
    return <MdMicrowave className="w-6 h-6" />;
  }
  
  // Сад и огород
  if (name.includes('сад') || name.includes('огород') || name.includes('дача')) {
    return <MdAgriculture className="w-6 h-6" />;
  }
  
  // Автотовары
  if (name.includes('авто') || name.includes('машин')) {
    return <FaCar className="w-6 h-6" />;
  }
  
  // По умолчанию
  return <IoLayersOutline className="w-6 h-6" />;
};

// Функция для получения единого минималистичного фона с оранжевыми оттенками
export const getCategoryGradient = (_index: number): string => {
  // Единый минималистичный дизайн с оранжевыми оттенками
  return 'from-orange-500 to-orange-600';
};