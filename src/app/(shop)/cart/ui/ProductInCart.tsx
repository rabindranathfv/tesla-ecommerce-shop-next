"use client";

import { ProductImage } from "@/components/products/product-image/ProductImage";
import Link from "next/link";

import { useCartStore } from "@/store/cart/cart-store";
import { QuantitySelector } from "@/components";
import { CartProduct } from "@/interfaces/product.interface";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getProductImagesByIds } from "@/actions/products/get-product-images-by-ids";

export const ProductInCart = () => {
  const router = useRouter();
  const pathname = usePathname();
  const products: CartProduct[] = useCartStore((state) => state.cart);
  console.log(`PRODUCTS: ${JSON.stringify(products)}`);
  const updateProductInCart = useCartStore(
    (state) => state.updateProductInCart,
  );
  const removeProduct = useCartStore((state) => state.removeProduct);
  const updateProductImage = useCartStore((state) => state.updateProductImage);
  const [loading, setLoading] = useState<boolean>(false);
  const [failedImageIds, setFailedImageIds] = useState<string[]>([]);
  const productIdsKey = [...new Set(products.map((product) => product.id))].join(
    ",",
  );
  const productIds = productIdsKey ? productIdsKey.split(",") : [];
  const imageLoadError = failedImageIds.some((id) =>
    productIds.includes(id),
  );

  useEffect(() => {
    const productIds = productIdsKey ? productIdsKey.split(",") : [];
    if (productIds.length === 0) return;

    let isActive = true;

    void getProductImagesByIds(productIds)
      .then((result) => {
        if (!isActive) return;
        if (!result.ok || !result.products) {
          setFailedImageIds(productIds);
          return;
        }

        setFailedImageIds([]);
        result.products.forEach(({ id, image }) => {
          updateProductImage(id, image);
        });
      })
      .catch((error) => {
        console.error("Failed to refresh cart product images", error);
        if (isActive) setFailedImageIds(productIds);
      });

    return () => {
      isActive = false;
    };
  }, [pathname, productIdsKey, updateProductImage]);

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
      {imageLoadError && (
        <p className="text-sm text-red-700" role="alert">
          Some product images couldn&apos;t be loaded. Please refresh the cart.
        </p>
      )}
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
            <Link
              className="hover:underline cursor-pointer"
              href={`/product/${product.slug}`}
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
