"use client";

import { Category, Product, ProductImage } from "@/interfaces";
import { createUpdateProduct, deleteProductImage } from "@/actions";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ProductImage as ProductImageComponent } from "@/components";
import clsx from "clsx";
import { useState } from "react";
import { IoCloudUploadOutline, IoImagesOutline } from "react-icons/io5";

interface Props {
  product: Partial<Product> & { productImages?: ProductImage[] };
  categories: Category[];
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: string[];
  tags: string; // camisa, t-shirt, etc
  gender: "men" | "women" | "kid" | "unisex";
  categoryId: string;

  images: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    getValues,
    resetField,
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      sizes: product.sizes ?? [],
      tags: product.tags?.join(", ") ?? "",

      images: undefined,
    },
  });
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [deleteError, setDeleteError] = useState("");

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData();

    const { images, ...productToSave } = data;

    if (product.id) {
      formData.append("id", product.id?.toString() ?? "");
    }
    formData.append("title", productToSave.title);
    formData.append("slug", productToSave.slug);
    formData.append("description", productToSave.description);
    formData.append("price", productToSave.price.toString());
    formData.append("inStock", productToSave.inStock.toString());
    formData.append("sizes", productToSave.sizes.toString());
    formData.append("tags", productToSave.tags);
    formData.append("gender", productToSave.gender);
    formData.append("categoryId", productToSave.categoryId);

    if (images) {
      for (let i = 0; i < images.length; i++) {
        const element = images[i];
        formData.append("images", element);
      }
    }

    const { ok, product: savedProduct } = await createUpdateProduct(formData);

    if (!ok) {
      alert("Failed to save product");
      return;
    }
    resetField("images");
    router.replace(`/admin/product/${savedProduct?.slug}`);
  };

  const onDeleteProductImage = async (imageId: number, imageUrl: string) => {
    setDeletingImageId(imageId);
    setDeleteError("");

    try {
      const result = await deleteProductImage(imageId, imageUrl);
      if (!result.ok) {
        setDeleteError(result.message);
        return;
      }

      setDeletedImageIds((current) => [...current, imageId]);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete product image:", error);
      setDeleteError("Failed to delete image. Please try again.");
    } finally {
      setDeletingImageId(null);
    }
  };

  const selectedImageCount = watch("images")?.length ?? 0;

  watch("sizes"); // to re-render the component when sizes change

  const onSizeChange = (size: string) => {
    const sizes = new Set(getValues("sizes"));
    if (sizes.has(size)) {
      sizes.delete(size);
    } else {
      sizes.add(size);
    }
    setValue("sizes", Array.from(sizes));
  };

  return (
    <form
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Text fields */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Title</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("title", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("slug", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Description</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200"
            {...register("description", { required: true })}
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Price</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("price", { required: true, min: 0 })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("tags", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Gender</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register("gender", { required: true })}
          >
            <option value="">[Select]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="flex flex-col mb-2">
          <span>Category</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register("categoryId", { required: true })}
          >
            <option value="">[Select]</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={clsx("btn-primary w-full", {
            "cursor-not-allowed opacity-60": isSubmitting,
          })}
        >
          {isSubmitting ? "Saving product..." : "Save"}
        </button>
      </div>

      {/* Sizes and images selector */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Stock</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("inStock", { required: true, min: 0 })}
          />
        </div>

        {/* As checkboxes */}
        <div className="flex flex-col">
          <span>Sizes</span>
          <div className="flex flex-wrap">
            {sizes.map((size) => (
              // bg-blue-500 text-white <--- if selected
              <div
                key={size}
                onClick={() => onSizeChange(size)}
                className={clsx(
                  "p-2 border cursor-pointer rounded-md mr-2 mb-2 w-14 transition-all text-center",
                  {
                    "bg-blue-500 text-white":
                      getValues("sizes")?.includes(size),
                  },
                )}
              >
                <span>{size}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col mb-2">
            <span>Images</span>
            <input
              type="file"
              multiple
              className="p-2 border rounded-md bg-gray-200"
              accept="image/png, image/jpeg, image/avif"
              {...register("images")}
            />
            {selectedImageCount > 0 && (
              <p
                className="mt-2 flex items-center gap-2 text-sm text-gray-600"
                role="status"
              >
                {isSubmitting ? (
                  <>
                    <IoCloudUploadOutline className="h-5 w-5 shrink-0 animate-pulse" />
                    Uploading {selectedImageCount}{" "}
                    {selectedImageCount === 1 ? "image" : "images"}...
                  </>
                ) : (
                  <>
                    <IoImagesOutline className="h-5 w-5 shrink-0" />
                    {selectedImageCount}{" "}
                    {selectedImageCount === 1 ? "image" : "images"} selected
                    for upload
                  </>
                )}
              </p>
            )}
          </div>

          {deleteError && (
            <p className="text-sm text-red-700" role="alert">
              {deleteError}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {product.productImages
              ?.filter((image) => !deletedImageIds.includes(image.id))
              .map((image) => (
                <div key={image.id}>
                <ProductImageComponent
                  alt={product.title ?? ""}
                  src={image.url}
                  width={300}
                  height={300}
                  className="rounded-t shadow-md"
                />

                <button
                  type="button"
                  onClick={() => onDeleteProductImage(image.id, image.url)}
                  disabled={deletingImageId !== null}
                  aria-busy={deletingImageId === image.id}
                  className={clsx("btn-danger w-full rounded-b-xl", {
                    "cursor-not-allowed opacity-60": deletingImageId !== null,
                  })}
                >
                  {deletingImageId === image.id ? "Deleting..." : "Remove"}
                </button>
              </div>
              ))}
          </div>
          <p className="text-sm text-gray-500">
            You can upload multiple images for the product.
          </p>
        </div>
      </div>
    </form>
  );
};
