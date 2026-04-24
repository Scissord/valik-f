import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Политика конфиденциальности Valik.kz. Как мы собираем, используем и защищаем ваши персональные данные.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 pt-24 pb-12">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-4">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Политика конфиденциальности
          </h1>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            Настоящая Политика конфиденциальности описывает, как ООО «1R-tech» (далее — «Valik.kz»,
            «мы», «нас») собирает, использует и защищает персональные данные пользователей
            сайта valik.kz. Используя наш сайт, вы соглашаетесь с условиями данной политики.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-900">Какие данные мы собираем</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-medium">Регистрационные данные.</span> При создании аккаунта
              мы собираем имя, номер телефона и адрес электронной почты.
            </p>
            <p>
              <span className="font-medium">Данные заказов.</span> При оформлении заказа — адрес
              доставки, контактные данные получателя, информацию о выбранных товарах.
            </p>
            <p>
              <span className="font-medium">Технические данные.</span> IP-адрес, тип браузера,
              страницы посещений и время на сайте — для улучшения работы платформы.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-900">Как мы используем данные</h2>
          <div className="mt-3 space-y-1 text-sm text-gray-700">
            <p>• Обработка и выполнение заказов</p>
            <p>• Связь с вами по вопросам заказов и поддержки</p>
            <p>• Улучшение качества сервиса</p>
            <p>• Отправка уведомлений о статусах заказов</p>
            <p>• Предотвращение мошенничества и обеспечение безопасности</p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-900">Передача данных третьим лицам</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <p>
              Мы не продаём и не передаём ваши персональные данные третьим лицам без вашего
              согласия, за исключением случаев, предусмотренных законодательством Республики
              Казахстан, а также партнёров, обеспечивающих доставку заказов.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-900">Защита данных</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <p>
              Мы применяем технические и организационные меры для защиты ваших данных от
              несанкционированного доступа, изменения, раскрытия или уничтожения.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-900">Ваши права</h2>
          <div className="mt-3 space-y-1 text-sm text-gray-700">
            <p>• Запросить доступ к своим персональным данным</p>
            <p>• Требовать исправления неточных данных</p>
            <p>• Удалить свой аккаунт и связанные данные</p>
            <p>• Отозвать согласие на обработку данных</p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900">Контакты</h2>
          <div className="mt-3 space-y-1 text-sm text-gray-700">
            <p>По вопросам обработки персональных данных обращайтесь:</p>
            <p>Email: <a href="mailto:valik.kazakhstan@gmail.com" className="text-orange-500 hover:underline">valik.kazakhstan@gmail.com</a></p>
            <p>ООО «1R-tech», Казахстан, Туркестанская область, Сайрамский район, с. Айтеке Би</p>
          </div>
        </div>
      </div>
    </div>
  );
}
