import Link from "next/link";
import { FaInstagram, FaTiktok } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io5";
import Image from "next/image";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const infoLinks = [
    { href: "/about", label: "О сервисе" },
    { href: "/contacts", label: "Контакты" },
    { href: "/delivery", label: "Доставка и оплата" },
    { href: "/warranty", label: "Гарантия и возврат" },
    { href: "/wholesale", label: "Оптовые поставки" },
    { href: "/privacy", label: "Политика конфиденциальности" },
  ];

  return (
    <footer className="hidden md:block bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Логотип и описание */}
          <div>
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
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              Доставка по всему Казахстану. Качественные материалы и инструменты для строительства и ремонта.
            </p>

            {/* Социальные сети */}
            <div className="mt-4 flex space-x-4">
              <a
                href="https://www.instagram.com/valik_kazakhstan?igsh=MXh1cHp3NDg2eTNzcw=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
                aria-label="Instagram"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
              <a
                href="https://www.tiktok.com/@valik.kz?_t=ZM-8yLfIXHnYfe&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
                aria-label="TikTok"
              >
                <FaTiktok className="h-6 w-6" />
              </a>
              <a
                href="https://wa.me/77758616810"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
                aria-label="WhatsApp"
              >
                <IoLogoWhatsapp className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Информация */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase flex items-center gap-2">
              <span className="w-6 h-0.5 bg-orange-500 rounded-full" />
              Информация
            </h3>
            <ul className="mt-4 space-y-2">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-orange-500 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase flex items-center gap-2">
              <span className="w-6 h-0.5 bg-orange-500 rounded-full" />
              Контакты
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-gray-600">
                Телефон: <a href="tel:+77758616810" className="hover:text-orange-500 transition-colors duration-200">+7 (775) 861-68-10</a>
              </li>
              <li className="text-sm text-gray-600">
                Email: <a href="mailto:valik.kazakhstan@gmail.com" className="hover:text-orange-500 transition-colors duration-200">valik.kazakhstan@gmail.com</a>
              </li>
              <li className="text-sm text-gray-600">
                Адрес: Казахстан, Туркестанская область, Сайрамский район, село Айтеке Би
              </li>
            </ul>
          </div>
        </div>

        {/* Копирайт */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-center text-gray-500">
            © {currentYear} <span className="text-orange-500 font-medium">Valik.kz</span>. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};
