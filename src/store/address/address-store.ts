import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

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
    // rememberAddress: boolean;
  };

  setAddress: (address: State["address"]) => void;
}

export const useAddressStore = create<State>()(
  devtools(
    persist(
      (set, get) => ({
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
        setAddress: (address: State["address"]) => {
          set({ address });
        },
      }),
      {
        name: "address-storage",
        storage: createJSONStorage(() => localStorage),
      },
    ),
    {
      name: "address-store",
      store: "address-store",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);
