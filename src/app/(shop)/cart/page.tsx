import { Title } from "@/components/ui/title/Title";
import { initialData } from "@/seed/seed";
import Link from "next/link";
import Image from "next/image";
import { QuantitySelector } from "@/components";
import { redirect } from "next/navigation";

const productsInCart = [
  initialData.products[0],
  // initialData.products[1],
  // initialData.products[2],
];

export default function CartPage() {
  // TODO: I will use this later
  // redirect("/empty");

  return (
    <div className="flex justify-center items-center mb-72 px-10 md:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title="Cart Shop" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <span className="text-xl font-medium">Add more items</span>
            <Link href="/" className="underline mb-5">
              Continue Shopping
            </Link>

            {productsInCart.map((product) => (
              <div key={product.slug} className="flex flex-col mt-5">
                <Image
                  src={`/products/${product.images[0]}`}
                  alt={product.title}
                  width={100}
                  height={100}
                  className="mr-5 rounded"
                />

                <div>
                  <p>{product.title}</p>
                  <p>${product.price}</p>
                  <QuantitySelector quantity={3} />
                  <button className="underline mt-3">Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* { checkout section } */}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2">Order Summary</h2>
            <div
              className="grid grid-cols-2
            "
            >
              <span className="text-lg">No. Products</span>
              <span className="text-right">{productsInCart.length} Items</span>

              <span className="text-lg">Subtotal</span>
              <span className="text-right">
                $
                {productsInCart.reduce(
                  (total, product) => total + product.price,
                  0,
                )}
              </span>

              <span className="text-lg">Tax</span>
              <span className="text-right">
                $
                {productsInCart
                  .reduce((total, product) => total + product.price * 0.1, 0)
                  .toFixed(2)}
              </span>

              <span className="text-lg">Total</span>
              <span className="text-right">
                $
                {productsInCart
                  .reduce((total, product) => total + product.price * 1.1, 0)
                  .toFixed(2)}
              </span>
            </div>

            <div className="mt-5 mb-2 w-full">
              <Link
                href="/checkout/address"
                className="flex btn-primary justify-center"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
