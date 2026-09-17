import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface State {
  cart: CartProduct[];

  addProductToCart: (product: CartProduct) => void;
}

export const useCartStore = create<State>()(
  devtools(
    (set) => ({
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
                return { ...item, quantity: item.quantity + product.quantity };
              }
              return item;
            });

            return { cart: updatedCart };
          },
          undefined,
          "cart/addProductToCart",
        );
      },
    }),
    {
      name: "cart-store",
      store: "cart-store",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);
