"use client";

import { generatePaginationNumbers } from "../../../utils";
import Link from "next/link";
import clsx from "clsx";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

interface Props {
  totalPages: number;
}

export const Pagination = ({ totalPages }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const pageString = searchParams.get("page") ?? 1;
  const currentPage = isNaN(+pageString) ? 1 : +pageString;

  if (currentPage < 1 || isNaN(+pageString)) {
    redirect(pathname);
  }

  const allPages = generatePaginationNumbers(currentPage, totalPages);

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);

    if (pageNumber === "...") {
      return `${pathname}?${params.toString()}`;
    }

    if (+pageNumber <= 0) {
      return `${pathname}`;
    }

    if (+pageNumber > totalPages) {
      return `${pathname}?${params.toString()}`;
    }

    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="mt-10 mb-14 flex justify-center px-2 sm:px-0">
      <nav aria-label="Pagination" className="max-w-full overflow-x-auto pb-1">
        <ul className="flex w-max items-center gap-1.5 sm:gap-2">
          <li>
            <Link
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-100 sm:h-10 sm:w-10 sm:rounded-xl"
              href={createPageUrl(currentPage - 1)}
            >
              <IoChevronBackOutline size={18} />
            </Link>
          </li>

          {allPages.map((page, index) => (
            <li key={`${page}-${index}`}>
              {page === "..." ? (
                <span className="flex h-9 min-w-9 items-center justify-center px-1.5 text-sm text-slate-400 sm:h-10 sm:min-w-10 sm:px-2 sm:text-base">
                  ...
                </span>
              ) : (
                <Link
                  className={clsx(
                    "flex h-9 min-w-9 items-center justify-center rounded-lg border px-2.5 text-sm font-semibold transition-colors sm:h-10 sm:min-w-10 sm:px-3 sm:text-base",
                    {
                      "border-blue-600 bg-blue-600 text-white":
                        page === currentPage,
                      "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100":
                        page !== currentPage,
                    },
                  )}
                  href={createPageUrl(page)}
                >
                  {page}
                </Link>
              )}
            </li>
          ))}

          <li>
            <Link
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-100 sm:h-10 sm:w-10 sm:rounded-xl"
              href={createPageUrl(currentPage + 1)}
            >
              <IoChevronForwardOutline size={18} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
