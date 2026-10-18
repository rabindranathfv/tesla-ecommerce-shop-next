"use server";

import { prisma } from "@/lib/prisma";

export const getProductImagesByIds = async (productIds: string[]) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        productImages: {
          orderBy: {
            id: "asc",
          },
          select: {
            url: true,
          },
        },
      },
    });

    const productsById = new Map(products.map((product) => [product.id, product]));

    return {
      ok: true,
      products: productIds.map((id) => ({
        id,
        image: productsById.get(id)?.productImages[0]?.url,
      })),
    };
  } catch (error) {
    console.error("Failed to get product images:", error);
    return {
      ok: false,
      message: "Failed to get product images.",
    };
  }
};
