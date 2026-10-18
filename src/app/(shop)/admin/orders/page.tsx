// https://tailwindcomponents.com/component/hoverable-table
import { Title } from "@/components";
import { redirect } from "next/navigation";

import Link from "next/link";
import { IoCardOutline } from "react-icons/io5";
import clsx from "clsx";
import { getOrders } from "@/actions";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const { ok, orders } = await getOrders();

  if (!ok) {
    redirect("/auth/login");
  }

  return (
    <>
      <Title title="Orders" />

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                #ID
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Full Name
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Status
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Options
              </th>
            </tr>
          </thead>
          <tbody>
            {orders?.length ? (
              orders.map((order) => {
                return (
                  <tr
                    key={order.id}
                    className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id.split("-")[0]}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {order!.orderAddresses!.firstName}{" "}
                      {order!.orderAddresses!.lastName}
                    </td>
                    <td className="flex items-center text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      <IoCardOutline
                        className={clsx(
                          order!.isPaid ? "text-green-800" : "text-red-800",
                        )}
                      />
                      <span
                        className={clsx(
                          "mx-2",
                          order!.isPaid ? "text-green-800" : "text-red-800",
                        )}
                      >
                        {order!.isPaid ? "Paid" : "Not Paid"}
                      </span>
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 ">
                      <Link
                        href={`/orders/${order.id}`}
                        className="hover:underline"
                      >
                        Review order
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
