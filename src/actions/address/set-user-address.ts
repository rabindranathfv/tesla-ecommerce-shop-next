"use server";

import { Address } from "@/interfaces";
import { prisma } from "@/lib/prisma";

export const setUserAddress = async (address: Address, userId: string) => {
  try {
    const addressRecord = await createOrReplaceAddress(address, userId);

    return {
      ok: true,
      address: addressRecord,
    };
  } catch (error) {
    console.error("Failed to set user address:", error);
    return {
      ok: false,
      error: "Something went wrong while setting the user address.",
    };
  }
};

const createOrReplaceAddress = async (address: Address, userId: string) => {
  try {
    const storedAddress = await prisma.userAddress.findUnique({
      where: {
        userId: userId,
      },
    });

    const newAddress = {
      userId: userId,
      address: address.address,
      address2: address.address2,
      countryId: address.country,
      city: address.city,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      postalCode: address.postalCode,
    };

    if (!storedAddress) {
      return await prisma.userAddress.create({
        data: newAddress,
      });
    }

    const updatedAddress = await prisma.userAddress.update({
      where: {
        userId: userId,
      },
      data: newAddress,
    });

    return updatedAddress;
  } catch (error) {
    console.error("Failed to create or replace user address:", error);
    return {
      ok: false,
      error:
        "Something went wrong while creating or replacing the user address.",
    };
  }
};
