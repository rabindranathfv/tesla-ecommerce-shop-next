import { Title } from "@/components/ui/title/Title";
import Link from "next/link";
import { ProductInCart } from "./ui/ProductInCart";
import { OrderSummary } from "./ui/OrderSummary";

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

            <ProductInCart />
          </div>

          {/* { checkout section } */}
          <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
            <h2 className="text-2xl mb-2">Order Summary</h2>
            <div
              className="grid grid-cols-2
            "
            >
              <OrderSummary />
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
