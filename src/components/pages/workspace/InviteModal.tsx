"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { inviteMember, searchUsersByQuery } from "@/actions";
import { toast } from "sonner";

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceName: string;
  activeWorkspaceId: string;
}

// Mock user type
interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  imageUrl: string | null;
}

// Mock data for users - in a real app, this would come from your API
const mockUsers = [
  {
    id: "1",
    firstname: "Alex",
    lastname: "Johnson",
    email: "alex@example.com",
    image: "/placeholder.svg?height=40&width=40",
    subscription: { plan: "PRO" },
  },
  {
    id: "2",
    firstname: "Sam",
    lastname: "Smith",
    email: "sam@example.com",
    image: "/placeholder.svg?height=40&width=40",
    subscription: { plan: "FREE" },
  },
  {
    id: "3",
    firstname: "Taylor",
    lastname: "Wilson",
    email: "taylor@example.com",
    image: "/placeholder.svg?height=40&width=40",
    subscription: { plan: "PRO" },
  },
  {
    id: "4",
    firstname: "Jordan",
    lastname: "Lee",
    email: "jordan@example.com",
    image: "/placeholder.svg?height=40&width=40",
    subscription: { plan: "FREE" },
  },
  {
    id: "5",
    firstname: "Casey",
    lastname: "Brown",
    email: "casey@example.com",
    image: "/placeholder.svg?height=40&width=40",
    // subscription: { plan: "PRO" },
  },
];

export function InviteModal({
  open,
  onOpenChange,
  workspaceName,
  activeWorkspaceId,
}: InviteModalProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<User[] | undefined>(
    undefined
  );
  const [invitingUsers, setInvitingUsers] = useState<Record<string, boolean>>(
    {}
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Debounce search query
  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // 500ms debounce time

    return () => clearTimeout(delayInputTimeoutId);
  }, [query]);

  // Fetch search results when debounced query changes
  useEffect(() => {
    const searchUsers = async () => {
      if (!debouncedQuery) {
        setSearchResults(undefined);
        return;
      }

      setIsLoading(true);

      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/users/search?query=${debouncedQuery}`)
        // const data = await response.json()

        // Simulate API call with mock data
        const res = await searchUsersByQuery(debouncedQuery);
        const users = res.data;

        // const user = await new Promise((resolve) => setTimeout(resolve, 800));

        const filteredUsers = users?.filter(
          (user) =>
            user.firstName
              ?.toLowerCase()
              .includes(debouncedQuery.toLowerCase()) ||
            user.lastName
              ?.toLowerCase()
              .includes(debouncedQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(debouncedQuery.toLowerCase())
        );

        setSearchResults(filteredUsers?.length ? filteredUsers : []);
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchUsers();
  }, [debouncedQuery]);

  // Handle invite user
  const handleInvite = async (userId: string, email: string | null) => {
    if (!email) return;

    setInvitingUsers((prev) => ({ ...prev, [userId]: true }));

    try {
      // In a real app, this would be an API call to send the invitation
      // await fetch('/api/workspaces/invite', {
      //   method: 'POST',
      //   body: JSON.stringify({ workspaceId, userId, email })
      // })

      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      const invite = await inviteMember(activeWorkspaceId, userId, email);

      if (invite) {
        // Show success or handle in UI
        console.log(`Invited user ${userId} (${email}) to workspace`);

        // Remove from results to indicate they've been invited
        setSearchResults((prev) => prev?.filter((user) => user.id !== userId));
        toast("Success!", {
          description: "New invite created successfully.",
          duration: 3000,
        });
      } else {
        toast.error("Could not invite member.", {
          description: "Please try again later.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error inviting user:", error);
      toast.error("Error inviter user.", {
        description: "Please try again later.",
        duration: 3000,
      });
    } finally {
      setInvitingUsers((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite to {workspaceName}</DialogTitle>
          <DialogDescription>
            Invite members to collaborate in this workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-y-5">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or email"
              className="pl-8"
              value={query}
              onChange={handleSearchChange}
            />
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-y-2">
              <Skeleton className="w-full h-16 rounded-xl" />
              <Skeleton className="w-full h-16 rounded-xl" />
              <Skeleton className="w-full h-16 rounded-xl" />
            </div>
          ) : !searchResults ? (
            <p className="text-center text-sm text-muted-foreground py-4">
              Search for users to invite
            </p>
          ) : searchResults.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">
              No users found matching your search
            </p>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex gap-x-3 items-center border rounded-lg p-3"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.imageUrl || ""}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                    <AvatarFallback>
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col items-start flex-1">
                    <h3 className="font-medium capitalize">
                      {user.firstName} {user.lastName}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                      {/* {user.subscription?.plan && (
                        <Badge
                          variant="outline"
                          className={
                            user.subscription.plan === "PRO"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-muted"
                          }
                        >
                          {user.subscription.plan}
                        </Badge>
                      )} */}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleInvite(user.id, user.email)}
                    disabled={invitingUsers[user.id]}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {invitingUsers[user.id] ? (
                      "Inviting..."
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
