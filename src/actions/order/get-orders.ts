"use server";

import { auth } from "@/auth.config";
import { prisma } from "@/lib/prisma";

export const getOrders = async () => {
  try {
    const session = await auth();
    if (!session?.user || session?.user.role !== "admin") {
      return {
        ok: false,
        message: "User is not an admin",
      };
    }

    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        orderAddresses: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return {
      ok: true,
      orders,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get orders by user");
  }
};
