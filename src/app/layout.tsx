import type { Metadata } from "next";
import "./globals.css";
import { inter } from "@/config/fonts";
import { Provider } from "@/components/provider/Provider";

export const metadata: Metadata = {
  title: {
    template: "%s - Teslo Ecommerce | Shop Next",
    default: "Home",
  },
  description: "Ecommerce shop to buy your favorites products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
