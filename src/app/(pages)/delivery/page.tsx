import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Доставка и оплата",
  description: "Условия доставки и оплаты строительных материалов на Valik.kz. Доставка по всему Казахстану.",
  alternates: { canonical: "/delivery" },
};

export default function DeliveryPage() {
  return (
    <div className="bg-gray-50 pt-24 pb-12">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-4">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Доставка и оплата
          </h1>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            Valik.kz осуществляет доставку строительных материалов по всему Казахстану. Мы
            сотрудничаем с надёжными логистическими партнёрами для обеспечения своевременной
            и безопасной доставки ваших заказов.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-900">Способы доставки</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-medium">Курьерская доставка.</span> Доставка непосредственно
              на объект или по указанному адресу. Сроки зависят от региона — от 1 до 7 рабочих дней.
            </p>
            <p>
              <span className="font-medium">Самовывоз.</span> Вы можете самостоятельно забрать заказ
              со склада поставщика. Адрес и время выдачи согласовываются при оформлении заказа.
            </p>
            <p>
              <span className="font-medium">Доставка транспортной компанией.</span> Для крупных и
              тяжёлых грузов — цемент, кирпич, металлопрокат — используется грузовая доставка.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-900">Стоимость доставки</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <p>
              Стоимость доставки рассчитывается индивидуально и зависит от веса товара, объёма,
              дальности и выбранного способа доставки. Точная стоимость указывается при оформлении
              заказа до его подтверждения.
            </p>
            <p>
              При заказе от 100 000 тенге возможна бесплатная доставка по городу. Уточняйте
              условия у менеджера.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-900">Способы оплаты</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <p>• Банковская карта (Visa, Mastercard)</p>
            <p>• Безналичный расчёт (для юридических лиц)</p>
            <p>• Наличные при получении</p>
            <p>• Перевод через Kaspi.kz</p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900">Контакты по вопросам доставки</h2>
          <div className="mt-3 space-y-1 text-sm text-gray-700">
            <p>Телефон: <a href="tel:+77758616810" className="text-orange-500 hover:underline">+7 (775) 861-68-10</a></p>
            <p>Email: <a href="mailto:valik.kazakhstan@gmail.com" className="text-orange-500 hover:underline">valik.kazakhstan@gmail.com</a></p>
            <p>WhatsApp: <a href="https://wa.me/77758616810" className="text-orange-500 hover:underline">+7 (775) 861-68-10</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
