import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Условия использования",
  description: "Условия использования платформы Valik.kz. Права и обязанности пользователей маркетплейса строительных материалов.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="bg-gray-50 pt-24 pb-12">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-4">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Условия использования
          </h1>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            Настоящие Условия использования регулируют правоотношения между ООО «1R-tech»
            (Valik.kz) и пользователями платформы valik.kz. Используя сайт, вы подтверждаете
            своё согласие с данными условиями.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-900">Общие положения</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <p>
              Valik.kz — маркетплейс строительных материалов и услуг, работающий на территории
              Республики Казахстан. Платформа предоставляет пользователям возможность искать,
              сравнивать и заказывать товары от проверенных поставщиков.
            </p>
            <p>
              Администрация оставляет за собой право изменять данные условия с уведомлением
              пользователей через сайт.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-900">Регистрация и аккаунт</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <p>
              Для полноценного использования платформы необходима регистрация. Пользователь
              обязан предоставлять достоверные данные и нести ответственность за безопасность
              своего аккаунта.
            </p>
            <p>
              Передача учётных данных третьим лицам запрещена. При обнаружении несанкционированного
              доступа необходимо немедленно уведомить администрацию.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-900">Правила использования платформы</h2>
          <div className="mt-3 space-y-1 text-sm text-gray-700">
            <p>Пользователям запрещается:</p>
            <p>• Публиковать недостоверную информацию о товарах или услугах</p>
            <p>• Использовать платформу для мошеннических действий</p>
            <p>• Нарушать права других пользователей и поставщиков</p>
            <p>• Копировать контент платформы без разрешения администрации</p>
            <p>• Использовать автоматические инструменты для сбора данных с сайта</p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-900">Ответственность сторон</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <p>
              Valik.kz является посредником между покупателями и поставщиками. Качество товаров
              и соответствие их описанию — ответственность поставщиков. Мы прилагаем все усилия
              для верификации поставщиков и контроля качества.
            </p>
            <p>
              Платформа не несёт ответственности за задержки доставки, вызванные действиями
              третьих лиц или форс-мажорными обстоятельствами.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-900">Интеллектуальная собственность</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <p>
              Все материалы сайта (тексты, изображения, логотипы, дизайн) являются
              собственностью ООО «1R-tech» и защищены законодательством об интеллектуальной
              собственности Республики Казахстан.
            </p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900">Применимое право</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <p>
              Настоящие условия регулируются законодательством Республики Казахстан. Все споры
              разрешаются в соответствии с действующим законодательством РК.
            </p>
            <p>
              По всем вопросам: <a href="mailto:valik.kazakhstan@gmail.com" className="text-orange-500 hover:underline">valik.kazakhstan@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
