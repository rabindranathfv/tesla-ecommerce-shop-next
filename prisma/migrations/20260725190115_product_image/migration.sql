-- CreateTable
CREATE TABLE "productImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "productImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "productImage" ADD CONSTRAINT "productImage_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
