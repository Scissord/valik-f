import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Оптовые поставки",
  description: "Оптовые поставки строительных материалов от Valik.kz. Выгодные условия для строительных компаний и подрядчиков по всему Казахстану.",
  alternates: { canonical: "/wholesale" },
};

export default function WholesalePage() {
  return (
    <div className="bg-gray-50 pt-24 pb-12">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-4">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Оптовые поставки
          </h1>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            Valik.kz предлагает выгодные условия оптовых закупок строительных материалов для
            строительных компаний, подрядчиков, ремонтных бригад и дистрибьюторов.
            Работаем с юридическими и физическими лицами по всему Казахстану.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-900">Преимущества оптовых закупок</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-medium">Специальные цены.</span> Оптовые покупатели получают
              индивидуальные скидки в зависимости от объёма и частоты заказов.
            </p>
            <p>
              <span className="font-medium">Персональный менеджер.</span> За каждым оптовым
              клиентом закрепляется личный менеджер для оперативного решения всех вопросов.
            </p>
            <p>
              <span className="font-medium">Приоритетная доставка.</span> Оптовые заказы обрабатываются
              в первую очередь и доставляются в оговорённые сроки.
            </p>
            <p>
              <span className="font-medium">Рассрочка и отсрочка платежа.</span> Для постоянных
              партнёров доступны гибкие условия оплаты по договорённости.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-900">Кому подходят оптовые поставки</h2>
          <div className="mt-3 space-y-1 text-sm text-gray-700">
            <p>• Строительные компании и генподрядчики</p>
            <p>• Девелоперы и застройщики</p>
            <p>• Ремонтные и отделочные бригады</p>
            <p>• Торговые сети и магазины стройматериалов</p>
            <p>• Архитектурные и проектные организации</p>
            <p>• Частные предприниматели в сфере строительства</p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-900">Как начать сотрудничество</h2>
          <div className="mt-3 space-y-1 text-sm text-gray-700">
            <p>1. Свяжитесь с нами по телефону или email и укажите интересующие товары и объёмы.</p>
            <p>2. Наш менеджер подготовит для вас коммерческое предложение.</p>
            <p>3. После согласования условий заключаем договор и оформляем заказ.</p>
            <p>4. Организуем доставку на объект или склад в удобное для вас время.</p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900">Связаться с отделом оптовых продаж</h2>
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
