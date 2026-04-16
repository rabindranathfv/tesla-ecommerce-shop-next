import Link from "next/link";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";

export default function TopMenu() {
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
          href="/category/men"
          className="mr-2 p-2 rouded-md transition-all hover:bg-gray-100"
        >
          Men
        </Link>
        <Link
          href="/category/women"
          className="mr-2 p-2 rouded-md transition-all hover:bg-gray-100"
        >
          Women
        </Link>
        <Link
          href="/category/kids"
          className="mr-2 p-2 rouded-md transition-all hover:bg-gray-100"
        >
          Kids
        </Link>
      </div>

      {/* search card and menu */}
      <div className="flex items-center">
        <Link href="/search" className="mx-2">
          <IoSearchOutline className="w-5 h-5" />
        </Link>

        <Link href="/cart" className="mx-2">
          <div className="relative">
            <span className="absolute text-xs rounded-full px-1 font-bold -top-2 bg-blue-700 text-white -right-2">
              31
            </span>
            <IoCartOutline className="w-5 h-5" />
          </div>
        </Link>

        <button className="m-2 p-2 rounded-md transition-all hover:bg-gray-100">
          Menu
        </button>
      </div>
    </nav>
  );
}
