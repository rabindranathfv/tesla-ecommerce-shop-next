import { Pagination, Title } from "@/components";
import { getPaginatesProductsWithImages } from "@/actions";
import ProductGrid from "@/components/products/product-grid/ProductGrid";
import { categories } from "@/interfaces/product.interface";
import type { Gender } from "@/generated/prisma/enums";
import { redirect } from "next/navigation";

interface props {
  params: Promise<{
    gender: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function GenderByPage({ params, searchParams }: props) {
  const { gender } = await params;
  const resolvedSearchParams = await searchParams;

  const page = resolvedSearchParams?.page
    ? parseInt(resolvedSearchParams.page, 10)
    : 1;

  if (isNaN(page) || page < 1) {
    redirect(`/gender/${gender}`);
  }

  const { products, currentPage, totalPages } =
    await getPaginatesProductsWithImages({
      page,
      gender: gender as Gender,
    });

  if (totalPages > 0 && currentPage > totalPages) {
    redirect(`/gender/${gender}?page=${totalPages}`);
  }

  const productsLabels: Record<categories, string> = {
    men: "for Men",
    women: "for Women",
    kid: " for Kids",
    unisex: "for everyone",
  };

  return (
    <>
      <Title
        title="Products for"
        subtitle={`the best products ${productsLabels[gender as categories]}`}
        className="mb-2"
      />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  );
}
