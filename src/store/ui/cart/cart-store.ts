import { CartProduct } from "@/interfaces";
import { create } from "zustand";

interface State {
  cart: CartProduct[];

  AddProductToCart: (product: CartProduct) => void;
}

export const useCartStore = create<State>((set, get) => ({
  cart: [],

  AddProductToCart: (product: CartProduct) => {
    const { cart } = get();
    const productInCart = cart.some(
      (item) => item.id === product.id && item.size === product.size,
    );
    if (!productInCart) {
      set({ cart: [...cart, product] });
    }

    // this cart it's already updated
    const updatedCart = cart.map((item) => {
      if (item.id === product.id && item.size === product.size) {
        return { ...item, quantity: item.quantity + product.quantity };
      }
      return item;
    });

    set({ cart: updatedCart });
  },
}));
