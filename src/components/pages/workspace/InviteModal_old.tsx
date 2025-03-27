"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
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

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceName: string;
}

// Mock data for users
const mockUsers = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Sam Smith",
    email: "sam@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Taylor Wilson",
    email: "taylor@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

export function InviteModal({
  open,
  onOpenChange,
  workspaceName,
}: InviteModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleInvite = () => {
    // In a real app, you would send invites to the selected users
    console.log("Inviting users:", selectedUsers);
    onOpenChange(false);
    setSelectedUsers([]);
    setSearchQuery("");
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

        <div className="flex items-center space-x-2 my-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or email"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 my-2">
            {selectedUsers.map((userId) => {
              const user = mockUsers.find((u) => u.id === userId);
              if (!user) return null;

              return (
                <Badge
                  key={userId}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {user.name}
                  <button
                    onClick={() => toggleUserSelection(userId)}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {user.name}</span>
                  </button>
                </Badge>
              );
            })}
          </div>
        )}

        <div className="max-h-[200px] overflow-y-auto">
          {filteredUsers.length > 0 ? (
            <ul className="space-y-2">
              {filteredUsers.map((user) => (
                <li key={user.id}>
                  <button
                    className={`w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent ${
                      selectedUsers.includes(user.id) ? "bg-accent" : ""
                    }`}
                    onClick={() => toggleUserSelection(user.id)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              No users found. Try a different search.
            </p>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setSelectedUsers([]);
              setSearchQuery("");
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleInvite} disabled={selectedUsers.length === 0}>
            Invite ({selectedUsers.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
