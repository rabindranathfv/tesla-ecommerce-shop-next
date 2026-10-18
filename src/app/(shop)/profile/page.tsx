import { auth } from "@/auth.config";
import { Title } from "@/components";
import { getCountries } from "@/actions/country/get-countries";
import { getUserAddress } from "@/actions/address/get-user-address";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  IoIdCardOutline,
  IoMailOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { DeliveryAddressForm } from "./ui/DeliveryAddressForm";

const ProfilePage = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const [addressResult, countries] = await Promise.all([
    getUserAddress(session.user.id),
    getCountries(),
  ]);

  const address =
    addressResult.ok && addressResult.data
      ? addressResult.data
      : {
          firstName: "",
          lastName: "",
          address: "",
          address2: "",
          postalCode: "",
          city: "",
          country: "",
          phone: "",
        };
  const initials = session.user.name.trim().charAt(0).toUpperCase();

  return (
    <div className="mx-auto mb-20 w-full max-w-5xl px-2 sm:px-0">
      <Title title="Profile" />

      <div className="flex flex-col gap-6">
        <section className="rounded-xl bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex items-center gap-4">
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="flex min-w-0 items-start gap-3 rounded-lg bg-gray-50 p-4">
              <IoMailOutline className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Email</p>
                <p className="break-all font-medium text-gray-900">
                  {session.user.email}
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-start gap-3 rounded-lg bg-gray-50 p-4">
              <IoShieldCheckmarkOutline className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Email verification</p>
                <p className="font-medium text-gray-900">
                  {session.user.emailVerified ? "Verified" : "Not verified"}
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-start gap-3 rounded-lg bg-gray-50 p-4">
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

        <DeliveryAddressForm
          initialAddress={address}
          countries={countries}
          loadError={!addressResult.ok}
          ordersHref={
            session.user.role === "admin" ? "/admin/orders" : "/orders"
          }
        />
      </div>
    </div>
  );
};

export default ProfilePage;
