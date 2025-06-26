export const revalidate = 60;

import { Pagination, ProductGrid, Title } from "@/components";
import { redirect } from "next/navigation";
import { getPaginatedProductWithImages } from "@/actions";
/*
interface Props {
  params: {
    gender: string;
  };
  searchParams: {
    page?: string;
  };
}*/

type Params = Promise<{ gender: string }>;
type SearchParams = Promise<{ [page: string]: string | string[] | undefined }>;

export default async function GenderPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { gender } = await props.params;
  const { page } = await props.searchParams;

  const sitePage = page ? Number(page) : 1;
  const { products, totalPages } = await getPaginatedProductWithImages({
    page: sitePage,
    gender: gender || "men",
  });
  if (products.length === 0) {
    redirect(`/gender/${gender}`);
  }
  const genderTitle= gender==="men"?"hombres":gender==="women"?"mujeres":"niños"
  /*if (id=="kids") return NotFound()*/
  return (
    <>
      <Title
        title={`Articulos de ${genderTitle}`}
        subtitle="Articulos por categoria"
      />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  );
}
