// import { getPaginatedProductWithImages } from "@/actions";
import { Pagination, ProductGrid, Title, ProductBreadcrumbs } from "@/components";
// import { redirect } from "next/navigation";
// import { getGoodCategories } from "@/actions";
import { getProductsForMainPage, getCategories } from '@/api'

type SearchParams = Promise<{ [page: string]: string | string[] | undefined }>;

export default async function Home(props: { searchParams: SearchParams }) {
  const params = await props.searchParams;
  const page = params.page ? Number(params.page) : 1;
  // const { products, totalPages } = await getPaginatedProductWithImages({
  //   page,
  // });
  // if (products.length === 0) {
  //   redirect("/");
  // }

  // const { good_categories } = await getGoodCategories();
  // console.log(good_categories);

  const categories = await getCategories();
  const {
    products,
    total,
    totalPages
  } = await getProductsForMainPage({
    page,
    limit: 9,
  });
  console.log(products);

  return (
    <>
      <div className="flex items-start gap-7">
        <ProductBreadcrumbs
          product_categories={categories}
          className="relative"
        />
        <div>
          <Title
            title={"Магазин"}
            subtitle="Все продукты"
            total={total}
          />
          <ProductGrid products={products} />
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </>
  );
}
