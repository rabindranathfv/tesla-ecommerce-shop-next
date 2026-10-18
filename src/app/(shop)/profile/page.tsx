import { auth } from "@/auth.config";
import { Title } from "@/components";
import { getCountries } from "@/actions/country/get-countries";
import { getUserAddress } from "@/actions/address/get-user-address";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  IoCallOutline,
  IoIdCardOutline,
  IoLocationOutline,
  IoMailOutline,
  IoPersonOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";

const ProfilePage = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const [addressResult, countries] = await Promise.all([
    getUserAddress(session.user.id),
    getCountries(),
  ]);

  const address = addressResult.ok ? addressResult.data : undefined;
  const countryName =
    address &&
    countries.find((country) => country.id === address.country)?.name;
  const hasAddress = Boolean(address?.address);
  const initials = session.user.name.trim().charAt(0).toUpperCase();

  return (
    <div className="mx-auto mb-20 w-full max-w-5xl px-2 sm:px-0">
      <Title title="Profile" />

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-xl bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-7 flex items-center gap-4">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={`${session.user.name}'s profile picture`}
                width={72}
                height={72}
                unoptimized
                className="h-[72px] w-[72px] rounded-full object-cover"
              />
            ) : (
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gray-100 text-2xl font-semibold text-gray-700">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <h2 className="break-words text-2xl font-semibold text-gray-900">
                {session.user.name}
              </h2>
              <span className="mt-1 inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm capitalize text-gray-700">
                {session.user.role}
              </span>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex gap-3">
              <IoMailOutline className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Email</p>
                <p className="break-all font-medium text-gray-900">
                  {session.user.email}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <IoShieldCheckmarkOutline className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email verification</p>
                <p className="font-medium text-gray-900">
                  {session.user.emailVerified ? "Verified" : "Not verified"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <IoIdCardOutline className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
              <div className="min-w-0">
                <p className="text-sm text-gray-500">User ID</p>
                <p className="break-all font-mono text-sm text-gray-900">
                  {session.user.id}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <IoLocationOutline className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Delivery address
            </h2>
          </div>

          {!addressResult.ok ? (
            <p className="text-sm text-red-700">
              We couldn&apos;t load your saved address. Please try again later.
            </p>
          ) : hasAddress && address ? (
            <div className="space-y-4 text-gray-700">
              <div className="flex gap-3">
                <IoPersonOutline className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
                <p className="font-medium text-gray-900">
                  {address.firstName} {address.lastName}
                </p>
              </div>
              <div className="flex gap-3">
                <IoLocationOutline className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
                <div>
                  <p>{address.address}</p>
                  {address.address2 && <p>{address.address2}</p>}
                  <p>
                    {address.postalCode} {address.city}
                  </p>
                  <p>{countryName ?? "Country unavailable"}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <IoCallOutline className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
                <p>{address.phone}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">
              You haven&apos;t saved a delivery address yet.
            </p>
          )}

          <div className="mt-7 flex flex-wrap gap-4 border-t border-gray-200 pt-5">
            <Link
              href="/checkout/address"
              className="font-medium text-gray-900 underline underline-offset-4 hover:text-gray-600"
            >
              {hasAddress ? "Edit address" : "Add an address"}
            </Link>
            <Link
              href={
                session?.user.role === "admin" ? "/admin/orders" : "/orders"
              }
              className="font-medium text-gray-900 underline underline-offset-4 hover:text-gray-600"
            >
              View orders
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
