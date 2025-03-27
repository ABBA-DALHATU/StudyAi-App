"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Book,
  Brain,
  Clock,
  FileText,
  Home,
  Plus,
  Settings,
  Users,
  Sparkles,
  ChevronDown,
  UserPlus,
  Trophy,
  Flame,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { InviteModal } from "../pages/workspace/InviteModal";
import { getWorkspaces } from "@/actions";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import { AddWorkspaceModal } from "../pages/workspace/add-workspace-modal";

// Mock data for workspaces
// const privateWorkspaces = [
//   { id: "1", name: "Math 101", type: "PRIVATE", unread: 2 },
//   { id: "2", name: "Physics Notes", type: "PRIVATE", unread: 0 },
//   { id: "3", name: "Programming", type: "PRIVATE", unread: 5 },
// ];

// const publicWorkspaces = [
//   { id: "4", name: "Study Group A", type: "PUBLIC", unread: 3 },
//   { id: "5", name: "Biology Class", type: "PUBLIC", unread: 0 },
// ];

type WorkspaceType = {
  id: string;
  name: string;
  type: "PUBLIC" | "PRIVATE";
};

type WorkspaceSelectQuery = {
  workspace: {
    name: string;
    id: string;
    type: "PUBLIC" | "PRIVATE";
  };
}[];

export function AppSidebar({
  activeWorkspaceId,
}: {
  activeWorkspaceId: string;
}) {
  //   const { state } = useSidebar();

  const router = useRouter();
  // const pathName = usePathname();
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceType>({});
  const [privateWorkspaces, setPrivateWorkspaces] = useState<WorkspaceType[]>(
    []
  );
  const [myPublicWorkspaces, setMyPublicWorkspaces] = useState<WorkspaceType[]>(
    []
  );
  const [publicWorkspaces, setPublicWorkspaces] =
    useState<WorkspaceSelectQuery>([]);

  const [addWorkspaceModalOpen, setAddWorkspaceModalOpen] = useState(false);

  // const [allUserWorkspaces, setAllUserWorkspaces] = useState();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const isPublicWorkspace = activeWorkspace?.type === "PUBLIC";

  const onChangeActiveWorkspace = function (workspaceId: string) {
    router.push(`/dashboard/${workspaceId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await getWorkspaces();
      const userAndHisWorkspaces = res?.data;

      const currentWorkspace = userAndHisWorkspaces?.workspaces.find(
        (workspace) => workspace.id === activeWorkspaceId
      );

      if (!currentWorkspace) return;
      setActiveWorkspace(currentWorkspace);
      setPrivateWorkspaces(
        userAndHisWorkspaces?.workspaces.filter(
          (workspace) => workspace.type === "PRIVATE"
        ) || []
      );

      setMyPublicWorkspaces(
        userAndHisWorkspaces?.workspaces.filter(
          (workspace) => workspace.type === "PUBLIC"
        ) || []
      );
      setPublicWorkspaces(userAndHisWorkspaces?.userWorkspaces || []);
    };

    fetchData();
  }, [activeWorkspaceId]);

  return (
    <>
      <Sidebar variant="inset">
        <SidebarHeader className="flex flex-col gap-2 px-3 py-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              StudyAI
            </h1>
            <div className="ml-auto">
              <SidebarTrigger />
            </div>
          </div>
        </SidebarHeader>

        <SidebarSeparator />
        {/* select workspace */}
        <Select
          defaultValue={activeWorkspaceId}
          onValueChange={onChangeActiveWorkspace}
        >
          {/* selelct trigger */}
          <SelectTrigger className="mt-16 text-neutral-400 bg-transparent">
            <SelectValue placeholder="Select a workspace"></SelectValue>
          </SelectTrigger>

          <SelectContent className="backdrop-blur-xl">
            <SelectGroup>
              <SelectLabel>Workspaces</SelectLabel>
              <Separator />
              {privateWorkspaces?.map((workspace) => (
                <SelectItem value={workspace.id} key={workspace.id}>
                  {workspace.name}
                </SelectItem>
              ))}
              {myPublicWorkspaces?.map((workspace) => (
                <SelectItem value={workspace.id} key={workspace.id}>
                  {workspace.name}
                </SelectItem>
              ))}
              {publicWorkspaces.length > 0 &&
                publicWorkspaces.map(
                  (workspaceDetails) =>
                    workspaceDetails.workspace && (
                      <SelectItem
                        value={workspaceDetails.workspace.id}
                        key={workspaceDetails.workspace.id}
                      >
                        {workspaceDetails.workspace.name}
                      </SelectItem>
                    )
                )}
            </SelectGroup>
          </SelectContent>
        </Select>
        <SidebarSeparator />

        <SidebarContent>
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Dashboard">
                    <Link
                      href={`/dashboard/${activeWorkspaceId}`}
                      className="group"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Home className="h-4 w-4 text-primary" />
                      </div>
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Digital Library">
                    <Link
                      href={`/dashboard/${activeWorkspaceId}/library`}
                      className="group"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                        <Book className="h-4 w-4 text-blue-500" />
                      </div>
                      <span>Digital Library</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Quizzes">
                    <Link
                      href={`/dashboard/${activeWorkspaceId}/quizzes`}
                      className="group"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                        <FileText className="h-4 w-4 text-green-500" />
                      </div>
                      <span>Quizzes</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Flashcards">
                    <Link
                      href={`/dashboard/${activeWorkspaceId}/flashcards`}
                      className="group"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                        <Brain className="h-4 w-4 text-amber-500" />
                      </div>
                      <span>Flashcards</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Pomodoro">
                    <Link
                      href={`/dashboard/${activeWorkspaceId}/pomodoro`}
                      className="group"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                        <Clock className="h-4 w-4 text-red-500" />
                      </div>
                      <span>Pomodoro Timer</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Achievements">
                    <Link
                      href={`/dashboard/${activeWorkspaceId}/achievements`}
                      className="group"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                        <Trophy className="h-4 w-4 text-purple-500" />
                      </div>
                      <span>Achievements</span>
                      <Badge
                        variant="outline"
                        className="ml-auto bg-purple-500/10 text-purple-500 border-purple-500/20"
                      >
                        New
                      </Badge>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          {/* Private Workspaces */}
          <SidebarGroup>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full justify-between">
                  <span>Private Workspaces</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {privateWorkspaces.map((workspace) => (
                      <SidebarMenuItem key={workspace.id}>
                        <SidebarMenuButton
                          isActive={activeWorkspace.id === workspace.id}
                          onClick={() => setActiveWorkspace(workspace)}
                          tooltip={workspace.name}
                          className="group"
                        >
                          <div
                            className={`flex items-center justify-center w-6 h-6 rounded-md transition-colors ${
                              activeWorkspace.id === workspace.id
                                ? "bg-primary/20"
                                : "bg-primary/10 group-hover:bg-primary/15"
                            }`}
                          >
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <span>{workspace.name}</span>
                          {/* {workspace.unread > 0 && (
                            <Badge
                              variant="outline"
                              className="ml-auto bg-primary/10 text-primary border-primary/20"
                            >
                              {workspace.unread}
                            </Badge>
                          )} */}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        tooltip="Add Workspace"
                        className="group"
                        onClick={() => setAddWorkspaceModalOpen(true)}
                      >
                        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 group-hover:bg-primary/15 transition-colors">
                          <Plus className="h-4 w-4 text-primary" />
                        </div>
                        <span>Add Workspace</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>

          {/* Public Workspaces */}
          <SidebarGroup>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full justify-between">
                  <span>Public Workspaces</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {myPublicWorkspaces.map((workspace) => (
                      <SidebarMenuItem key={workspace.id}>
                        <SidebarMenuButton
                          isActive={activeWorkspace.id === workspace.id}
                          onClick={() => setActiveWorkspace(workspace)}
                          tooltip={workspace.name}
                          className="group"
                        >
                          <div
                            className={`flex items-center justify-center w-6 h-6 rounded-md transition-colors ${
                              activeWorkspace.id === workspace.id
                                ? "bg-blue-500/20"
                                : "bg-blue-500/10 group-hover:bg-blue-500/15"
                            }`}
                          >
                            <Users className="h-4 w-4 text-blue-500" />
                          </div>
                          <span>{workspace.name}</span>
                          {/* {workspace.unread > 0 && (
                            <Badge
                              variant="outline"
                              className="ml-auto bg-blue-500/10 text-blue-500 border-blue-500/20"
                            >
                              {workspace.unread}
                            </Badge>
                          )} */}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                    {publicWorkspaces.map((workspaceDetails) => (
                      <SidebarMenuItem key={workspaceDetails.workspace.id}>
                        <SidebarMenuButton
                          isActive={
                            activeWorkspace.id === workspaceDetails.workspace.id
                          }
                          onClick={() => {
                            setActiveWorkspace(workspaceDetails.workspace);
                          }}
                          tooltip={workspaceDetails.workspace.name}
                          className="group"
                        >
                          <div
                            className={`flex items-center justify-center w-6 h-6 rounded-md transition-colors ${
                              activeWorkspace.id ===
                              workspaceDetails.workspace.id
                                ? "bg-blue-500/20"
                                : "bg-blue-500/10 group-hover:bg-blue-500/15"
                            }`}
                          >
                            <Users className="h-4 w-4 text-blue-500" />
                          </div>
                          <span>{workspaceDetails.workspace.name}</span>
                          {/* {workspace.unread > 0 && (
                            <Badge
                              variant="outline"
                              className="ml-auto bg-blue-500/10 text-blue-500 border-blue-500/20"
                            >
                              {workspace.unread}
                            </Badge>
                          )} */}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        tooltip="Join Workspace"
                        className="group"
                      >
                        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-500/10 group-hover:bg-blue-500/15 transition-colors">
                          <Plus className="h-4 w-4 text-blue-500" />
                        </div>
                        <span>Join Workspace</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>

          {/* Invite Button (only for public workspaces) */}
          {isPublicWorkspace && (
            <div className="px-3 py-2">
              <Button
                variant="outline"
                className="w-full bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20 hover:text-blue-600 transition-colors"
                onClick={() => setInviteModalOpen(true)}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Members
              </Button>
            </div>
          )}
        </SidebarContent>

        <SidebarFooter>
          <div className="px-3 py-2">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-amber-500/10 to-red-500/10">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-red-500">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">7-Day Streak!</p>
                <p className="text-xs text-muted-foreground">
                  Keep studying to maintain your streak
                </p>
              </div>
            </div>
          </div>
          <SidebarSeparator />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings">
                <Link href="/settings" className="group">
                  <div className="flex items-center justify-center w-6 h-6 rounded-md bg-muted group-hover:bg-muted/80 transition-colors">
                    <Settings className="h-4 w-4" />
                  </div>
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <InviteModal
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
        workspaceName={activeWorkspace?.name || ""}
        activeWorkspaceId={activeWorkspaceId}
      />

      <AddWorkspaceModal
        open={addWorkspaceModalOpen}
        onOpenChange={setAddWorkspaceModalOpen}
      />
    </>
  );
}
