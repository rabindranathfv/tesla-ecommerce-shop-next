"use server";

import { prisma } from "@/lib/prisma";

export const setTransactionId = async (
  orderId: string,
  transactionId: string,
) => {
  try {
    console.log(
      `Setting transaction ID for order ${orderId} with transaction ID ${transactionId}`,
    );
    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        transactionId,
      },
    });

    if (!order) {
      return {
        ok: false,
        message: `Order with ID ${orderId} not found`,
      };
    }

    console.log(`Transaction ID for order ${orderId} set successfully`);

    return {
      ok: true,
      message: `Transaction ID set successfully for order ${orderId}`,
    };
  } catch (error) {
    console.error(`Failed to set transaction ID for order ${orderId}:`, error);
    return {
      ok: false,
      message: `Failed to set transaction ID for order ${orderId}`,
    };
  }
};
