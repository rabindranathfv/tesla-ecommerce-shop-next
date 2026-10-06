"use server";

import { auth } from "@/auth.config";
import { prisma } from "@/lib/prisma";

export const getOrderById = async (orderId: string) => {
  try {
    const session = await auth();
    if (!session?.user) {
      return { ok: false, message: "User not authenticated" };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderAddresses: true,
        orderItems: {
          select: {
            price: true,
            quantity: true,
            size: true,
            product: {
              select: {
                title: true,
                slug: true,
                productImages: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return { ok: false, message: "Order not found" };
    }

    if (session.user.role === "user" && order.userId !== session.user.id) {
      return { ok: false, message: "User not authorized to view this order" };
    }

    return { ok: true, order: order };
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return { ok: false, message: (error as Error).message };
  }
};
