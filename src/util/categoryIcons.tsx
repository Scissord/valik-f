import { ReactNode } from 'react';
import { 
  IoConstructOutline, 
  IoLayersOutline, 
  IoHomeOutline, 
  IoColorPaletteOutline,
  IoHammerOutline,
  IoFlashOutline,
  IoWaterOutline,
  IoLeafOutline,
  IoCarOutline,
  IoGridOutline,
  IoSettingsOutline,
  IoShieldOutline
} from "react-icons/io5";
import { 
  FaToolbox, 
  FaScrewdriver, 
  FaPaintRoller, 
  FaTruck, 
  FaHardHat,
  FaPlug,
  FaFaucet,
  FaSeedling,
  FaCar,
  FaBox,
  FaCog,
  FaShieldAlt
} from "react-icons/fa";
import { 
  GiBrickWall, 
  GiWoodBeam, 
  GiHeatHaze,
  GiElectric,
  GiWaterDrop,
  GiFlowers,
  GiCarWheel,
  GiToolbox,
  GiGears,
  GiShield
} from "react-icons/gi";
import { 
  MdWallpaper, 
  MdOutlineLayers, 
  MdOutlineDoorFront, 
  MdChair,
  MdOutlineFormatPaint, 
  MdAgriculture, 
  MdOutlineWater, 
  MdHvac,
  MdHomeRepairService, 
  MdStyle, 
  MdMicrowave, 
  MdHardware,
  MdElectricalServices, 
  MdHandyman
} from "react-icons/md";

// Функция для получения иконки категории по названию или ID
export const getCategoryIcon = (categoryName: string, categoryId?: string): ReactNode => {
  const name = categoryName.toLowerCase();
  
  // Обои
  if (name.includes('обои')) {
    return <MdWallpaper className="w-8 h-8" />;
  }
  
  // Инструменты
  if (name.includes('инструмент')) {
    return <FaToolbox className="w-8 h-8" />;
  }
  
  // Строительные материалы
  if (name.includes('материал') || name.includes('строительн') || name.includes('кирпич') || name.includes('блок')) {
    return <GiBrickWall className="w-8 h-8" />;
  }
  
  // Покрытия для пола
  if (name.includes('покрытия для пола') || name.includes('пол')) {
    return <MdOutlineLayers className="w-8 h-8" />;
  }
  
  // Кафель
  if (name.includes('кафель') || name.includes('плитк')) {
    return <MdWallpaper className="w-8 h-8" />;
  }
  
  // Двери и фурнитура
  if (name.includes('двер') || name.includes('фурнитур')) {
    return <MdOutlineDoorFront className="w-8 h-8" />;
  }
  
  // Мебель
  if (name.includes('мебель')) {
    return <MdChair className="w-8 h-8" />;
  }
  
  // Краски, лаки, клей
  if (name.includes('краск') || name.includes('лак') || name.includes('клей')) {
    return <FaPaintRoller className="w-8 h-8" />;
  }
  
  // Крепёж
  if (name.includes('крепёж') || name.includes('крепеж')) {
    return <FaScrewdriver className="w-8 h-8" />;
  }
  
  // Сантехника
  if (name.includes('сантехник')) {
    return <FaFaucet className="w-8 h-8" />;
  }
  
  // Электротовары
  if (name.includes('электр')) {
    return <FaPlug className="w-8 h-8" />;
  }
  
  // Водоснабжение, отопление и вентиляция
  if (name.includes('водоснабжен') || name.includes('отоплен') || name.includes('вентиляц')) {
    return <GiHeatHaze className="w-8 h-8" />;
  }
  
  // Оборудование
  if (name.includes('оборудован')) {
    return <MdHomeRepairService className="w-8 h-8" />;
  }
  
  // Декор
  if (name.includes('декор')) {
    return <MdStyle className="w-8 h-8" />;
  }
  
  // Бытовая техника
  if (name.includes('техник') || name.includes('быт')) {
    return <MdMicrowave className="w-8 h-8" />;
  }
  
  // Сад и огород
  if (name.includes('сад') || name.includes('огород') || name.includes('дача')) {
    return <MdAgriculture className="w-8 h-8" />;
  }
  
  // Автотовары
  if (name.includes('авто') || name.includes('машин')) {
    return <FaCar className="w-8 h-8" />;
  }
  
  // По умолчанию
  return <IoLayersOutline className="w-8 h-8" />;
};

// Функция для получения единого минималистичного фона с оранжевыми оттенками
export const getCategoryGradient = (index: number): string => {
  // Единый минималистичный дизайн с оранжевыми оттенками
  return 'from-orange-500 to-orange-600';
};