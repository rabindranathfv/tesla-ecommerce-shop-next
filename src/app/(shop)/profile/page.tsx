import { auth } from "@/auth.config";
import { Title } from "@/components";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const session = await auth();
  if (!session?.user) {
    // redirect("/auth/login?returnto=/profile");
    redirect("/");
  }

  return (
    <div>
      <Title title="Profile" />
    </div>
  );
};

export default ProfilePage;
