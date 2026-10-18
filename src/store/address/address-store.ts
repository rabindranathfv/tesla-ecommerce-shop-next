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

  isCheckoutDraft: boolean;
  setAddress: (address: State["address"]) => void;
  setSavedAddress: (address: State["address"]) => void;
}

export const useAddressStore = create<State>()(
  devtools(
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
        isCheckoutDraft: false,
        setAddress: (address: State["address"]) => {
          set({ address, isCheckoutDraft: true });
        },
        setSavedAddress: (address: State["address"]) => {
          set({ address, isCheckoutDraft: false });
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
