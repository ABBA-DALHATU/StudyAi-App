"use client";

import { useState } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CreateFlashcardModal } from "./create-flashcard-modal";

export function FlashcardsHeader({ workspaceId }: { workspaceId: string }) {
  const [createFlashcardModalOpen, setCreateFlashcardModalOpen] =
    useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Flashcards</h1>
            <Badge
              variant="outline"
              className="bg-amber-500/10 text-amber-500 border-amber-500/20"
            >
              12 Sets
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Create and study flashcards to memorize key concepts and information
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setCreateFlashcardModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Flashcards
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Date Created (Newest)</DropdownMenuItem>
                <DropdownMenuItem>Date Created (Oldest)</DropdownMenuItem>
                <DropdownMenuItem>Title (A-Z)</DropdownMenuItem>
                <DropdownMenuItem>Title (Z-A)</DropdownMenuItem>
                <DropdownMenuItem>Most Cards</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Created By Me</DropdownMenuItem>
                <DropdownMenuItem>Recently Studied</DropdownMenuItem>
                <DropdownMenuItem>Need Review</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search flashcard sets by title, topic, or content..."
          className="pl-10 bg-background/60 border-muted"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          variant="outline"
          className="bg-background hover:bg-muted cursor-pointer"
        >
          All Flashcards
        </Badge>
        <Badge
          variant="outline"
          className="bg-background hover:bg-muted cursor-pointer"
        >
          Math 101
        </Badge>
        <Badge
          variant="outline"
          className="bg-background hover:bg-muted cursor-pointer"
        >
          Physics Notes
        </Badge>
        <Badge
          variant="outline"
          className="bg-background hover:bg-muted cursor-pointer"
        >
          Biology
        </Badge>
        <Badge
          variant="outline"
          className="bg-background hover:bg-muted cursor-pointer"
        >
          Programming
        </Badge>
        <Badge
          variant="outline"
          className="bg-background hover:bg-muted cursor-pointer"
        >
          Study Group A
        </Badge>
      </div>

      <CreateFlashcardModal
        open={createFlashcardModalOpen}
        onOpenChange={setCreateFlashcardModalOpen}
        workspaceId={workspaceId}
      />
    </div>
  );
}
