"use server";

import { auth } from "@/auth.config";
import { prisma } from "@/lib/prisma";

export const getOrdersByUser = async () => {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        ok: false,
        message: "User is not authenticated",
      };
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
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
