export const revalidate = 604800; //7 dias

// import { getProductBySlug } from "@/actions";
import { ProductMobileSlidesShow, ProductSlidesShow, AddToCart } from "@/components";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, Product } from "@/lib/legacy";
import { titleFont } from "@/config/fonts";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await getProduct({ id: slug });
    return {
      title: product?.title ?? "Product not found",
      description: product?.description ?? "",
      openGraph: {
        title: product?.title ?? "Product not found",
        description: product?.description ?? "",
        images: product?.images?.[0] ? [product.images[0]] : [],
      },
    };
  } catch {
    return {
      title: "Product not found",
      description: "Product page",
    };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  
  try {
    const product = await getProduct({ id: slug });

    if (!product) {
      notFound();
    }

    // Адаптируем данные продукта, обеспечивая наличие всех необходимых полей
    const adaptedProduct: Product = {
      ...product,
      slug: slug,
      images: product.images && product.images.length > 0 ? product.images : ['/imgs/placeholder.png'],
      brand: String(product.brand || 'Не указан'),
      category: String(product.category || 'Не указана'),
      unit: String(product.unit || 'шт'),
      articul: product.articul || 'N/A',
      rating: product.rating || 0,
      brand_id: product.brand_id || 0,
      unit_id: product.unit_id || 0,
      created_at: product.created_at || '',
      updated_at: product.updated_at || '',
      deleted_at: product.deleted_at || null,
      category_id: product.category_id || 0,
      quantity: product.quantity || 0,
      description: product.description || '',
      title: product.title || 'Без названия',
      id: product.id || 0,
      price: Number(product.price) || 0,
    };

    return (
      <div className="container mx-auto px-4 py-8 fade-in">
        {/* Хлебные крошки */}
        <div className="text-sm text-gray-500 mb-6">
          <span className="hover:text-orange-600 cursor-pointer">Главная</span> / 
          <span className="hover:text-orange-600 cursor-pointer"> {adaptedProduct.category}</span> / 
          <span className="text-gray-700"> {adaptedProduct.title}</span>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Галерея изображений */}
            <div className="lg:col-span-2">
              {/* Desktop slideshow */}
              <ProductSlidesShow
                className="hidden md:block"
                images={adaptedProduct.images}
                title={adaptedProduct.title}
              />
              {/* Mobile slideshow */}
              <ProductMobileSlidesShow
                className="block md:hidden"
                images={adaptedProduct.images}
                title={adaptedProduct.title}
              />
            </div>
            
            {/* Информация о товаре */}
            <div className="lg:col-span-3">
              <div className="flex flex-col h-full">
                {/* Заголовок и цена */}
                <div className="mb-6">
                  <h1 className={`${titleFont.className} text-3xl font-bold mb-2`}>
                    {adaptedProduct.title}
                  </h1>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {adaptedProduct.price.toLocaleString('ru-RU')} ₸
                    </div>
                    <div className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm">
                      Артикул: {adaptedProduct.articul}
                    </div>
                  </div>
                </div>
                
                {/* Кнопка добавления в корзину */}
                <div className="mb-8">
                  <AddToCart product={adaptedProduct} />
                </div>
                
                {/* Описание */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 border-b pb-2">Описание</h3>
                  <p className="text-gray-700 leading-relaxed">{adaptedProduct.description}</p>
                </div>
                
                {/* Характеристики */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Характеристики</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between border-b border-gray-200 py-2">
                      <span className="text-gray-600">Бренд:</span>
                      <span className="font-medium">{adaptedProduct.brand}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 py-2">
                      <span className="text-gray-600">Категория:</span>
                      <span className="font-medium">{adaptedProduct.category}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 py-2">
                      <span className="text-gray-600">Единица измерения:</span>
                      <span className="font-medium">{adaptedProduct.unit}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 py-2">
                      <span className="text-gray-600">Рейтинг:</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className={`w-4 h-4 ${star <= (adaptedProduct.rating || 0) ? 'text-orange-400' : 'text-gray-300'}`} 
                            fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }
}
