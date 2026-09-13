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
    // we could use promise.all to fetch products and total count concurrently
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

    const totalCount = await prisma.product.count({});

    const totalPages = Math.ceil(totalCount / take);
    return {
      currentPage: page,
      totalPages: totalPages,
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
