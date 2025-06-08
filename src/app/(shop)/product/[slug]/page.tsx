export const revalidate = 604800; //7 dias

// import { getProductBySlug } from "@/actions";
import { ProductImage, ProductMobileSlidesShow,ProductSlidesShow } from "@/components";
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

  const product = await getProduct({ id: slug });
  return {
    title: product?.title ?? "Product not found",
    description: product?.description ?? "",
    openGraph: {
      title: product?.title ?? "Product not found",
      description: product?.description ?? "",
      // images: [`/products/${product?.images[1]}`],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct({ id: slug });

  if (!product) {
    notFound();
  }

  return (
    <div className="mt-5 mb-20 grid md:grid-cols-3 gap-3">
      <div className="col-span-1">
        {/*Desktop slideshow */}
        {/* <ProductSlidesShow
          className="hidden md:block"
          images={product.images}
          title={product.title}
        /> */}
        {/*Mobile slideshow */}
        {/* <ProductMobileSlidesShow
          className="block md:hidden"
          images={product.images}
          title={product.title}
        /> */}
        <ProductImage
          url={undefined}
          title={product.title}
          className="w-full object-cover rounded"
          width={600}
          height={600}
          // onMouseEnter={() => setDisplayImage(product.images[1])}
          // onMouseLeave={() => setDisplayImage(product.images[0])}
        />
      </div>
      <div className="col-span1 px-5">
        <AddToCart product={product}  />
        <h3 className="font-bold text-sm">Описание</h3>
        <p className="font-light">{product?.description}</p>
        <p className="font-light">{product?.brand}</p>
        <p className="font-light">{product?.category}</p>
        <p className="font-light">{product?.unit}</p>
      </div>
    </div>
  );
}
