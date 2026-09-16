export interface Product {
  // for run npm run seed comment this id
  id: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: Size[];
  slug: string;
  tags: string[];
  title: string;
  //TODO: type: ValidTypes;
  gender: categories;
}

export interface CartProduct {
  id: string;
  price: number;
  slug: string;
  quantity: number;
  size: Size;
  title: string;
  image: string;
}

export type categories = "men" | "women" | "kid" | "unisex";
export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL";
export type ValidTypes = "shirts" | "pants" | "hoodies" | "hats";
