"use server";

import { auth } from "@/auth.config";
import { prisma } from "@/lib/prisma";

export const getUsers = async () => {
  try {
    const session = await auth();

    if (session?.user.role !== "admin") {
      return {
        ok: false,
        error: "the user must be admin",
      };
    }

    const users = await prisma.user.findMany({
      orderBy: {
        name: "desc",
      },
    });

    return {
      ok: true,
      users,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error,
    };
  }
};
