"use client";

import { QuantitySelector, SizeSelector } from "@/components";
import type {
  CartProduct,
  Product,
  Size,
} from "@/interfaces/product.interface";
import { useCartStore } from "@/store/ui/cart/cart-store";
import { useState } from "react";

interface AddToCartProps {
  product: Product;
}

const AddToCart = ({ product }: AddToCartProps) => {
  const addProductToCart = useCartStore((state) => state.addProductToCart);

  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [showSizeError, setShowSizeError] = useState<boolean>(false);

  const addToCart = () => {
    setShowSizeError(true);

    if (!size) return;
    const cartProduct: CartProduct = {
      price: product.price,
      size: size!,
      quantity,
      id: product.id,
      slug: product.slug,
      title: product.title,
      image: product.images[0],
    };

    addProductToCart(cartProduct);
    setShowSizeError(false);

    setQuantity(1);
    setSize(undefined);
  };

  return (
    <>
      {showSizeError && !size && (
        <span className="mt-2 text-red-700">Please select a size</span>
      )}

      <SizeSelector
        selectedSize={size}
        availableSizes={product.sizes}
        onSizeChanged={setSize}
      />

      <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity} />

      {/* Button */}
      <button className="btn-primary my-5" onClick={addToCart}>
        Add to cart
      </button>
    </>
  );
};

export default AddToCart;
