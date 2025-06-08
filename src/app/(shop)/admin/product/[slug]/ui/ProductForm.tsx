"use client";

import {
  Category,
  Product,
  ProductImage as ProductWithImages,
} from "@/interfaces";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { createUpdateProduct, deleteProductImages } from "@/actions";
import { useRouter } from "next/navigation";
import { ProductImage } from "@/components";

interface Props {
  product: Partial<Product> & { ProductImage?: ProductWithImages[] };
  categories: Category[];
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: string[];
  tags: string;
  gender: "men" | "women" | "kid" | "unisex";
  categoryId: string;
  images?: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      images: undefined,
      tags: product.tags?.join(", ") ?? undefined,
      sizes: product.sizes ?? [],
      gender:
        product.gender &&
        ["men", "women", "kid", "unisex"].includes(product.gender)
          ? (product.gender as "men" | "women" | "kid" | "unisex")
          : undefined,
    },
  });

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData();
    const { images, ...productToSave } = data;

    if (product.id) {
      //Es una modificación
      formData.append("id", product.id);
    }

    formData.append("title", productToSave.title ?? "");
    formData.append("slug", productToSave.slug ?? "");
    formData.append("description", productToSave.title ?? "");
    formData.append("price", productToSave.price.toString() ?? "");
    formData.append("inStock", productToSave.inStock.toString() ?? "");
    formData.append("sizes", productToSave.sizes.toString() ?? "");
    formData.append("tags", productToSave.tags ?? "");
    formData.append("categoryId", productToSave.categoryId ?? "");
    formData.append("gender", productToSave.gender ?? "");

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }

    const { ok, product: updateProduct } = await createUpdateProduct(formData);
    if (!ok) {
      alert("El producto no se pudo actualizar");
      return;
    }
    router.replace(`/admin/product/${updateProduct?.slug}`);
  };

  watch("sizes");

  const onSizeChange = (size: string) => {
    const sizes = new Set(getValues("sizes"));
    const validationSizes=sizes.has(size) ? sizes.delete(size) : sizes.add(size);
    console.log(validationSizes);
    setValue("sizes", Array.from(sizes));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
    >
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Título</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("title", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("slug", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Описание</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200"
            {...register("description", { required: true })}
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Price</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("price", { required: true, min: 0 })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("tags", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Stock</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("inStock", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Gender</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register("gender", { required: true })}
          >
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="flex flex-col mb-2">
          <span>Categoria</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register("categoryId", { required: true })}
          >
            <option value="">[Seleccione]</option>
            {categories &&
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name.charAt(0).toUpperCase() +
                    category.name.slice(1)}
                </option>
              ))}
          </select>
        </div>

        <button className="btn-primary w-full">Guardar</button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        {/* As checkboxes */}
        <div className="flex flex-col">
          <span>Tallas</span>
          <div className="flex flex-wrap">
            {sizes.map((size) => (
              <div
                key={size}
                onClick={() => onSizeChange(size)}
                className={clsx(
                  "p-2 border cursor-pointer rounded-md mr-2 mb-2 w-14 transition-all text-center",
                  {
                    "bg-blue-500 text-white": getValues("sizes").includes(size),
                  }
                )}
              >
                <span>{size}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col mb-2">
            <span>Fotos</span>
            <input
              type="file"
              multiple
              {...register("images")}
              className="text-sm text-stone-500
                file:mr-5 file:py-1 file:px-3 file:border-[1px] file:rounded
                file:text-xs file:font-medium
                file:bg-stone-50 file:text-stone-700
                hover:file:cursor-pointer hover:file:bg-blue-50
                hover:file:text-blue-700"
              accept="image/png, image/jpeg, image/avif"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
            {product.ProductImage?.map((image) => (
              <div key={image.id}>
                <ProductImage
                  className="rounded-t-md shadow-md w-full "
                  height={250}
                  width={250}
                  url={image.url}
                  title={product.title ?? ""}
                />
                <button
                  type="button"
                  className="btn-danger rounded-b-xl w-full font-semibold cursor-pointer"
                  onClick={() => deleteProductImages(image.id, image.url)}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};
