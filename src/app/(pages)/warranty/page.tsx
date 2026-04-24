import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Гарантия и возврат",
  description: "Условия гарантии и возврата товаров на Valik.kz. Защита покупателей при приобретении строительных материалов.",
  alternates: { canonical: "/warranty" },
};

export default function WarrantyPage() {
  return (
    <div className="bg-gray-50 pt-24 pb-12">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-4">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Гарантия и возврат
          </h1>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            Valik.kz заботится о качестве товаров и защите прав покупателей. Мы работаем только с
            проверенными поставщиками и гарантируем соответствие товаров заявленным характеристикам.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-900">Гарантийные обязательства</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <p>
              На все строительные материалы и товары, реализуемые через платформу Valik.kz,
              распространяется гарантия производителя. Срок гарантии указывается в карточке
              каждого товара.
            </p>
            <p>
              В случае обнаружения производственного дефекта в течение гарантийного срока мы
              обязуемся заменить товар или вернуть денежные средства.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-900">Условия возврата</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-medium">Возврат в течение 14 дней.</span> Вы можете вернуть
              товар надлежащего качества в течение 14 дней с момента получения, если он не был в
              употреблении и сохранён товарный вид.
            </p>
            <p>
              <span className="font-medium">Возврат товара ненадлежащего качества.</span> Если
              товар имеет дефекты или не соответствует описанию, вы вправе потребовать возврат
              средств или замену в течение всего гарантийного срока.
            </p>
            <p>
              <span className="font-medium">Товары, не подлежащие возврату.</span> Строительные
              смеси, краски и лакокрасочные материалы, вскрытые упаковки — возврату не подлежат,
              кроме случаев производственного брака.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-900">Как оформить возврат</h2>
          <div className="mt-3 space-y-1 text-sm text-gray-700">
            <p>1. Свяжитесь с нашей службой поддержки по телефону или email.</p>
            <p>2. Опишите причину возврата и приложите фотографии товара при необходимости.</p>
            <p>3. Наш менеджер свяжется с вами и согласует дальнейшие шаги.</p>
            <p>4. После подтверждения возврата денежные средства поступят на ваш счёт в течение 5–10 рабочих дней.</p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900">Связаться с поддержкой</h2>
          <div className="mt-3 space-y-1 text-sm text-gray-700">
            <p>Телефон: <a href="tel:+77758616810" className="text-orange-500 hover:underline">+7 (775) 861-68-10</a></p>
            <p>Email: <a href="mailto:valik.kazakhstan@gmail.com" className="text-orange-500 hover:underline">valik.kazakhstan@gmail.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
