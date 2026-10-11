import { auth } from "@/auth.config";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

const AdminLayout = async ({ children }: Props) => {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    redirect("/auth/login");
  }
  return <>{children}</>;
};

export default AdminLayout;
