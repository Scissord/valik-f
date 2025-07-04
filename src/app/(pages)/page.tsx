import { ProductGrid } from "@/components";
import { getProductsForMainPage } from '@/api';
import Link from "next/link";
import Image from "next/image";
import { IoArrowForwardOutline, IoConstructOutline, IoLayersOutline, IoHomeOutline, IoColorPaletteOutline, IoCartOutline } from "react-icons/io5";
import { FaToolbox, FaScrewdriver, FaPaintRoller, FaTruck, FaCreditCard, FaHeadset } from "react-icons/fa";

export default async function Home() {
  // Добавляем обработку ошибок при получении продуктов
  let products = [];
  try {
    const result = await getProductsForMainPage({
      page: 1,
      limit: 8,
    });
    products = result.products || [];
  } catch (error) {
    console.error("Ошибка при загрузке продуктов:", error);
    // В случае ошибки products останется пустым массивом
  }

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

  // Преимущества компании
  const advantages = [
    {
      icon: <FaTruck className="w-8 h-8" />,
      title: "Доставка по всему Казахстану",
      description: "Быстрая и надежная доставка в любой город"
    },
    {
      icon: <FaCreditCard className="w-8 h-8" />,
      title: "Удобная оплата",
      description: "Наличные, банковские карты, онлайн-платежи"
    },
    {
      icon: <FaHeadset className="w-8 h-8" />,
      title: "Профессиональная консультация",
      description: "Эксперты помогут с выбором товаров"
    },
  ];

  return (
    <main className="overflow-hidden">
      {/* Hero секция */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-repeat opacity-30"></div>
        </div>
        
        {/* Декоративные элементы */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-orange-500 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-blue-500 rounded-full filter blur-3xl opacity-10"></div>
        
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Всё для <span className="text-orange-500">строительства</span> и <span className="text-orange-500">ремонта</span>
              </h1>
              
              <p className="text-xl text-gray-300">
                Качественные строительные материалы и профессиональные инструменты 
                от ведущих производителей с доставкой по всему Казахстану
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/categories" 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/20"
                >
                  <IoCartOutline className="w-5 h-5" />
                  Каталог товаров
                </Link>
                <Link 
                  href="/contacts" 
                  className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 border border-white/20"
                >
                  Связаться с нами
                </Link>
              </div>
            </div>
            {/* Картинка убрана по запросу */}
          </div>
        </div>
        
        {/* Волна убрана, фон теперь сплошной */}
      </section>
      
      {/* Секция преимуществ */}
      <section className="py-24 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Почему выбирают нас</h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-16">
          Мы поставляем качественные строительные материалы и инструменты по всему Казахстану
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-8 shadow-lg shadow-gray-100 border border-gray-100 hover:shadow-xl hover:border-orange-100 transition-all duration-300"
            >
              <div className="bg-orange-50 text-orange-500 p-4 rounded-2xl inline-flex mb-6">
                {advantage.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{advantage.title}</h3>
              <p className="text-gray-600">{advantage.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Секция категорий */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-12">
            <div>
              <span className="text-orange-500 font-medium">Каталог</span>
              <h2 className="text-3xl font-bold text-gray-900">Популярные категории</h2>
            </div>
            <Link 
              href="/categories" 
              className="text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors font-medium group"
            >
              Все категории
              <IoArrowForwardOutline className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.slice(0, 6).map((category) => (
              <Link 
                key={category.id} 
                href={`/categories/${category.slug}`}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-100/50 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/patterns/dots.svg')] opacity-30"></div>
                    <div className="absolute bottom-0 right-0 p-6 text-white">
                      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                        {category.icon}
                      </div>
                    </div>
                    <h3 className="absolute bottom-6 left-6 font-bold text-2xl text-white z-10 max-w-[60%] leading-tight">
                      {category.name}
                    </h3>
                  </div>
                  <div className="p-6 flex-1">
                    <p className="text-gray-700 mb-4">{category.description}</p>
                    <span className="text-orange-500 font-medium inline-flex items-center text-sm group-hover:underline">
                      Перейти в категорию
                      <IoArrowForwardOutline className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Секция популярных товаров */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-12">
            <div>
              <span className="text-orange-500 font-medium">Товары</span>
              <h2 className="text-3xl font-bold text-gray-900">Популярные позиции</h2>
            </div>
            <Link 
              href="/products" 
              className="text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors font-medium group"
            >
              Все товары
              <IoArrowForwardOutline className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-100/50">
            <ProductGrid products={products} />
          </div>
        </div>
      </section>

      {/* CTA секция */}
    </main>
  );
}
