import { onAuthenticate } from "@/actions";
import { redirect } from "next/navigation";

const page = async () => {
  const response = await onAuthenticate();

  // Successful authentication
  if (response.status === 200 || response.status === 201) {
    if (response.data?.workspaces && response.data.workspaces.length > 0) {
      redirect(`/dashboard/${response.data.workspaces[0].id}`);
    }
    // If no workspaces, redirect to a default page
    redirect("/dashboard");
  }

  // Any other status redirects to sign-in
  redirect("/auth/sign-in");
};

export default page;
