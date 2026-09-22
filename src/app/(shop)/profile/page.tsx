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
      <h3>Role: {session.user.role}</h3>
    </div>
  );
};

export default ProfilePage;
