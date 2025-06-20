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
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <Image 
            src="/hero-bg.jpg"
            alt="Строительные материалы и инструменты"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
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
              <Link 
                href="/promotions" 
                className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Акции и скидки
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Секция преимуществ */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm flex items-start gap-4">
              <div className="bg-orange-100 text-orange-600 p-3 rounded-lg">
                <IoHammerOutline className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Профессиональные инструменты</h3>
                <p className="text-gray-600">Широкий выбор инструментов для профессионалов и любителей</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm flex items-start gap-4">
              <div className="bg-orange-100 text-orange-600 p-3 rounded-lg">
                <IoColorPaletteOutline className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Материалы для отделки</h3>
                <p className="text-gray-600">Всё для внутренних и внешних работ</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm flex items-start gap-4">
              <div className="bg-orange-100 text-orange-600 p-3 rounded-lg">
                <IoLayersOutline className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Доставка за 24 часа</h3>
                <p className="text-gray-600">Быстрая доставка в удобное для вас время</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Секция категорий */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md"
              >
                <div className="relative h-40 overflow-hidden">
                  <div className="absolute inset-0 bg-gray-200">
                    {/* Здесь будет изображение категории, когда оно будет доступно */}
                    {/* <Image 
                      src={category.image}
                      alt={category.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    /> */}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                </div>
                <div className="p-5">
                  <div className="mb-4 text-orange-500">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-2 group-hover:text-orange-500 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Секция популярных товаров */}
      <section className="py-16 bg-gray-50">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </section>
    </div>
  );
}
