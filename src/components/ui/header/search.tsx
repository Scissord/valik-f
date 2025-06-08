import { IoSearchOutline } from "react-icons/io5";

const Search = () => {

  const css = {
    container: `
      relative flex items-center
      justify-between bg-white
      rounded-full border
      border-[#fc640c] w-[300px]
    `,
    input: `
      border-none outline-none
      text-black text-sm
      pl-4 py-2.5 w-full
    `
  }

  return (
    <div className={css.container}>
      <input
        className={css.input}
        placeholder="Найти на Valik"
        type="text"
      />
      <IoSearchOutline className="absolute right-5 w-5 h-5" />
    </div>
  )
}

export default Search