// import { notFound } from "next/navigation";

import { Title } from "@/components";
import ProductGrid from "@/components/products/product-grid/ProductGrid";
import { Product, categories } from "@/interfaces/product.interface";
import { initialData } from "@/seed/seed";

interface props {
  params: {
    id: string;
  };
}

const products = initialData.products as unknown as Product[];

export default async function CategoryByIdPage({ params }: props) {
  const { id } = await params;

  const productsLabels: Record<categories, string> = {
    men: "for Men",
    women: "for Women",
    kid: " for Kids",
    unisex: "for everyone",
  };

  // if (id === "kids") {
  //   notFound();
  // }
  return (
    <>
      <Title
        title="Products for"
        subtitle={`the best products ${productsLabels[id as categories]}`}
        className="mb-2"
      />
      <ProductGrid
        products={products.filter((product) => product.gender === id)}
      />
    </>
  );
}
