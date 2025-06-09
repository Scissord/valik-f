import { IoSearchOutline } from "react-icons/io5";
import { useState, useEffect, useCallback } from "react";

/**
 * Компонент поиска с функцией debounce
 */
const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Функция debounce для задержки запросов
  const debounce = useCallback((callback: Function, delay: number) => {
    let timeout: NodeJS.Timeout;
    
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => callback(...args), delay);
    };
  }, []);

  // Обработчик изменения поискового запроса с debounce
  const handleSearchChange = useCallback(
    debounce((value: string) => {
      setDebouncedQuery(value);
      // Здесь можно отправить запрос на сервер
      console.log("Отправка запроса:", value);
    }, 500),
    []
  );

  // Отслеживаем изменения в поисковом запросе
  useEffect(() => {
    handleSearchChange(searchQuery);
  }, [searchQuery, handleSearchChange]);

  const css = {
    container: `
      relative flex items-center
      justify-between bg-white
      rounded-full border
      ${isFocused ? 'border-[#ff8040] shadow-md' : 'border-[#fc640c]'} 
      w-[300px] transition-all duration-300 ease-in-out
      ${isFocused ? 'w-[320px]' : 'w-[300px]'}
    `,
    input: `
      border-none outline-none
      text-black text-sm
      pl-4 py-3 w-full
      placeholder:text-gray-400
    `,
    icon: `
      absolute right-5 w-5 h-5
      ${isFocused ? 'text-[#ff8040]' : 'text-gray-500'}
      transition-colors duration-300
    `
  }

  return (
    <div className={css.container}>
      <input
        className={css.input}
        placeholder="Найти на Valik"
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <IoSearchOutline className={css.icon} />
    </div>
  )
}

export default Search