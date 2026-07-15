import { Product } from "@/interfaces";
import Image from "next/image";
import Link from "next/link";

interface ProductGridItemProps {
  product: Product;
}

export const ProductGridItem = ({ product }: ProductGridItemProps) => {
  return (
    <div className="rounded-md overflow-hidden fade-in">
      <Link href={`/product/${product.slug}`}>
        <Image
          src={`/products/${product.images[0]}`}
          className="w-full object-cover"
          alt={product.title}
          width={500}
          height={500}
        />
      </Link>
      <div className="p-4 flex flex-col">
        <Link href={`/product/${product.slug}`} className="hover:text-blue-600">
          {product.title}
        </Link>
        <span className="font-bold">${product.price}</span>
      </div>
    </div>
  );
};
