import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];

  addProductToCart: (product: CartProduct) => void;
  getTotalItems: () => number;
}

export const useCartStore = create<State>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],

        addProductToCart: (product: CartProduct) => {
          set(
            (state) => {
              const productInCart = state.cart.some(
                (item) => item.id === product.id && item.size === product.size,
              );

              if (!productInCart) {
                return { cart: [...state.cart, product] };
              }

              const updatedCart = state.cart.map((item) => {
                if (item.id === product.id && item.size === product.size) {
                  return {
                    ...item,
                    quantity: item.quantity + product.quantity,
                  };
                }
                return item;
              });

              return { cart: updatedCart };
            },
            undefined,
            "cart/addProductToCart",
          );
        },
        getTotalItems: () => {
          return get().cart.reduce((total, item) => total + item.quantity, 0);
        },
      }),
      {
        name: "cart-storage",
        storage: createJSONStorage(() => localStorage),
      },
    ),
    {
      name: "cart-store",
      store: "cart-store",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);
