"use client";

import { useCartStore } from "@/store/cart/cart-store";
import { CartProduct } from "@/interfaces/product.interface";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { currencyFormat } from "@/utils";
import { ProductImage } from "@/components/products/product-image/ProductImage";

export const CheckoutProductInCart = () => {
  const router = useRouter();
  const products: CartProduct[] = useCartStore((state) => state.cart);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadingReady = () => setLoading(true);
    loadingReady();
  }, [products]);

  useEffect(() => {
    if (loading && products.length === 0) {
      router.replace("/empty");
    }
  }, [loading, products.length, router]);

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
          <ProductImage
            src={product.image}
            alt={product.title}
            width={100}
            height={100}
            className="mr-5 rounded"
          />

          <div>
            <span>
              ({product.size}) - {product.title} ({product.quantity})
            </span>
            <p className="font-bold">
              {currencyFormat(product.price * product.quantity)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
