"use server";

import { prisma } from "@/lib/prisma";

export const deleteUserAddress = async (userId: string) => {
  try {
    const deletedUser = await prisma.userAddress.delete({
      where: {
        userId: userId,
      },
    });

    if (!deletedUser) {
      return {
        ok: false,
        message: "User address not found",
      };
    }

    return {
      ok: true,
      message: "User address deleted successfully",
    };
  } catch (error) {
    console.error("Failed to delete user address", error);
    return {
      ok: false,
      message: "Failed to delete user address",
    };
  }
};
