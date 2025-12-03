export const revalidate = 604800;

import { ProductMobileSlidesShow, ProductSlidesShow, AddToCart } from "@/components";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, Product } from "@/lib/legacy";

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
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-sm text-gray-500 mb-6">
            <span className="hover:text-orange-600 cursor-pointer">Главная</span> /
            <span className="hover:text-orange-600 cursor-pointer"> {adaptedProduct.category}</span> /
            <span className="text-gray-700"> {adaptedProduct.title}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div>
              <ProductSlidesShow
                className="hidden md:block"
                images={adaptedProduct.images}
                title={adaptedProduct.title}
              />
              <ProductMobileSlidesShow
                className="block md:hidden"
                images={adaptedProduct.images}
                title={adaptedProduct.title}
              />
            </div>

            <div>
              <div className="mb-3">
                <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                  Артикул: {adaptedProduct.articul}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                {adaptedProduct.title}
              </h1>

              <div className="flex items-baseline gap-3 mb-6">
                <div className="text-4xl font-bold text-orange-600">
                  {adaptedProduct.price.toLocaleString('ru-RU')} ₸
                </div>
                <div className="text-sm text-gray-600">за {adaptedProduct.unit}</div>
              </div>

              <div className="mb-8">
                <AddToCart product={adaptedProduct} />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Бренд</div>
                  <div className="font-semibold text-gray-900">{adaptedProduct.brand}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Категория</div>
                  <div className="font-semibold text-gray-900">{adaptedProduct.category}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Единица</div>
                  <div className="font-semibold text-gray-900">{adaptedProduct.unit}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Рейтинг</div>
                  <div className="flex items-center gap-1">
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

          {adaptedProduct.description && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Описание</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {adaptedProduct.description}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }
}
