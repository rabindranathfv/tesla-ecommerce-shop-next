"use server";

import { prisma } from "@/lib/prisma";

interface PaginationOptions {
  page?: number;
  take?: number;
}

export const getPaginatesProductsWithImages = async ({
  page = 1,
  take = 12,
}: PaginationOptions = {}) => {
  if (isNaN(Number(page))) page = 1;

  if (page < 1) page = 1;

  try {
    const products = await prisma.product.findMany({
      take: take,
      skip: (page - 1) * take,
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
