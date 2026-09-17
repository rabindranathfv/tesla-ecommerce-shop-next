"use client";

import Image from "next/image";
import Link from "next/link";

import { useCartStore } from "@/store/ui/cart/cart-store";
import { QuantitySelector } from "@/components";
import { CartProduct } from "@/interfaces/product.interface";
import { useEffect, useState } from "react";

export const ProductInCart = () => {
  const products: CartProduct[] = useCartStore((state) => state.cart);
  const updateProductInCart = useCartStore(
    (state) => state.updateProductInCart,
  );
  const removeProduct = useCartStore((state) => state.removeProduct);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadingReady = () => setLoading(true);
    loadingReady();
  }, [products]);

  if (!loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {products.map((product) => (
        <div
          key={`${product.slug}-${product.size}`}
          className="flex flex-col mt-5"
        >
          <Image
            src={`/products/${product.image}`}
            alt={product.title}
            width={100}
            height={100}
            className="mr-5 rounded"
          />

          <div>
            <Link
              className="hover:underline cursor-pointer"
              href={`/products/${product.slug}`}
            >
              ({product.size}) - {product.title}
            </Link>
            <p>${product.price}</p>
            {loading && product.quantity > 0 && (
              <QuantitySelector
                quantity={product.quantity}
                onQuantityChanged={(newQuantity: number) =>
                  updateProductInCart(product, newQuantity)
                }
              />
            )}

            <button
              className="underline mt-3"
              onClick={() => removeProduct(product, product.size)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </>
  );
};
