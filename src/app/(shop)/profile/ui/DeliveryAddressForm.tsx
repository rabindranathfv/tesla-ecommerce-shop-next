"use client";

import { setUserAddress } from "@/actions/address/set-user-address";
import type { Address, Country } from "@/interfaces";
import { useAddressStore } from "@/store";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  IoCallOutline,
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";

interface Props {
  initialAddress: Address;
  countries: Country[];
  loadError: boolean;
  ordersHref: string;
}

const inputClassName =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none";

export const DeliveryAddressForm = ({
  initialAddress,
  countries,
  loadError,
  ordersHref,
}: Props) => {
  const [address, setAddress] = useState(initialAddress);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const setCheckoutAddress = useAddressStore((state) => state.setSavedAddress);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<Address>({
    defaultValues: initialAddress,
  });
  const hasAddress = Boolean(address.address);
  const countryName = countries.find(
    (country) => country.id === address.country,
  )?.name;

  const startEditing = () => {
    reset(address);
    setError("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    reset(address);
    setError("");
    setIsEditing(false);
  };

  const handleSave = async (formValues: Address) => {
    setError("");

    try {
      const result = await setUserAddress(formValues);
      if (!result.ok) {
        setError(result.error ?? "We couldn’t save your address. Please try again.");
        return;
      }
      setAddress(formValues);
      setCheckoutAddress(formValues);
      reset(formValues);
      setIsEditing(false);
    } catch (saveError) {
      console.error("Failed to save delivery address", saveError);
      setError("We couldn’t save your address. Please try again.");
    }
  };

  return (
    <section className="rounded-xl bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <IoLocationOutline className="h-6 w-6 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-900">Delivery address</h2>
      </div>

      {loadError ? (
        <p className="text-sm text-red-700" role="alert">
          We couldn&apos;t load your saved address. Please try again later.
        </p>
      ) : isEditing ? (
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-gray-700">
              First name
              <input
                required
                autoComplete="given-name"
                className={inputClassName}
                {...register("firstName", { required: true })}
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Last name
              <input
                required
                autoComplete="family-name"
                className={inputClassName}
                {...register("lastName", { required: true })}
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-gray-700">
            Address
            <input
              required
              autoComplete="street-address"
              className={inputClassName}
              {...register("address", { required: true })}
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Address 2 (optional)
            <input
              autoComplete="address-line2"
              className={inputClassName}
              {...register("address2")}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-gray-700">
              Postal code
              <input
                required
                autoComplete="postal-code"
                className={inputClassName}
                {...register("postalCode", { required: true })}
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              City
              <input
                required
                autoComplete="address-level2"
                className={inputClassName}
                {...register("city", { required: true })}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-gray-700">
              Country
              <select
                required
                autoComplete="country"
                className={inputClassName}
                {...register("country", { required: true })}
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Phone number
              <input
                required
                type="tel"
                autoComplete="tel"
                className={inputClassName}
                {...register("phone", { required: true })}
              />
            </label>
          </div>

          {error && (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-gray-900 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save address"}
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={cancelEditing}
              className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : hasAddress ? (
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
        {!loadError && !isEditing && (
          <button
            type="button"
            onClick={startEditing}
            className="font-medium text-gray-900 underline underline-offset-4 hover:text-gray-600"
          >
            {hasAddress ? "Edit address" : "Add an address"}
          </button>
        )}
        <Link
          href={ordersHref}
          className="font-medium text-gray-900 underline underline-offset-4 hover:text-gray-600"
        >
          View orders
        </Link>
      </div>
    </section>
  );
};
