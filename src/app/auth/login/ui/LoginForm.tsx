"use client";

import { authenticate } from "@/actions";
import Link from "next/link";
import { useActionState } from "react";

export const LoginForm = () => {
  const [state, dispatch] = useActionState(authenticate, undefined);
  console.log(`STATE: ${state}`);
  return (
    <form action={dispatch} className="flex flex-col">
      <label htmlFor="email">Email</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="email"
        id="email"
        name="email"
      />

      <label htmlFor="password">Password</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="password"
        id="password"
        name="password"
      />

      <button type="submit" className="btn-primary">
        Sign In
      </button>

      {/* divisor line */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">Or</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/new-account" className="btn-secondary text-center">
        Create a new account
      </Link>
    </form>
  );
};
