"use server";

import { prisma } from "@/lib/prisma";

export const getProductBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findFirst({
      include: {
        productImages: {
          select: {
            url: true,
          },
        },
      },
      where: {
        slug: slug,
      },
    });

    if (!product) return null;

    return {
      ...product,
      images: product.productImages.map((image) => image.url),
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch product by slug");
  }
};
