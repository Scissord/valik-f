import { ProductInCart, Title } from "@/components";
import { OrderSummary } from "@/store/cart/orderSummary";
import Link from "next/link";

export default function CartPage() {
  //redirect("/empty")
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={"Корзина"} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <span className="text-xl">
              Добавить больше элементов
            </span>
            <Link href={"/"} className="underline mb-5">
              Продолжить покупки
            </Link>
            {/* items */}
            <ProductInCart />
          </div>

          <OrderSummary/>
        </div>
      </div>
    </div>
  );
}
