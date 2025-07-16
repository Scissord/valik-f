// 'use client';

// import { useState, useEffect } from "react";
// import { GoodCategory } from "@/interfaces";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { IoChevronDownOutline, IoGridOutline, IoCartOutline } from "react-icons/io5";

// interface Props {
//   product_categories: GoodCategory[];
//   className?: string;
// }

// export const ProductBreadcrumbs = ({
//   className,
//   product_categories
// }: Props) => {
//   const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
//   const pathname = usePathname();
  
//   // Функция для получения ID категории из URL
//   const getCurrentCategoryId = (): number | null => {
//     const match = pathname.match(/\/categories\/(\d+)/);
//     return match ? parseInt(match[1]) : null;
//   };
  
//   // Функция для поиска родительских категорий
//   const findParentCategories = (
//     categories: GoodCategory[], 
//     targetId: number, 
//     path: number[] = []
//   ): number[] | null => {
//     for (const category of categories) {
//       if (category.id === targetId) {
//         return [...path, category.id];
//       }
      
//       if (category.children && category.children.length > 0) {
//         const result = findParentCategories(
//           category.children, 
//           targetId, 
//           [...path, category.id]
//         );
//         if (result) return result;
//       }
//     }
    
//     return null;
//   };
  
//   // При монтировании и изменении URL автоматически раскрываем текущую категорию
//   useEffect(() => {
//     const currentCategoryId = getCurrentCategoryId();
//     if (currentCategoryId) {
//       const path = findParentCategories(product_categories, currentCategoryId);
//       if (path) {
//         setExpandedCategories(path);
//       }
//     }
//   }, [pathname, product_categories]);

//   const toggleCategory = (categoryId: number) => {
//     if (expandedCategories.includes(categoryId)) {
//       setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
//     } else {
//       setExpandedCategories([...expandedCategories, categoryId]);
//     }
//   };

//   const renderCategory = (category: GoodCategory, level: number = 0) => {
//     const isExpanded = expandedCategories.includes(category.id);
//     const hasChildren = category.children && category.children.length > 0;
//     const productCount = category.totalProductCount || category._count?.goods || 0;
//     const currentCategoryId = getCurrentCategoryId();
//     const isActive = currentCategoryId === category.id;
    
//     return (
//       <div key={category.id} className="w-full">
//         <div 
//           className={`
//             group relative flex items-center justify-between py-3 px-4
//             ${level > 0 ? 'pl-' + (level * 6 + 4) : ''}
//             ${isActive ? 'bg-orange-50 text-orange-600 font-medium' : 'hover:bg-gray-50'}
//             border-b border-gray-100 cursor-pointer transition-all duration-200
//           `}
//           onClick={() => hasChildren && toggleCategory(category.id)}
//         >
//           <Link 
//             href={`/categories/${category.id}`}
//             className="flex-grow flex items-center gap-2"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {level === 0 && (
//               <div className={`
//                 flex items-center justify-center w-8 h-8 rounded-lg
//                 ${isActive ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}
//                 transition-colors
//               `}>
//                 <IoCartOutline size={18} />
//               </div>
//             )}
            
//             <div className="flex flex-col">
//               <span className={`text-sm ${isActive ? 'text-orange-600' : 'text-gray-700'}`}>
//                 {category.name}
//               </span>
//               {level === 0 && (
//                 <span className="text-xs text-gray-400 mt-0.5">
//                   {productCount} товаров
//                 </span>
//               )}
//             </div>
//           </Link>
          
//           {hasChildren && (
//             <div 
//               className={`
//                 flex items-center justify-center w-6 h-6 rounded-full
//                 ${isActive ? 'bg-orange-100 text-orange-500' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}
//                 transition-transform ${isExpanded ? 'rotate-180' : ''}
//               `}
//             >
//               <IoChevronDownOutline size={14} />
//             </div>
//           )}
//         </div>
        
//         {isExpanded && hasChildren && (
//           <div className="animate-slideDown">
//             {category.children?.map(child => renderCategory(child, level + 1))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className={className}>
//       <div className="w-full md:w-[320px] lg:w-[350px] bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
//         <div className="bg-gray-50 py-4 px-4 border-b border-gray-100">
//           <div className="flex items-center gap-2">
//             <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-orange-600">
//               <IoGridOutline size={18} />
//             </div>
//             <h3 className="font-medium text-gray-800">Категории</h3>
//           </div>
//         </div>
//         <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
//           {product_categories.map(category => renderCategory(category))}
//         </div>
//       </div>
//     </div>
//   );
// };
