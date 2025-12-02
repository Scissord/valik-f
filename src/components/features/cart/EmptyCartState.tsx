import { IoCartOutline } from "react-icons/io5";

export const EmptyCartState = () => {
  return (
    <div className="bg-white min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-start text-center min-h-[55vh] translate-y-[40%]">
          <div className="mb-6 sm:mb-8">
            <IoCartOutline className="w-12 h-12 sm:w-16 sm:h-16 text-orange-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 sm:mb-4">
            Ваша корзина пуста
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8 max-w-md text-sm sm:text-base">
            Добавьте понравившиеся товары, чтобы увидеть их здесь и оформить заказ в несколько кликов.
          </p>
        </div>
      </div>
    </div>
  );
};
