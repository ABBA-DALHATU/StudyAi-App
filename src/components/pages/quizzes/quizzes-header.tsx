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
import { CreateQuizModal } from "./create-quiz-modal";

export function QuizzesHeader({ workspaceId }: { workspaceId: string }) {
  const [createQuizModalOpen, setCreateQuizModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Quizzes</h1>
            <Badge
              variant="outline"
              className="bg-green-500/10 text-green-500 border-green-500/20"
            >
              15 Quizzes
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Test your knowledge with AI-generated quizzes based on your study
            materials
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setCreateQuizModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Quiz
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
                <DropdownMenuItem>Most Attempted</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Easy Difficulty</DropdownMenuItem>
                <DropdownMenuItem>Medium Difficulty</DropdownMenuItem>
                <DropdownMenuItem>Hard Difficulty</DropdownMenuItem>
                <DropdownMenuItem>Created By Me</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search quizzes by title, topic, or creator..."
          className="pl-10 bg-background/60 border-muted"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          variant="outline"
          className="bg-background hover:bg-muted cursor-pointer"
        >
          All Quizzes
        </Badge>
        <Badge
          variant="outline"
          className="bg-background hover:bg-muted cursor-pointer"
        >
          Easy
        </Badge>
        <Badge
          variant="outline"
          className="bg-background hover:bg-muted cursor-pointer"
        >
          Medium
        </Badge>
        <Badge
          variant="outline"
          className="bg-background hover:bg-muted cursor-pointer"
        >
          Hard
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
      </div>

      <CreateQuizModal
        open={createQuizModalOpen}
        onOpenChange={setCreateQuizModalOpen}
        workspaceId={workspaceId}
      />
    </div>
  );
}
