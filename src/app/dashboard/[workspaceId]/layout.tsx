import { onAuthenticate, verifyAccessToWorkspace } from "@/actions";
import { AppSidebar } from "@/components/global/Sidebar";
import { TopNavbar } from "@/components/global/TopNavbar";
import { SidebarInset } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  params: { workspaceId: string };
};
export default async function RootLayout({
  children,
  params: { workspaceId },
}: Props) {
  // const auth = await onAuthenticate();
  // if (!auth.data?.workspaces) return redirect("/auth/sign-in");
  // if (!auth.data?.workspaces.length) return redirect("/auth/sign-in");

  // const hasAccess = await verifyAccessToWorkspace(workspaceId);
  // if (hasAccess.status !== 200) {
  //   return redirect(`/dashboard/${auth.data?.workspaces[0].id}`);
  // }
  // if (!hasAccess.data) return null;
  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-background to-background/95">
      <AppSidebar activeWorkspaceId={workspaceId} />
      <SidebarInset>
        <div className="flex flex-col h-full">
          <TopNavbar />
          {children}
        </div>
      </SidebarInset>
    </div>
  );
}
