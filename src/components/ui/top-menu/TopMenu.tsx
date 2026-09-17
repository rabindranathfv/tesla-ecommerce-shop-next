"use client";

import Link from "next/link";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";
import { useUIStore } from "@/store";
import { useCartStore } from "@/store/ui/cart/cart-store";
import { useEffect, useState } from "react";

export default function TopMenu() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const openSideMenu = useUIStore((state) => state.openSideMenu);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updateLoading = () => setLoading(true);
    updateLoading();
  }, []);

  return (
    <nav className="flex px-5 justify-between items-center w-full">
      {/* logo */}
      <div>
        <Link href="/">
          <span className={`{titleFont.className} antialiased font-bold`}>
            Teslo Ecommerce shop
          </span>
        </Link>
      </div>

      {/* links by category */}
      <div className="hidden sm:block">
        <Link
          href="/gender/men"
          className="mr-2 p-2 rouded-md transition-all hover:bg-gray-100"
        >
          Men
        </Link>
        <Link
          href="/gender/women"
          className="mr-2 p-2 rouded-md transition-all hover:bg-gray-100"
        >
          Women
        </Link>
        <Link
          href="/gender/kid"
          className="mr-2 p-2 rouded-md transition-all hover:bg-gray-100"
        >
          Kid
        </Link>
      </div>

      {/* search card and menu */}
      <div className="flex items-center">
        <Link href="/search" className="mx-2">
          <IoSearchOutline className="w-5 h-5" />
        </Link>

        <Link
          href={totalItems > 0 && loading ? "/cart" : "/empty"}
          className="mx-2"
        >
          <div className="relative">
            <span className="absolute text-xs rounded-full px-1 font-bold -top-2 bg-blue-700 text-white -right-2">
              {totalItems}
            </span>
            {/* Removed because it's now conditionally rendered above */}
            <IoCartOutline className="w-5 h-5" />
          </div>
        </Link>

        <button
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          onClick={() => openSideMenu()}
        >
          Menu
        </button>
      </div>
    </nav>
  );
}
