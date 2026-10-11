export const revalidate = 0;

// https://tailwindcomponents.com/component/hoverable-table
import { Pagination, Title } from "@/components";

import Link from "next/link";
import { redirect } from "next/navigation";
import { IoCardOutline } from "react-icons/io5";
import { UsersTable } from "./ui/UsersTable";
import { getUsers } from "@/actions";

export default async function UsersPage() {
  const { ok, users = [] } = await getUsers();

  if (!ok) {
    redirect("/auth/login");
  }

  return (
    <>
      <Title title="User management" />

      <div className="mb-10">
        <UsersTable users={users} />

        {/* TODO: Pagination it is not implemented yet */}
        <Pagination totalPages={1} />
      </div>
    </>
  );
}
