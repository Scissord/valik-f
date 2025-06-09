"use server";
import { prisma, Gender, Product, Size } from "@/lib";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(0))),
  categoryId: z.string().uuid(),
  sizes: z.coerce.string().transform((val) => val.split(",")),
  gender: z.nativeEnum(Gender),
  tags: z.string(),
});

export const createUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  const productParsed = productSchema.safeParse(data);
  if (!productParsed.success) {
    console.log(productParsed.error);
    return { ok: false };
  }

  const productP = productParsed.data;
  const slug = productP.slug.toLowerCase().replace(/ /g, "-").trim();
  const { id, ...rest } = productP;
  try {
    const prismaTx = await prisma.$transaction(async () => {
      let product: Product;
      const tagsArray = (rest.tags as string)
        .split(",")
        .map((tag: string) => tag.trim().toLowerCase()); // Преобразуем теги

      if (id) {
        // Обновляем существующий продукт
        product = await prisma.product.update({
          where: { id },
          data: {
            ...rest,
            slug,
            sizes: {
              set: rest.sizes as Size[],
            },
            tags: {
              set: tagsArray,
            },
          },
        }) as Product;
      } else {
        // Создаем новый продукт
        product = await prisma.product.create({
          data: {
            ...rest,
            slug,
            sizes: {
              set: rest.sizes as Size[],
            },
            tags: {
              set: tagsArray,
            },
          },
        }) as Product;
      }

      if (formData.getAll("images")) {
        const images = await uploadImages(formData.getAll("images") as File[]);
        if (!images) {
          throw new Error("Не удалось загрузить изображения");
        }
        await prisma.productImage.createMany({
          data: images.map((image) => ({
            url: image!,
            productId: product.id,
          })),
        });
      }

      return { product };
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${slug}`);
    revalidatePath(`/products/${slug}`);

    return {
      ok: true,
      product: prismaTx.product,
    };
  } catch (error) {
    return {
      ok: false,
      message: `Ошибка при создании/обновлении продукта: ${error}`,
    };
  }
};

const uploadImages = async (images: File[]) => {
  try {
    const uploadPromises = images.map(async (image) => {
      try {
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString("base64");
        return cloudinary.uploader
          .upload(`data:image/png;base64,${base64Image}`)
          .then((r) => r.secure_url);
      } catch (error) {
        console.log(error)
        return null;
      }
    });
    const uploadedImages = await Promise.all(uploadPromises);
    return uploadedImages;
  } catch (error) {
    console.log(error)
    return null;
  }
};
