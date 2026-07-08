import { notFound } from "next/navigation";

interface props {
  params: {
    id: string;
  };
}

export default async function CategoryByIdPage({ params }: props) {
  const { id } = await params;

  if (id === "kids") {
    notFound();
  }
  return (
    <div>
      <h1>Category By ID Page with ID: {id}</h1>
    </div>
  );
}
