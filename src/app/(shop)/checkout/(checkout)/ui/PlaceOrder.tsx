"use client";

import { placeOrder } from "@/actions/order/place-order";
import { useAddressStore } from "@/store/address/address-store";
import { useCartStore } from "@/store/cart/cart-store";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useShallow } from "zustand/shallow";

export const PlaceOrder = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const address = useAddressStore((state) => state.address);
  const cart = useCartStore((state) => state.cart);

  const { isHydrated, totalItems, subtotalPrice, tax, totalPrice } =
    useCartStore(
      useShallow((state) => ({
        isHydrated: state.isHydrated,
        ...state.getSummaryInformation(),
      })),
    );

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      // Simulate placing an order
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const productsToOrder = cart.map((p) => ({
        productId: p.id,
        quantity: p.quantity,
        size: p.size,
      }));
      console.log(
        "Order placed successfully, Address:",
        address,
        productsToOrder,
      );

      const resp = await placeOrder(productsToOrder, address);
      console.log(`RESP: ${JSON.stringify(resp)}`);
      if (!resp.ok) {
        setIsPlacingOrder(false);
        setErrorMessage(resp.message ?? "Failed to place order");
        return;
      }

      // Handle successful order placement here
      router.replace(`/orders/${resp.order?.id ?? ""}?fromCheckout=1`);
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const itemsText = isHydrated
    ? totalItems === 1
      ? "1 article"
      : `${totalItems} articles`
    : "0 articles";
  const subtotalText = currencyFormat(isHydrated ? subtotalPrice : 0);
  const taxText = currencyFormat(isHydrated ? tax : 0);
  const totalText = currencyFormat(isHydrated ? totalPrice : 0);

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl mb-2">Delivery address</h2>
      <div className="mb-10">
        <p className="text-xl">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>
          {address.city} CP {address.country}
        </p>
        <p>{address.phone}</p>
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

      <h2 className="text-2xl mb-2">Order summary</h2>

      <div className="grid grid-cols-2">
        <span>No. Products</span>
        <span className="text-right">{itemsText}</span>

        <span>Subtotal</span>
        <span className="text-right">{subtotalText}</span>

        <span>Tax (15%)</span>
        <span className="text-right">{taxText}</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">{totalText}</span>
      </div>

      <div className="mt-5 mb-2 w-full">
        <p className="mb-5">
          {/* Disclaimer */}
          <span className="text-xs">
            By clicking &quot;Place order&quot;, you accept our{" "}
            <a href="#" className="underline">
              terms and conditions
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              privacy policy
            </a>
          </span>
        </p>

        {errorMessage && <p className="text-red-700">{errorMessage}</p>}

        <button
          className={clsx({
            "btn-primary": !isPlacingOrder,
            "btn-disabled": isPlacingOrder,
          })}
          onClick={onPlaceOrder}
          //  href="/orders/123"
        >
          Place order
        </button>
      </div>
    </div>
  );
};
