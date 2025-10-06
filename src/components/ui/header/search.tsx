import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

interface SearchResult {
  id: string;
  title: string;
  type: string;
  price?: number;
  slug?: string;
}

interface SearchProps {
  isMobile?: boolean;
}

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Компонент поиска с функцией debounce
 */
const Search = ({ isMobile = false }: SearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [_indexCreated, setIndexCreated] = useState(false);
  const [_indexError, setIndexError] = useState<string | null>(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [placeholder, setPlaceholder] = useState("Найти на Valik.kz");
  const inputRef = useRef<HTMLInputElement>(null);
  const animationState = useRef<{
    timeoutId?: NodeJS.Timeout;
    materialIndex: number;
    charIndex: number;
    isDeleting: boolean;
  }>({
    materialIndex: 0,
    charIndex: 0,
    isDeleting: false,
  });

  // Примеры строительных материалов для автоввода
  const exampleMaterials = [
    "Цемент",
    "Штукатурка",
    "Гипсокартон",
    "Керамическая плитка",
    "Ламинат",
    "Краска фасадная",
    "Утеплитель"
  ];

  // Функция для эффекта автоматического ввода текста
  useEffect(() => {
    const state = animationState.current;

    const type = () => {
      const currentMaterial = exampleMaterials[state.materialIndex];
      let newPlaceholder = '';
      let timeout = 150;

      if (state.isDeleting) {
        newPlaceholder = currentMaterial.substring(0, state.charIndex - 1);
        state.charIndex--;
        timeout = 50;
      } else {
        newPlaceholder = currentMaterial.substring(0, state.charIndex + 1);
        state.charIndex++;
      }

      setPlaceholder(newPlaceholder);

      if (!state.isDeleting && state.charIndex === currentMaterial.length) {
        state.isDeleting = true;
        timeout = 1500;
      } else if (state.isDeleting && state.charIndex === 0) {
        state.isDeleting = false;
        state.materialIndex = (state.materialIndex + 1) % exampleMaterials.length;
        timeout = 500;
      }

      state.timeoutId = setTimeout(type, timeout);
    };

    if (isFocused || searchQuery) {
      if (state.timeoutId) clearTimeout(state.timeoutId);
      setPlaceholder('Найти на Valik.kz');
    } else {
      state.timeoutId = setTimeout(type, 1000);
    }

    return () => {
      if (state.timeoutId) clearTimeout(state.timeoutId);
    };
  }, [isFocused, searchQuery, exampleMaterials]);

  // Функция debounce для задержки запросов
  const debounce = useCallback((callback: (value: string) => void, delay: number) => {
    let timeout: NodeJS.Timeout;

    return (value: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => callback(value), delay);
    };
  }, []);

  // Выполнение поискового запроса
  const performSearch = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      console.log(`[SEARCH] Отправка запроса на поиск: ${query}`);
      const response = await fetch(`${baseURL}/search?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        console.error(`[SEARCH] Ошибка при выполнении поиска: ${response.status}`);
        throw new Error(`Ошибка поиска: ${response.status}`);
      }

      const data = await response.json();
      console.log("[SEARCH] Успешный ответ от API. Структура результатов:", data);

      // Обработка и преобразование результатов
      const processedResults: SearchResult[] = [];

      if (data.products && Array.isArray(data.products)) {
        console.log(`[SEARCH] Найдено продуктов: ${data.products.length}`);
        data.products.forEach((product: any) => {
          processedResults.push({
            id: product.id,
            title: product.title,
            type: 'product',
            price: product.price,
            slug: product.id
          });
        });
      }

      if (data.categories && Array.isArray(data.categories)) {
        console.log(`[SEARCH] Найдено категорий: ${data.categories.length}`);
        data.categories.forEach((category: any) => {
          processedResults.push({
            id: category.id,
            title: category.title,
            type: 'category',
            slug: category.id
          });
        });
      }

      if (data.brands && Array.isArray(data.brands)) {
        console.log(`[SEARCH] Найдено брендов: ${data.brands.length}`);
        data.brands.forEach((brand: any) => {
          processedResults.push({
            id: brand.id,
            title: brand.title,
            type: 'brand',
            slug: brand.id
          });
        });
      }

      console.log(`[SEARCH] Всего обработано результатов: ${processedResults.length}`);
      setResults(processedResults);
    } catch (error) {
      console.error("[SEARCH] Ошибка при поиске:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [setResults, setIsLoading]);

  // Обработчик изменения поискового запроса с debounce
  const handleSearchChange = useCallback(
    debounce((value: string) => {
      performSearch(value);
    }, 500),
    [performSearch]
  );

  // Отслеживаем изменения в поисковом запросе
  useEffect(() => {
    handleSearchChange(searchQuery);
    setShowResults(searchQuery.length >= 2);
  }, [searchQuery, handleSearchChange, setShowResults]);

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
  }, [isMobile, setShowResults, setShowMobileSearch]);

  // Фокус на поле ввода при открытии мобильного поиска
  useEffect(() => {
    if (showMobileSearch && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showMobileSearch]);

  // Инициализация индексов Elasticsearch при первом запуске
  useEffect(() => {
    const _initSearchIndex = async () => {
      try {
        console.log("[INDEX] Начало создания поисковых индексов в Elasticsearch...");
        console.time("[INDEX] Время создания индексов");

        // Запрос на создание индексов
        const response = await fetch("http://localhost:8080/search/create_index");

        console.log(`[INDEX] Статус запроса: ${response.status} ${response.statusText}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[INDEX] Ошибка при создании индексов: ${response.status}`, errorText);
          setIndexError(`Ошибка ${response.status}: ${errorText}`);
          return;
        }

        const result = await response.text();
        console.log(`[INDEX] Результат создания индексов: ${result}`);
        console.timeEnd("[INDEX] Время создания индексов");

        setIndexCreated(true);
        console.log("[INDEX] Индексы успешно созданы и готовы к использованию");
      } catch (error) {
        console.error("[INDEX] Критическая ошибка при создании индексов:", error);
        setIndexError(error instanceof Error ? error.message : String(error));
      }
    };

    // Вызываем функцию создания индексов
    // _initSearchIndex(); // <--- ЭТОТ КОД ВЫЗЫВАЕТ ПРОБЛЕМУ
  }, [setIndexCreated, setIndexError]);

  // Обработчик открытия/закрытия мобильного поиска
  const toggleMobileSearch = useCallback(() => {
    setShowMobileSearch(!showMobileSearch);
    if (!showMobileSearch) {
      setSearchQuery('');
      setResults([]);
    }
  }, [showMobileSearch, setShowMobileSearch, setSearchQuery, setResults]);

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

  const css = {
    mobileOverlay: `
      fixed inset-0 bg-black/30 z-50
      transition-opacity duration-300 ease-in-out backdrop-blur-sm
      ${showMobileSearch ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `,
    mobileContainer: `
      fixed top-0 left-0 right-0 bg-white p-4 z-50
      shadow-lg transition-transform duration-300 ease-in-out
      ${showMobileSearch ? 'translate-y-0' : '-translate-y-full'}
    `,
    mobileSearchHeader: `
      flex items-center justify-between mb-2
    `,
    mobileSearchTitle: `
      font-medium text-lg text-gray-800
    `,
    closeButton: `
      p-2 rounded-full hover:bg-gray-100 transition-colors duration-200
    `,
    container: `
      relative flex items-center
      justify-between bg-white
      rounded-full border
      ${isFocused ? 'border-[#ff8040] shadow-md' : 'border-[#fc640c]'} 
      transition-all duration-300 ease-in-out
      ${isMobile ? 'w-full' : isFocused ? 'w-[320px]' : 'w-[300px]'}
      z-50
    `,
    input: `
      border-none outline-none
      text-black text-base
      pl-4 py-2 w-full
      placeholder:text-gray-400
    `,
    icon: `
      absolute right-4 w-5 h-5
      ${isFocused ? 'text-[#ff8040]' : 'text-gray-500'}
      transition-colors duration-300
      ${isLoading ? 'animate-spin' : ''}
    `,
    resultsContainer: `
      ${isMobile
        ? 'fixed left-4 right-4 top-[72px] bg-white mt-2 py-2 rounded-lg shadow-lg max-h-[60vh] overflow-y-auto border border-gray-200 z-50'
        : 'absolute top-full left-0 right-0 bg-white mt-2 py-2 rounded-lg shadow-lg max-h-[400px] overflow-y-auto border border-gray-200 z-50'
      }
    `,
    resultItem: `
      px-4 py-2 hover:bg-gray-50
      cursor-pointer text-sm
    `,
    resultItemProduct: `
      border-l-4 border-blue-500
    `,
    resultItemCategory: `
      border-l-4 border-green-500
    `,
    resultItemBrand: `
      border-l-4 border-orange-500
    `,
    resultTitle: `
      font-medium text-gray-800
    `,
    resultType: `
      text-xs text-gray-500 mt-1
    `,
    noResults: `
      px-4 py-3 text-sm text-gray-500
      text-center italic
    `
  }

  // Мобильная версия с полноэкранным поиском
  if (isMobile) {
    return (
      <>
        <div className={css.mobileOverlay} onClick={toggleMobileSearch}></div>
        <div className={css.mobileContainer}>
          <div className={css.mobileSearchHeader}>
            <div className={css.mobileSearchTitle}>Поиск</div>
            <button
              onClick={toggleMobileSearch}
              className={css.closeButton}
              aria-label="Закрыть поиск"
            >
              <IoCloseOutline className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          <div className={css.container} ref={searchRef}>
            <input
              ref={inputRef}
              className={css.input}
              placeholder={placeholder}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoFocus
            />
            <IoSearchOutline className={css.icon} />
          </div>

          {showResults && (
            <div className={css.resultsContainer}>
              {results.length > 0 ? (
                results.map((result) => (
                  <Link
                    href={
                      result.type === 'product'
                        ? `/product/${result.slug}`
                        : result.type === 'category'
                          ? `/categories/${result.slug}`
                          : `/brands/${result.slug}`
                    }
                    key={`${result.type}-${result.id}`}
                    onClick={() => {
                      setShowResults(false);
                      setSearchQuery("");
                      setShowMobileSearch(false);
                    }}
                  >
                    <div
                      className={`${css.resultItem} ${result.type === 'product'
                        ? css.resultItemProduct
                        : result.type === 'category'
                          ? css.resultItemCategory
                          : css.resultItemBrand
                        }`}
                    >
                      <div className={css.resultTitle}>{result.title}</div>
                      <div className={css.resultType}>
                        {result.type === 'product'
                          ? `Товар ${result.price ? `• ${result.price.toLocaleString('ru-RU')} ₸` : ''}`
                          : result.type === 'category'
                            ? 'Категория'
                            : 'Бренд'
                        }
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                searchQuery.length >= 2 && !isLoading ? (
                  <div className={css.noResults}>Ничего не найдено</div>
                ) : (
                  <div className={css.noResults}>Введите запрос для поиска</div>
                )
              )}
            </div>
          )}
        </div>
      </>
    );
  }

  // Десктопная версия
  return (
    <div className={css.container} ref={searchRef}>
      <input
        ref={inputRef}
        className={css.input}
        placeholder={placeholder}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <IoSearchOutline className={css.icon} />

      {showResults && (
        <div className={css.resultsContainer}>
          {results.length > 0 ? (
            results.map((result) => (
              <Link
                href={
                  result.type === 'product'
                    ? `/product/${result.slug}`
                    : result.type === 'category'
                      ? `/categories/${result.slug}`
                      : `/brands/${result.slug}`
                }
                key={`${result.type}-${result.id}`}
                onClick={() => {
                  setShowResults(false);
                  setSearchQuery("");
                }}
              >
                <div
                  className={`${css.resultItem} ${result.type === 'product'
                    ? css.resultItemProduct
                    : result.type === 'category'
                      ? css.resultItemCategory
                      : css.resultItemBrand
                    }`}
                >
                  <div className={css.resultTitle}>{result.title}</div>
                  <div className={css.resultType}>
                    {result.type === 'product'
                      ? `Товар ${result.price ? `• ${result.price.toLocaleString('ru-RU')} ₸` : ''}`
                      : result.type === 'category'
                        ? 'Категория'
                        : 'Бренд'
                    }
                  </div>
                </div>
              </Link>
            ))
          ) : (
            searchQuery.length >= 2 && !isLoading ? (
              <div className={css.noResults}>Ничего не найдено</div>
            ) : (
              <div className={css.noResults}>Введите запрос для поиска</div>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default Search