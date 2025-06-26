import { ProductGrid } from "@/components";
import { getProductsForMainPage } from '@/api';
import Link from "next/link";
import Image from "next/image";
import { IoHammerOutline, IoArrowForwardOutline, IoConstructOutline, IoLayersOutline, IoHomeOutline, IoColorPaletteOutline } from "react-icons/io5";
import { FaToolbox, FaScrewdriver, FaPaintRoller } from "react-icons/fa";

export default async function Home() {
  const { products } = await getProductsForMainPage({
    page: 1,
    limit: 8,
  });

  // Определяем основные категории для строительного магазина
  const categories = [
    {
      id: 1,
      name: "Инструменты",
      icon: <FaToolbox className="w-8 h-8" />,
      description: "Электро- и ручные инструменты для любых задач",
      image: "/categories/tools.jpg",
      slug: "tools"
    },
    {
      id: 2,
      name: "Материалы",
      icon: <IoLayersOutline className="w-8 h-8" />,
      description: "Строительные и отделочные материалы",
      image: "/categories/materials.jpg",
      slug: "materials"
    },
    {
      id: 3,
      name: "Крепёж",
      icon: <FaScrewdriver className="w-8 h-8" />,
      description: "Винты, гайки, анкеры и другие крепёжные изделия",
      image: "/categories/fasteners.jpg",
      slug: "fasteners"
    },
    {
      id: 4,
      name: "Сантехника",
      icon: <IoConstructOutline className="w-8 h-8" />,
      description: "Всё для водопровода и канализации",
      image: "/categories/plumbing.jpg",
      slug: "plumbing"
    },
    {
      id: 5,
      name: "Отделка",
      icon: <FaPaintRoller className="w-8 h-8" />,
      description: "Краски, декор и отделочные материалы",
      image: "/categories/finishing.jpg",
      slug: "finishing"
    },
    {
      id: 6,
      name: "Освещение",
      icon: <IoHomeOutline className="w-8 h-8" />,
      description: "Светильники и электрооборудование",
      image: "/categories/lighting.jpg",
      slug: "lighting"
    }
  ];

  return (
    <div>
      {/* Hero секция */}
      <section className="relative bg-gray-900 text-white rounded-3xl overflow-hidden mb-12 shadow-xl">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Всё для строительства и ремонта
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              <span className="text-orange-500">Valik.kz</span> - качественные строительные материалы и профессиональные инструменты с доставкой
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/categories" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                Каталог товаров
                <IoArrowForwardOutline className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Секция преимуществ */}
      <section className="py-16 mb-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Блок 1 */}
        <div className="relative overflow-hidden bg-white border border-gray-100 rounded-3xl shadow-sm">
          <div className="p-12 flex flex-col items-center text-center relative z-10 h-full">
            <div className="bg-orange-100 text-orange-600 p-4 rounded-xl mb-6 inline-flex">
              <IoLayersOutline className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-2xl mb-4 text-gray-900">Строительные материалы</h3>
            <p className="text-gray-600 text-lg">Широкий выбор качественных материалов от ведущих производителей для любых строительных проектов</p>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-50 rounded-full opacity-30"></div>
          </div>
        </div>
        
        {/* Блок 2 */}
        <div className="relative overflow-hidden bg-white border border-gray-100 rounded-3xl shadow-sm">
          <div className="p-12 flex flex-col items-center text-center relative z-10 h-full">
            <div className="bg-orange-100 text-orange-600 p-4 rounded-xl mb-6 inline-flex">
              <IoColorPaletteOutline className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-2xl mb-4 text-gray-900">Лучшие цены</h3>
            <p className="text-gray-600 text-lg">Доступные цены и индивидуальные условия для розничных покупателей и оптовых клиентов</p>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-50 rounded-full opacity-30"></div>
          </div>
        </div>
        
        {/* Блок 3 */}
        <div className="relative overflow-hidden bg-white border border-gray-100 rounded-3xl shadow-sm">
          <div className="p-12 flex flex-col items-center text-center relative z-10 h-full">
            <div className="bg-orange-100 text-orange-600 p-4 rounded-xl mb-6 inline-flex">
              <IoHammerOutline className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-2xl mb-4 text-gray-900">Доставка по всему Казахстану</h3>
            <p className="text-gray-600 text-lg">Быстрая и надежная доставка материалов в Шымкент, Астану, Алматы и другие города</p>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-50 rounded-full opacity-30"></div>
          </div>
        </div>
      </section>

      {/* Секция категорий */}
      <section className="py-16">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Категории товаров</h2>
            <Link 
              href="/categories" 
              className="text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors font-medium"
            >
              Все категории
              <IoArrowForwardOutline className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((category) => (
              <Link 
                key={category.id} 
                href={`/categories/${category.slug}`}
              className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-orange-200"
              >
              <div className="relative h-32 overflow-hidden bg-gradient-to-r from-orange-500 to-orange-400 flex items-center justify-center">
                <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full -translate-x-12 -translate-y-12"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 translate-y-12"></div>
                <h3 className="font-bold text-2xl text-white text-center relative z-10 px-4">
                    {category.name}
                  </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700">{category.description}</p>
                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* Секция популярных товаров */}
      <section className="py-16 bg-gray-50 rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Популярные товары</h2>
            <Link 
              href="/products" 
              className="text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors font-medium"
            >
              Все товары
              <IoArrowForwardOutline className="w-4 h-4" />
            </Link>
          </div>

          <ProductGrid products={products} />
          
          <div className="mt-8 text-center">
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Смотреть все товары
              <IoArrowForwardOutline className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Секция с информацией */}
      <section className="py-16">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Инструменты для профессионалов</h2>
                <p className="text-gray-600 mb-6">
                  Наш магазин предлагает широкий выбор профессиональных инструментов от ведущих производителей.
                  Все товары сертифицированы и имеют гарантию качества.
                </p>
                <Link 
                  href="/categories/tools" 
                  className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Перейти в каталог
                  <IoArrowForwardOutline className="w-5 h-5" />
                </Link>
              </div>
              <div className="relative h-60 md:h-auto bg-gray-200">
                {/* Здесь будет изображение, когда оно будет доступно */}
                {/* <Image 
                  src="/banners/tools-banner.jpg"
                  alt="Профессиональные инструменты"
                  fill
                  style={{ objectFit: 'cover' }}
                /> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
