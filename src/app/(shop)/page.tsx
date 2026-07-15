import { Title } from "@/components";
import { initialData } from "@/seed/seed";
import { Product } from "@/interfaces/product.interface";
import ProductGrid from "@/components/products/product-grid/ProductGrid";

const products = initialData.products as unknown as Product[];

export default function Home() {
  return (
    <>
      <Title
        title="Welcome to Our Shop"
        subtitle="Find the best products here"
        className="mb-2"
      />
      <ProductGrid products={products} />
    </>
  );
}
