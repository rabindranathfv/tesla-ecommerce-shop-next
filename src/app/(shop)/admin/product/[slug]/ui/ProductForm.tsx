"use client";

import { Category, Product, ProductImage } from "@/interfaces";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { ProductImage as ProductImageComponent } from "@/components";
import clsx from "clsx";

interface Props {
  product: Product & { productImages?: ProductImage[] };
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

  // TODO: Images
  // images: File[];
}

export const ProductForm = ({ product, categories }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      sizes: product.sizes ?? [],
      tags: product.tags.join(", "),
    },
  });

  const onSubmit = (data: FormInputs) => {
    console.log(data);
  };

  const deleteProductImage = (imageId: number, imageUrl: string) => {
    console.log("Deleting image:", imageId, imageUrl);
  };

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

        <button className="btn-primary w-full">Save</button>
      </div>

      {/* Sizes and images selector */}
      <div className="w-full">
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
              accept="image/png, image/jpeg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {product.productImages?.map((image) => (
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
                  onClick={() => deleteProductImage(image.id, image.url)}
                  className="btn-danger w-full rounded-b-xl"
                >
                  Remove
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
