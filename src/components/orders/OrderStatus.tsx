"use client";

import clsx from "clsx";
import { IoCardOutline } from "react-icons/io5";

interface OrderStatusProps {
  order: {
    isPaid: boolean;
  };
}

export const OrderStatus = ({ order }: OrderStatusProps) => {
  return (
    <div
      className={clsx(
        "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
        {
          "bg-red-500": !order!.isPaid,
          "bg-green-700": order!.isPaid,
        },
      )}
    >
      <IoCardOutline size={30} />
      {/* <span className="mx-2">Pending payment</span> */}
      <span className="mx-2">{order!.isPaid ? "Paid" : "Pending payment"}</span>
    </div>
  );
};
