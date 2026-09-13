import { Title } from "@/components";
import { getPaginatesProductsWithImages } from "@/actions";
import ProductGrid from "@/components/products/product-grid/ProductGrid";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Home({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams?.page
    ? parseInt(resolvedSearchParams.page, 10)
    : 1;

  const { products } = await getPaginatesProductsWithImages({ page });

  if (products.length === 0) {
    redirect("/");
  }

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
