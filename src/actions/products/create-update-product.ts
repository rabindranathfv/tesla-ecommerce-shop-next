"use server";

import { Product, Size } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

const productSchema = z.object({
  id: z.uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(1).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(2))),
  sizes: z.coerce
    .string()
    .transform((val) => val.split(",").map((s) => s.trim())),
  tags: z.string(),
  gender: z.enum(["men", "women", "kid", "unisex"]),
  categoryId: z.uuid().min(1),
});

export const createUpdateProduct = async (formData: FormData) => {
  try {
    const productData = Object.fromEntries(formData.entries());
    const productParsed = productSchema.safeParse(productData);

    if (!productParsed.success) {
      console.error("Product validation failed:", productParsed.error);
      return { ok: false };
    }

    const product = productParsed.data;
    product.slug = product.slug.toLowerCase().replace(/\s+/g, "-").trim();

    const { id, ...rest } = product;

    const prismaTx = await prisma.$transaction(async (tx) => {
      let product: Product;
      const tagsArray = rest.tags.split(",").map((t) => t.toLowerCase().trim());

      if (id) {
        product = await tx.product.update({
          where: { id },
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[],
            },
            tags: {
              set: tagsArray,
            },
          },
        });

        console.log({ updateProduct: product });
      } else {
        product = await tx.product.create({
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[],
            },
            tags: {
              set: tagsArray,
            },
          },
        });
        console.log({ createProduct: product });
      }

      const imageFiles = formData.getAll("images") as File[];
      if (imageFiles.length > 0) {
        const uploadedImages = await uploadImages(imageFiles);
        if (!uploadedImages || uploadedImages.some((image) => image === null)) {
          throw new Error("Failed to upload one or more product images");
        }

        const imageUrls = uploadedImages.filter(
          (image): image is string => image !== null,
        );

        await tx.productImage.createMany({
          data: imageUrls.map((url) => ({
            url,
            productId: product.id,
          })),
        });
      }

      return {
        product,
      };
    });

    // revalidatePath
    revalidatePath("/admin/products");
    revalidatePath(`/admin/product/${product.slug}`);
    revalidatePath(`/products/${product.slug}`);

    return { ok: true, product: prismaTx.product };
  } catch (error) {
    console.error("Error creating/updating product:", error);
    return { ok: false, message: `Error creating/updating product: ${error}` };
  }
};

const uploadImages = async (images: File[]) => {
  try {
    const uploadPromises = images.map(async (image) => {
      try {
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString("base64");

        return cloudinary.uploader
          .upload(`data:image/jpeg;base64,${base64Image}`)
          .then((r) => r.secure_url);
      } catch (error) {
        console.error("Error upload images in cloudinary:", error);
        return null;
      }
    });

    const uploadedImages = await Promise.all(uploadPromises);
    return uploadedImages;
  } catch (error) {
    console.error("Error uploading images:", error);
    return null;
  }
};
