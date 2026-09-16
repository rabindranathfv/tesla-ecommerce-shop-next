"use client";

import { QuantitySelector, SizeSelector } from "@/components";
import { Product, Size } from "@/interfaces/product.interface";
import { useState } from "react";

interface AddToCartProps {
  product: Product;
}

const AddToCart = ({ product }: AddToCartProps) => {
  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [showSizeError, setShowSizeError] = useState<boolean>(false);

  const addToCart = () => {
    setShowSizeError(true);

    if (!size) return;

    setShowSizeError(false);
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
