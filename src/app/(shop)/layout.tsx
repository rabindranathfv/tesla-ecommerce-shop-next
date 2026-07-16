import { Sidebar } from "@/components/sidebar/Sidebar";
import TopMenu from "@/components/ui/top-menu/TopMenu";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen ">
      <TopMenu />
      <Sidebar />
      <div className="px-2 sm:px-10">{children}</div>
    </main>
  );
}
