"use client";
import { SessionProvider } from "next-auth/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
        currency: "EUR",
        intent: "capture",
      }}
    >
      <SessionProvider>{children}</SessionProvider>
    </PayPalScriptProvider>
  );
};
