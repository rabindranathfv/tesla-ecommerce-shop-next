import { getCategories, getProductBySlug } from "@/actions";
import { Title } from "@/components";
import { ProductForm } from "./ui/ProductForm";
import { redirect } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const [product, categories] = await Promise.all([
    getProductBySlug(slug),
    getCategories(),
  ]);

  if (!product && slug !== "new") {
    redirect("/admin/products");
  }

  const title = slug === "new" ? "Create Product" : "Edit Product";
  return (
    <>
      <Title title={title} />

      <ProductForm product={product || {}} categories={categories} />
    </>
  );
}
