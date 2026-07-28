import { initialData } from "./seed";
import { prisma } from "../lib/prisma";

async function main() {
  // 1. delete previous data
  // await Promise.all( [
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  // ]);

  const { products, categories } = initialData;

  const categoriesData = categories.map((name: string) => ({ name }));

  await prisma.category.createMany({
    data: categoriesData,
  });

  const categoriesDB = await prisma.category.findMany();

  const categoriesMap = categoriesDB.reduce(
    (map: Record<string, string>, category: { id: string; name: string }) => {
      map[category.name.toLowerCase()] = category.id;
      return map;
    },
    {} as Record<string, string>,
  ); //<string=shirt, string=categoryID>

  // Products

  for (const product of products) {
    const { type, images, sizes, ...rest } = product;

    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        size: sizes,
        categoryId: categoriesMap[type],
      },
    });

    // Images
    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id,
    }));

    await prisma.productImage.createMany({
      data: imagesData,
    });
  }

  console.log("apply seed data in DB successfully");
}

(() => {
  if (process.env.NODE_ENV === "production") return;

  main();
})();
