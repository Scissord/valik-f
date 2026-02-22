export const revalidate = 604800;

import { ProductMobileSlidesShow, ProductSlidesShow, AddToCart } from "@/components";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, Product } from "@/lib/legacy";
import { ChevronRight, Home, Hash, Star, LayoutGrid, Tag, Scale } from "lucide-react";

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
      brand: typeof product.brand === 'object' && product.brand !== null ? (product.brand as any).title : String(product.brand || 'Не указан'),
      category: typeof product.category === 'object' && product.category !== null ? (product.category as any).title : String(product.category || 'Не указана'),
      unit: typeof product.unit === 'object' && product.unit !== null ? (product.unit as any).title : String(product.unit || 'шт'),
      article: product.article || 'N/A',
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

    const renderValue = (value: string | any) => {
      if (typeof value === 'object' && value !== null && 'title' in value) {
        return value.title;
      }
      return value;
    };

    return (
      <div className="min-h-[100dvh] bg-slate-50 pt-24 pb-4 sm:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-4 sm:pb-8">
          {/* Breadcrumbs */}
          <nav className="text-sm font-medium text-slate-500 mb-6 sm:mb-8 flex items-center flex-wrap gap-2">
            <Link href="/" className="hover:text-orange-600 transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span>Главная</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            {product.category_id && (
              <>
                <Link href={`/categories/${product.category_id}`} className="hover:text-orange-600 transition-colors">
                  {renderValue(adaptedProduct.category)}
                </Link>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </>
            )}
            <span className="text-slate-800">{adaptedProduct.title}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 mb-4 sm:mb-12 items-start">
            {/* Left Column: Images */}
            <div className="lg:col-span-6 xl:col-span-5">
              <div className="sticky top-28">
                <div className="p-1 rounded-3xl">
                  <ProductSlidesShow
                    className="hidden md:block rounded-2xl overflow-hidden"
                    images={adaptedProduct.images}
                    title={adaptedProduct.title}
                  />
                  <ProductMobileSlidesShow
                    className="block md:hidden rounded-2xl overflow-hidden"
                    images={adaptedProduct.images}
                    title={adaptedProduct.title}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Info */}
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col pt-2 lg:pl-4">
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
                {adaptedProduct.title}
              </h1>

              {/* Brand and Rating */}
              <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
                <span className="text-slate-500">
                  Бренд <span className="font-semibold text-indigo-600">{renderValue(adaptedProduct.brand)}</span>
                </span>
                <div className="flex items-center gap-0.5 ml-2 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-4 h-4 ${star <= (adaptedProduct.rating || 0) ? 'fill-current' : 'text-slate-200 fill-current'}`} />
                  ))}
                </div>
              </div>

              {/* Price Block */}
              <div className="flex items-center gap-5 mb-6">
                <div className="bg-orange-50/80 text-orange-600 px-5 py-2.5 rounded-2xl text-4xl font-extrabold font-mono tracking-tighter w-fit">
                  {adaptedProduct.price.toLocaleString('ru-RU')}
                  <span className="text-2xl ml-1 font-sans font-semibold">₸</span>
                </div>
                <div className="flex flex-col text-sm justify-center">
                  <span className="text-slate-400 text-xs">Цена за {renderValue(adaptedProduct.unit)}</span>
                </div>
              </div>

              {/* Description */}
              <div className="text-slate-500 text-[15px] leading-relaxed mb-6">
                {adaptedProduct.description || 'Описание товара отсутствует.'}
              </div>

              <hr className="border-slate-200 mb-6" />

              {/* Specs / Features (Square Icons) */}
              <div className="grid grid-cols-2 md:grid-cols-4 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 mb-6">
                {adaptedProduct.article !== 'N/A' && (
                  <div className="flex flex-col items-center justify-center border border-slate-200 rounded-xl sm:rounded-2xl w-full sm:w-[88px] h-16 sm:h-[88px] bg-white hover:border-slate-300 transition-colors">
                    <Hash className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500 mb-0.5 sm:mb-1.5" strokeWidth={1.5} />
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 tracking-wide uppercase">Артикул</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 line-clamp-1 px-1">{adaptedProduct.article}</span>
                  </div>
                )}
                <div className="flex flex-col items-center justify-center border border-slate-200 rounded-xl sm:rounded-2xl w-full sm:w-[88px] h-16 sm:h-[88px] bg-white hover:border-slate-300 transition-colors">
                  <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500 mb-0.5 sm:mb-1.5" strokeWidth={1.5} />
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 tracking-wide uppercase text-center leading-tight line-clamp-1 px-1">Категория</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 line-clamp-1 px-1">{renderValue(adaptedProduct.category)}</span>
                </div>
                <div className="flex flex-col items-center justify-center border border-slate-200 rounded-xl sm:rounded-2xl w-full sm:w-[88px] h-16 sm:h-[88px] bg-white hover:border-slate-300 transition-colors">
                  <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500 mb-0.5 sm:mb-1.5" strokeWidth={1.5} />
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 tracking-wide uppercase text-center leading-tight line-clamp-1 px-1">Единица</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 line-clamp-1 px-1">{renderValue(adaptedProduct.unit)}</span>
                </div>
                <div className="flex flex-col items-center justify-center border border-slate-200 rounded-xl sm:rounded-2xl w-full sm:w-[88px] h-16 sm:h-[88px] bg-white hover:border-slate-300 transition-colors">
                  <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500 mb-0.5 sm:mb-1.5" strokeWidth={1.5} />
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 tracking-wide uppercase text-center leading-tight line-clamp-1 px-1">Бренд</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 line-clamp-1 px-1 truncate w-full text-center">{renderValue(adaptedProduct.brand)}</span>
                </div>
              </div>

              <hr className="border-slate-200 mb-8" />

              {/* Actions */}
              <div className="w-full xl:w-2/3">
                <AddToCart product={adaptedProduct} />
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
