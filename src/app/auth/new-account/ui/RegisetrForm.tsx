"use client";

import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { registerUser } from "@/actions";

type FormInputs = {
  name: string;
  email: string;
  password: string;
};

const RegisetrForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
    // TODO: Wire to your create-user action.
    const { name, email, password } = data;
    const resp = await registerUser(name, email, password);
    if (!resp.ok) {
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <label htmlFor="name">Full name</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="text"
        autoFocus
        id="name"
        {...register("name", {
          required: "Full name is required",
          minLength: {
            value: 2,
            message: "Full name must be at least 2 characters",
          },
        })}
      />
      {errors.name && (
        <span className="text-sm text-red-600 -mt-4 mb-4">
          {errors.name.message}
        </span>
      )}

      <label htmlFor="email">Email</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="email"
        id="email"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email",
          },
        })}
      />
      {errors.email && (
        <span className="text-sm text-red-600 -mt-4 mb-4">
          {errors.email.message}
        </span>
      )}

      <label htmlFor="password">Password</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="password"
        id="password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
      />
      {errors.password && (
        <span className="text-sm text-red-600 -mt-4 mb-4">
          {errors.password.message}
        </span>
      )}

      <button type="submit" className="btn-primary">
        Create Account
      </button>

      {/* divisor line */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">Or</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/login" className="btn-secondary text-center">
        Sign In
      </Link>
    </form>
  );
};

export default RegisetrForm;
