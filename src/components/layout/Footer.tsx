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
    <footer className="hidden md:block bg-[#37383E] border-t border-[#4a4b52]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Логотип и описание */}
          <div>
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
              <Image
                src="/logo.svg"
                alt="Valik.kz"
                width={120}
                height={40}
                style={{ height: 'auto', filter: 'brightness(0) invert(1)' }}
                priority
              />
            </Link>
            <p className="mt-5 text-sm text-slate-300 leading-relaxed">
              Доставка по всему Казахстану. Качественные материалы и инструменты для строительства и ремонта.
            </p>

            {/* Социальные сети */}
            <div className="mt-6 flex space-x-6">
              <a
                href="https://www.instagram.com/valik_kazakhstan?igsh=MXh1cHp3NDg2eTNzcw=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
              <a
                href="https://www.tiktok.com/@valik.kz?_t=ZM-8yLfIXHnYfe&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors duration-200"
                aria-label="TikTok"
              >
                <FaTiktok className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/77758616810"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors duration-200"
                aria-label="WhatsApp"
              >
                <IoLogoWhatsapp className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Информация */}
          <div className="lg:pl-8">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">
              Информация
            </h3>
            <ul className="space-y-3">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-orange-400 hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">
              Контакты
            </h3>
            <ul className="space-y-4">
              <li className="text-sm text-slate-300 flex flex-col gap-1">
                <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Телефон</span>
                <a href="tel:+77758616810" className="text-white font-medium hover:text-orange-400 transition-colors duration-200 inline-block">
                  +7 (775) 861-68-10
                </a>
              </li>
              <li className="text-sm text-slate-300 flex flex-col gap-1">
                <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Email</span>
                <a href="mailto:valik.kazakhstan@gmail.com" className="text-white font-medium hover:text-orange-400 transition-colors duration-200 inline-block">
                  valik.kazakhstan@gmail.com
                </a>
              </li>
              <li className="text-sm text-slate-300 flex flex-col gap-1">
                <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Адрес</span>
                <span className="leading-relaxed">
                  Казахстан, Туркестанская область, Сайрамский район, село Айтеке Би
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Копирайт */}
        <div className="mt-16 pt-8 border-t border-[#4a4b52] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            © {currentYear} <span className="text-orange-500 font-semibold">Valik.kz</span>. Все права защищены.
          </p>
          <div className="text-xs text-slate-500 flex gap-4">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Политика конфиденциальности</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Условия использования</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
