import { getCategories, getProductBySlug } from "@/actions";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import React from "react";
import { ProductForm } from "./ui/ProductForm";


type Params = Promise<{ slug: string }>

export default async function pageProduct(props: {params: Params}) {
  const params = await props.params
  const { slug } = await params;
  const [product, respCategories] = await Promise.all([
    getProductBySlug(slug),
    getCategories(),
  ]);

  if (!product && slug !== "new") {
    redirect("/admin/products");
  }
  const { categories } = respCategories;
  const title = slug === "new" ? "Nuevo producto " : "Editar producto ";

  return (
    <>
      <Title title={title}></Title>
      <ProductForm product={product ?? {}} categories={categories} />
    </>
  );
}
