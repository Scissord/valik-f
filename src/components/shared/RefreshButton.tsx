'use client';

import { IoRefreshOutline } from "react-icons/io5";

export const RefreshButton = () => {
  return (
    <button 
      onClick={() => window.location.reload()} 
      className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
    >
      <IoRefreshOutline className="w-5 h-5" />
      Обновить страницу
    </button>
  );
}; 