import { PrismaClient, Gender, Size } from "../src/generated/prisma";
import { initialData } from "../src/seed/seed";

const prisma = new PrismaClient();

async function main() {
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const categories = ["shirts", "pants", "hoodies", "hats"] as const;

  await prisma.category.createMany({
    data: categories.map((name) => ({ name })),
  });

  const dbCategories = await prisma.category.findMany({
    select: { id: true, name: true },
  });

  const categoryByName = new Map(dbCategories.map((c) => [c.name, c.id]));

  for (const item of initialData.products) {
    const categoryId = categoryByName.get(item.type);

    if (!categoryId) {
      throw new Error(`Missing category for product type: ${item.type}`);
    }

    await prisma.product.create({
      data: {
        title: item.title,
        description: item.description,
        inStock: item.inStock,
        price: item.price,
        size: item.sizes as Size[],
        slug: item.slug,
        tags: item.tags,
        gender: item.gender as Gender,
        categoryId,
        productImages: {
          create: item.images.map((image) => ({
            url: image,
          })),
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
