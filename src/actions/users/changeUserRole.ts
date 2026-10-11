"use server";

import { auth } from "@/auth.config";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/interfaces/user.interface";
import { revalidatePath } from "next/cache";

export const changeUserRole = async (userId: string, newRole: string) => {
  try {
    const session = await auth();

    if (session?.user.role !== "admin") {
      return {
        ok: false,
        error: "the user must be admin",
      };
    }

    const transformedRole: Role = newRole === "admin" ? "admin" : "user";

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: transformedRole,
      },
    });

    revalidatePath("/admin/users");

    return {
      ok: true,
      user: updatedUser,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error,
    };
  }
};
