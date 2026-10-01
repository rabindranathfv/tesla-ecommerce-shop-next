"use server";

import { prisma } from "@/lib/prisma";

const mapUserAddress = (
  userAddress:
    | {
        firstName: string;
        lastName: string;
        address: string;
        address2: string | null;
        postalCode: string;
        city: string;
        countryId: string;
        phone: string;
      }
    | null
    | undefined,
) => ({
  firstName: userAddress?.firstName || "",
  lastName: userAddress?.lastName || "",
  address: userAddress?.address || "",
  address2: userAddress?.address2 || "",
  postalCode: userAddress?.postalCode || "",
  city: userAddress?.city || "",
  country: userAddress?.countryId || "",
  phone: userAddress?.phone || "",
});

export const getUserAddress = async (userId: string) => {
  try {
    const userAddress = await prisma.userAddress.findUnique({
      where: {
        userId: userId,
      },
    });

    const userStoredAddress = mapUserAddress(userAddress);

    return {
      ok: true,
      data: userStoredAddress,
    };
  } catch (error) {
    console.error("Failed to get user address", error);
    return {
      ok: false,
      message: "Failed to get user address",
    };
  }
};
