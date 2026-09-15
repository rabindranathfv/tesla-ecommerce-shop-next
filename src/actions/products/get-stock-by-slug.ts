"use server";

import { prisma } from "@/lib/prisma";

export const getStockBySlug = async (slug: string) => {
  try {
    const productStock = await prisma.product.findUnique({
      where: {
        slug: slug,
      },
      select: {
        inStock: true,
      },
    });
    return productStock?.inStock ?? 0;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch stock by slug");
  }
};
