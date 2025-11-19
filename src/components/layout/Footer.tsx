import Link from "next/link";
import { FaInstagram, FaTiktok } from "react-icons/fa6";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Логотип и описание */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block">
              <Image 
                src="/logo.svg"
                alt="Valik.kz"
                width={120}
                height={40}
                style={{ height: 'auto' }}
                priority
              />
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Доставка по всему Казахстану. Качественные материалы и инструменты для строительства и ремонта.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="https://www.instagram.com/valik_kazakhstan?igsh=MXh1cHp3NDg2eTNzcw==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500">
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="https://www.tiktok.com/@valik.kz?_t=ZM-8yLfIXHnYfe&_r=1" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500">
                <FaTiktok className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Информация */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Информация
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-[#fc640c]">
                  О сервисе
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-sm text-gray-600 hover:text-[#fc640c]">
                  Контакты
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="text-sm text-gray-600 hover:text-[#fc640c]">
                  Доставка и оплата
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-sm text-gray-600 hover:text-[#fc640c]">
                  Гарантия и возврат
                </Link>
              </li>
              <li>
                <Link href="/wholesale" className="text-sm text-gray-600 hover:text-[#fc640c]">
                  Оптовые поставки
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-[#fc640c]">
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Контакты
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-gray-600">
                Телефон: <a href="tel:+77758616810" className="hover:text-[#fc640c]">+7 (775) 861-68-10</a>
              </li>
              <li className="text-sm text-gray-600">
                Email: <a href="mailto:valik.kazakhstan@gmail.com" className="hover:text-[#fc640c]">valik.kazakhstan@gmail.com</a>
              </li>
              <li className="text-sm text-gray-600">
                Адрес: Казахстан, Туркестанская область, Сайрамский район, село Айтеке Би, улица №1, дом 1078, п.и. 160806.
              </li>
            </ul>
          </div>
        </div>

        {/* Копирайт */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-center text-gray-500">
            © {new Date().getFullYear()} <span className="text-orange-500">Valik.kz</span>. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};
