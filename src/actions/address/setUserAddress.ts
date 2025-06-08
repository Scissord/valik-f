"use server";

import { address } from "@/interfaces";
import { prisma } from "@/lib/prisma";

export const setUserAddress = async (address: address, userId: string) => {
  try {
    const newAddress = createOrReplaceAddress(address, userId);
    return {
      ok: true,
      message: newAddress
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "no se pudo grabar la dirección",
    };
  }
};

const createOrReplaceAddress = async (address: address, userId: string) => {
  try {
  
    const storeAddress = await prisma.userAddress.findUnique({
      where: {
        userId,
      },
    });
    
    const addressToSave = {
      userId: userId,
      address: address.address,
      address2: address.address2 ?? "",
      countryId: address.country,
      firstName:  address.firstName.charAt(0).toUpperCase() + address.firstName.slice(1).toLowerCase(),
      lastName: address.lastName.charAt(0).toUpperCase() + address.lastName.slice(1).toLowerCase(),
      phone: address.phone,
      city:address.city,
      postalCode: address.postalCode,
    };
    if (!storeAddress) {
      const newAddress = await prisma.userAddress.create({
        data: addressToSave,
      });
      return newAddress;
    }

    const updateAddress = await prisma.userAddress.update({
      where: { userId },
      data: addressToSave,
    });

    return updateAddress;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "no se pudo grabar la dirección",
    };
  }
};
