export const revalidate = 604800; //7 dias

// import { getProductBySlug } from "@/actions";
import { ProductMobileSlidesShow, ProductSlidesShow } from "@/components";
import { AddToCart } from "@/components/product/addToCart/addToCart";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/api";

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
  } catch (error) {
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

    return (
      <div className="mt-5 mb-20 grid md:grid-cols-3 gap-3">
        <div className="col-span-1">
          {/* Desktop slideshow */}
          <ProductSlidesShow
            className="hidden md:block"
            images={product.images}
            title={product.title}
          />
          {/* Mobile slideshow */}
          <ProductMobileSlidesShow
            className="block md:hidden"
            images={product.images}
            title={product.title}
          />
        </div>
        <div className="col-span-2 px-5">
          <AddToCart product={product} />
          
          <h3 className="font-bold text-sm mt-5">Описание</h3>
          <p className="font-light">{product.description}</p>
          
          <div className="mt-5">
            <h3 className="font-bold text-sm">Детали</h3>
            <p className="font-light">Бренд: {product.brand}</p>
            <p className="font-light">Категория: {product.category}</p>
            <p className="font-light">Единица измерения: {product.unit}</p>
            <p className="font-light">Артикул: {product.article}</p>
            <p className="font-light">Рейтинг: {product.rating}</p>
            <p className="font-light">Доступные размеры: {product.sizes.join(', ')}</p>
            <p className="font-light">Теги: {product.tags.join(', ')}</p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }
}
