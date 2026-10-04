"use client";

import { useCartStore } from "@/store/cart/cart-store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const ClearCartAfterCheckout = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (searchParams.get("fromCheckout") !== "1") return;

    clearCart();
    router.replace(pathname);
  }, [searchParams, clearCart, router, pathname]);

  return null;
};
