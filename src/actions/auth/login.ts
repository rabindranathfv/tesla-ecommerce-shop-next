"use server";

import { signIn } from "@/auth.config";
import { AuthError } from "next-auth";

// ...

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirect: false,
    });

    return "Success";
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export const login = async (email: string, password: string) => {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return {
        ok: false,
        message: "Invalid credentials.",
      };
    }

    return {
      ok: true,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        ok: false,
        message:
          error.type === "CredentialsSignin"
            ? "Invalid credentials."
            : "Error logging in, please try again.",
      };
    }

    console.error("Error logging in:", error);
    return {
      ok: false,
      message: "Error logging in, please try again.",
    };
  }
};
