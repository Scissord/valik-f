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
const ICON_CLASS = "w-8 h-8";

export const getCategoryIcon = (categoryName: string, _categoryId?: string): ReactNode => {
  const name = categoryName.toLowerCase();
  
  // Обои
  if (name.includes('обои')) {
    return <MdWallpaper className={ICON_CLASS} />;
  }
  
  // Инструменты
  if (name.includes('инструмент')) {
    return <FaToolbox className={ICON_CLASS} />;
  }
  
  // Отделочные материалы (проверяем первыми, так как более специфичные)
  if (name.includes('отделочн')) {
    return <GiWoodBeam className={ICON_CLASS} />;
  }
  
  // Строительные материалы
  if (name.includes('строительн') || name.includes('кирпич') || name.includes('блок')) {
    return <GiBrickWall className={ICON_CLASS} />;
  }
  
  // Покрытия для пола
  if (name.includes('покрытия для пола') || name.includes('пол')) {
    return <MdOutlineLayers className={ICON_CLASS} />;
  }
  
  // Кафель
  if (name.includes('кафель') || name.includes('плитк')) {
    return <MdWallpaper className={ICON_CLASS} />;
  }
  
  // Двери и фурнитура
  if (name.includes('двер') || name.includes('фурнитур')) {
    return <MdOutlineDoorFront className={ICON_CLASS} />;
  }
  
  // Мебель
  if (name.includes('мебель')) {
    return <MdChair className={ICON_CLASS} />;
  }
  
  // Краски, лаки, клей
  if (name.includes('краск') || name.includes('лак') || name.includes('клей')) {
    return <FaPaintRoller className={ICON_CLASS} />;
  }
  
  // Крепёж
  if (name.includes('крепёж') || name.includes('крепеж')) {
    return <FaScrewdriver className={ICON_CLASS} />;
  }
  
  // Сантехника
  if (name.includes('сантехник')) {
    return <FaFaucet className={ICON_CLASS} />;
  }
  
  // Электротовары
  if (name.includes('электр')) {
    return <FaPlug className={ICON_CLASS} />;
  }
  
  // Водоснабжение, отопление и вентиляция
  if (name.includes('водоснабжен') || name.includes('отоплен') || name.includes('вентиляц')) {
    return <GiHeatHaze className={ICON_CLASS} />;
  }
  
  // Оборудование
  if (name.includes('оборудован')) {
    return <MdHomeRepairService className={ICON_CLASS} />;
  }
  
  // Декор
  if (name.includes('декор')) {
    return <MdStyle className={ICON_CLASS} />;
  }
  
  // Бытовая техника
  if (name.includes('техник') || name.includes('быт')) {
    return <MdMicrowave className={ICON_CLASS} />;
  }
  
  // Сад и огород
  if (name.includes('сад') || name.includes('огород') || name.includes('дача')) {
    return <MdAgriculture className={ICON_CLASS} />;
  }
  
  // Автотовары
  if (name.includes('авто') || name.includes('машин')) {
    return <FaCar className={ICON_CLASS} />;
  }
  
  // По умолчанию
  return <IoLayersOutline className={ICON_CLASS} />;
};

// Функция для получения единого минималистичного фона с оранжевыми оттенками
export const getCategoryGradient = (_index: number): string => {
  // Единый минималистичный дизайн с оранжевыми оттенками
  return 'from-orange-500 to-orange-600';
};
