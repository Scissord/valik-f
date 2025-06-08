import { getPaginatedProductWithImages } from "@/actions";
import { Pagination, ProductImage, Title } from "@/components";
import Link from "next/link";
import React from "react";
import { currencyFormat } from "@/util";

type SearchParams = Promise<{ [page: string]: string | string[] | undefined }>;

export default async function pageProducts(props: {
  searchParams: SearchParams;
}) {
  const params = await props.searchParams;
  const page = params.page ? Number(params.page) : 1;
  const { products, totalPages } = await getPaginatedProductWithImages({
    page,
  });

  if (!products) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <Title title="Administración de productos" />
      <div className="flex justify-end mb-5">
        <Link href={"/admin/product/new"} className="btn-primary">
          Nuevo producto
        </Link>
      </div>
      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b border-gray-300">
            <tr>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Imagen
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Titulo producto
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Precio
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Genero
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Stock
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Sizes
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="bg-white border-b border-gray-300 transition duration-300 ease-in-out hover:bg-gray-100"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <Link href={`/product/${product.slug}`}>
                    <ProductImage
                      className="rounded w-20 h-20 object-cover"
                      url={`${product.ProductImage[0]?.url}`}
                      title={product.title}
                      width={80}
                      height={80}
                    />
                  </Link>
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/admin/product/${product.slug}`}
                    className="hover:underline"
                  >
                    {product.title}
                  </Link>
                </td>
                <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                  {currencyFormat(product.price)}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {product.gender.charAt(0).toUpperCase() +
                    product.gender.slice(1).toLowerCase()}
                </td>
                <td className="text-sm text-gray-900 font-semibold px-6 py-4 whitespace-nowrap">
                  {product.inStock}
                </td>
                <td className="text-sm text-gray-900 font-semibold  px-6 py-4 whitespace-nowrap">
                  {product.sizes.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
