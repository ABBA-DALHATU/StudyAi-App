"use client";

import { useState } from "react";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { NotificationsDropdown } from "./notifications-dropdown";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./ModeToggle";

export function TopNavbar() {
  const { state, openMobile, setOpenMobile } = useSidebar();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        {/* Mobile menu button - only visible on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpenMobile(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>

        {/* Desktop sidebar trigger - only visible when sidebar is collapsed */}
        <div
          className={`hidden md:block ${
            state === "expanded" ? "invisible" : "visible"
          }`}
        >
          <SidebarTrigger />
        </div>

        <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-8 bg-background"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <NotificationsDropdown
            open={notificationsOpen}
            onOpenChange={setNotificationsOpen}
          />
          <UserButton />
        </div>
      </div>
    </div>
  );
}
