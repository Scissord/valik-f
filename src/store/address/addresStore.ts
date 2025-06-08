import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  address: {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
  };
  setAddress: (address: State["address"]) => void;
  deleteAddress: () => void;
}

export const useAddresStore = create<State>()(
  persist(
    (set) => ({
      address: {
        firstName: "",
        lastName: "",
        address: "",
        address2: "",
        postalCode: "",
        city: "",
        country: "",
        phone: "",
      },
      setAddress: (address) => {
        set({ address });
      },
      deleteAddress: () => {
        set({
          address: {
            firstName: "",
            lastName: "",
            address: "",
            address2: "",
            postalCode: "",
            city: "",
            country: "",
            phone: "",
          },
        });
      },
    }),
    {
      name: "address-storage",
    }
  )
);
