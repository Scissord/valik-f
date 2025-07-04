import { titleFont } from "@/config/fonts";
import Link from "next/link";
import { FaInstagram, FaFacebook, FaTwitter, FaTelegram } from "react-icons/fa";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Логотип и описание */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block">
              <Image 
                src="/logo.svg"
                alt="Valik.kz"
                width={120}
                height={40}
                priority
              />
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Доставка по всему Казахстану. Качественные материалы и инструменты для строительства и ремонта.
            </p>
            {/* Социальные сети убраны по запросу */}
          </div>

          {/* Категории */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Категории
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/categories/tools" className="text-sm text-gray-600 hover:text-[#fc640c]">
                  Инструменты
                </Link>
              </li>
              <li>
                <Link href="/categories/materials" className="text-sm text-gray-600 hover:text-[#fc640c]">
                  Строительные материалы
                </Link>
              </li>
              <li>
                <Link href="/categories/fasteners" className="text-sm text-gray-600 hover:text-[#fc640c]">
                  Крепёж и метизы
                </Link>
              </li>
              <li>
                <Link href="/categories/plumbing" className="text-sm text-gray-600 hover:text-[#fc640c]">
                  Сантехника
                </Link>
              </li>
              <li>
                <Link href="/categories/finishing" className="text-sm text-gray-600 hover:text-[#fc640c]">
                  Отделочные материалы
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-gray-600 hover:text-[#fc640c]">
                  Все категории
                </Link>
              </li>
            </ul>
          </div>

          {/* Информация */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Информация
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-[#fc640c]">
                  О компании
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
                Телефон: <a href="tel:+77777777777" className="hover:text-[#fc640c]">+7 (777) 777-77-77</a>
              </li>
              <li className="text-sm text-gray-600">
                Email: <a href="mailto:info@valik.kz" className="hover:text-[#fc640c]">info@valik.kz</a>
              </li>
              <li className="text-sm text-gray-600">
                Адрес: Астана, Казахстан
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
