"use client";

import { useCartStore } from "@/store/ui/cart/cart-store";
import { currencyFormat } from "@/utils";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export const OrderSummary = () => {
  const [loaded, setLoaded] = useState(false);
  // useShallow is used to optimize re-renders by only selecting the necessary state from the store.
  const { totalItems, subtotalPrice, tax, totalPrice } = useCartStore(
    useShallow((state) => state.getSummaryInformation()),
  );

  useEffect(() => {
    const loadingReady = () => setLoaded(true);
    loadingReady();
  }, []);

  if (!loaded) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-2">
      <span>No. Products</span>
      <span className="text-right">
        {totalItems === 1 ? "1 article" : `${totalItems} articles`}
      </span>

      <span>Subtotal</span>
      <span className="text-right">{currencyFormat(subtotalPrice)}</span>

      <span>Tax (15%)</span>
      <span className="text-right">{currencyFormat(tax)}</span>

      <span className="mt-5 text-2xl">Total:</span>
      <span className="mt-5 text-2xl text-right">
        {currencyFormat(totalPrice)}
      </span>
    </div>
  );
};
