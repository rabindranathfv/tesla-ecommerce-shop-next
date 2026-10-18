"use server";

import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

export const deleteProductImage = async (
  imageId: number,
  imageUrl: string,
): Promise<{ ok: boolean; message: string }> => {
  if (!imageUrl) {
    return { ok: false, message: "Image URL is required" };
  }

  if (!imageUrl.startsWith("http")) {
    return { ok: false, message: "Invalid image URL" };
  }

  const imageName = imageUrl.split("/").pop()?.split(".")[0];

  try {
    if (imageName) {
      await cloudinary.uploader.destroy(imageName);
    }

    const deleteProductImage = await prisma.productImage.delete({
      where: { id: imageId },
      select: {
        product: {
          select: {
            slug: true,
          },
        },
      },
    });

    revalidatePath(`/admin/product/${deleteProductImage?.product?.slug}`);
    revalidatePath(`/admin/products`);
    revalidatePath(`/product/${deleteProductImage?.product?.slug}`);
    revalidatePath(`/cart`);

    return { ok: true, message: "Product image deleted successfully" };
  } catch (error) {
    console.error("Error deleting product image:", error);
    return { ok: false, message: `Error deleting product image: ${error}` };
  }
};
