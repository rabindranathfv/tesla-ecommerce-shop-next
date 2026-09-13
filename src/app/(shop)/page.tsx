import { Title } from "@/components";
import { initialData } from "@/seed/seed";
import { Product } from "@/interfaces/product.interface";
import { getPaginatesProductsWithImages } from "@/actions";
import ProductGrid from "@/components/products/product-grid/ProductGrid";

const productsT1 = initialData.products as unknown as Product[];

export default async function Home() {
  const { products } = await getPaginatesProductsWithImages();
  console.log(`PRODUCTTEMP: ${products.length}`);
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
