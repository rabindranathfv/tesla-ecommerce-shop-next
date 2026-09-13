"use server";

import { prisma } from "@/lib/prisma";

export const getPaginatesProductsWithImages = async () => {
  try {
    const products = await prisma.product.findMany({
      include: {
        productImages: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
    });
    return {
      products: products.map((product) => ({
        ...product,
        images: product.productImages.map((image) => image.url),
      })),
    };
  } catch (error) {
    console.error("Failed to get paginated products with images:", error);
    throw error;
  }
};
