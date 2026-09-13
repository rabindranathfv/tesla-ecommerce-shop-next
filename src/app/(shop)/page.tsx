import { Pagination, Title } from "@/components";
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
  const pageParam = resolvedSearchParams?.page;
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  if (isNaN(page) || page < 1) {
    redirect("/");
  }

  const { products, currentPage, totalPages } =
    await getPaginatesProductsWithImages({
      page,
    });

  if (totalPages > 0 && currentPage > totalPages) {
    redirect(`/?page=${totalPages}`);
  }

  return (
    <>
      <Title
        title="Welcome to Our Shop"
        subtitle="Find the best products here"
        className="mb-2"
      />
      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
