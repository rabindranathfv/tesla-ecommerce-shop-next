import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];

  getSummaryInformation: () => {
    totalItems: number;
    subtotalPrice: number;
    tax: number;
    totalPrice: number;
  };
  addProductToCart: (product: CartProduct) => void;
  getTotalItems: () => number;
  updateProductInCart: (product: CartProduct, quantity: number) => void;
  removeProduct: (product: CartProduct, size: string) => void;
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
        updateProductInCart: (product: CartProduct, quantity: number) => {
          set(
            (state) => {
              const updatedCart = state.cart.map((item) => {
                if (item.id === product.id && item.size === product.size) {
                  return {
                    ...item,
                    quantity,
                  };
                }
                return item;
              });

              return { cart: updatedCart };
            },
            undefined,
            "cart/updateProductInCart",
          );
        },
        removeProduct: (product: CartProduct, size: string) => {
          set(
            (state) => {
              const updatedCart = state.cart.filter(
                (item) => !(item.id === product.id && item.size === size),
              );
              return { cart: updatedCart };
            },
            undefined,
            "cart/removeProduct",
          );
        },
        getSummaryInformation: () => {
          const { cart, getTotalItems } = get();
          const subtotalPrice = cart.reduce(
            (total, item) => total + item.quantity * item.price,
            0,
          );
          const tax = subtotalPrice * 0.15;
          const totalPrice = subtotalPrice + tax;
          return {
            totalItems: getTotalItems(),
            subtotalPrice,
            tax,
            totalPrice,
          };
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
