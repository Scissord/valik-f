'use client';

import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useSearch } from "@/hooks/useSearch";
import { useAnimatedPlaceholder } from "@/hooks/useAnimatedPlaceholder";
import { SearchResults } from "./search/SearchResults";

interface SearchProps {
  isMobile?: boolean;
}

const Search = ({ isMobile = false }: SearchProps) => {
  const {
    searchQuery,
    setSearchQuery,
    results,
    isLoading,
    showResults,
    setShowResults,
    clearSearch
  } = useSearch();

  const [isFocused, setIsFocused] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const placeholder = useAnimatedPlaceholder({
    isActive: isFocused || !!searchQuery
  });

  // Проверка что компонент смонтирован (для Portal)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Закрытие выпадающего списка при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        if (isMobile) {
          setShowMobileSearch(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, setShowResults]);

  // Фокус на поле ввода при открытии мобильного поиска
  useEffect(() => {
    if (showMobileSearch && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showMobileSearch]);

  // Обработчик открытия/закрытия мобильного поиска
  const toggleMobileSearch = useCallback(() => {
    setShowMobileSearch(!showMobileSearch);
    if (!showMobileSearch) {
      clearSearch();
    }
  }, [showMobileSearch, clearSearch]);

  const handleResultClick = useCallback(() => {
    setShowResults(false);
    clearSearch();
    setShowMobileSearch(false);
  }, [setShowResults, clearSearch]);

  // Если это мобильная версия и поиск не открыт, показываем только иконку
  if (isMobile && !showMobileSearch) {
    return (
      <button
        onClick={toggleMobileSearch}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        aria-label="Поиск"
      >
        <IoSearchOutline className="w-5 h-5 text-gray-700" />
      </button>
    );
  }

  const containerClass = `
    relative flex items-center
    bg-white
    rounded-lg border
    ${isFocused ? 'border-[#ff8040]' : 'border-gray-300'} 
    transition-all duration-200 ease-in-out
    ${isMobile ? 'w-full' : 'w-full max-w-lg'}
    z-50
  `;

  const inputClass = `
    border-none outline-none
    text-black text-base
    px-4 py-2 w-full
    placeholder:text-gray-400
  `;

  const iconClass = `
    absolute right-4 w-5 h-5
    ${isFocused ? 'text-[#ff8040]' : 'text-gray-500'}
    transition-colors duration-300
    ${isLoading ? 'animate-spin' : ''}
  `;

  // Мобильная версия с полноэкранным поиском
  if (isMobile) {
    const mobileContent = (
      <>
        <div
          className={`
            fixed inset-0 bg-black/40 z-[100]
            transition-opacity duration-300 ease-in-out backdrop-blur-sm
            ${showMobileSearch ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          onClick={toggleMobileSearch}
        />
        <div
          className={`
            fixed top-0 left-0 right-0 bg-white p-4 z-[100]
            shadow-lg transition-transform duration-300 ease-in-out
            ${showMobileSearch ? 'translate-y-0' : '-translate-y-full'}
          `}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium text-lg text-gray-800">Поиск</div>
            <button
              onClick={toggleMobileSearch}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Закрыть поиск"
            >
              <IoCloseOutline className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          <div className={containerClass} ref={searchRef}>
            <input
              ref={inputRef}
              className={inputClass}
              placeholder={placeholder}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoFocus
            />
            <IoSearchOutline className={iconClass} />
          </div>

          {showResults && (
            <SearchResults
              results={results}
              searchQuery={searchQuery}
              isLoading={isLoading}
              isMobile={true}
              onResultClick={handleResultClick}
            />
          )}
        </div>
      </>
    );

    // Используем Portal для рендеринга вне хедера
    if (isMounted) {
      return createPortal(mobileContent, document.body);
    }
    return null;
  }

  // Десктопная версия
  return (
    <div className={containerClass} ref={searchRef}>
      <input
        ref={inputRef}
        className={inputClass}
        placeholder={placeholder}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <IoSearchOutline className={iconClass} />

      {showResults && (
        <SearchResults
          results={results}
          searchQuery={searchQuery}
          isLoading={isLoading}
          isMobile={false}
          onResultClick={handleResultClick}
        />
      )}
    </div>
  );
}

export default Search;
