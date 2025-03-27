"use client";

import { FileText, Filter, Search, SortAsc, SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ResourceType, Workspace } from "./digital-library";
import { Badge } from "@/components/ui/badge";

interface ResourceFilterBarProps {
  // workspaces: Workspace[]
  // selectedWorkspace: string | null;
  // onWorkspaceChange: (workspaceId: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: ResourceType | null;
  onTypeChange: (type: ResourceType | null) => void;
  sortBy: "name" | "date" | "size";
  onSortByChange: (sortBy: "name" | "date" | "size") => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (order: "asc" | "desc") => void;
}

export function ResourceFilterBar({
  // workspaces,
  // selectedWorkspace,
  // onWorkspaceChange,
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}: ResourceFilterBarProps) {
  const fileTypes: { label: string; value: ResourceType }[] = [
    { label: "PDF", value: "pdf" },
    { label: "Word", value: "docx" },
    { label: "PowerPoint", value: "pptx" },
    { label: "Excel", value: "xlsx" },
    { label: "Image", value: "image" },
    { label: "Other", value: "other" },
  ];

  // const getWorkspaceName = (id: string | null) => {
  //   if (!id) return "All Workspaces"
  //   const workspace = workspaces.find((w) => w.id === id)
  //   return workspace ? workspace.name : "Unknown Workspace"
  // }

  const getTypeName = (type: ResourceType | null) => {
    if (!type) return "All Types";
    const fileType = fileTypes.find((t) => t.value === type);
    return fileType ? fileType.label : "Unknown Type";
  };

  const getSortLabel = () => {
    const sortName =
      sortBy === "name" ? "Name" : sortBy === "date" ? "Date" : "Size";
    return `Sort: ${sortName} (${sortOrder === "asc" ? "A-Z" : "Z-A"})`;
  };

  return (
    <div className="p-4 flex flex-col md:flex-row gap-3 items-center bg-background/50">
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name or tag..."
          className="w-full pl-8 bg-background"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex-1 md:flex-none justify-start">
              <Filter className="mr-2 h-4 w-4" />
              <span className="truncate">{getWorkspaceName(selectedWorkspace)}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Workspace</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => onWorkspaceChange(null)}>All Workspaces</DropdownMenuItem>
              {workspaces.map((workspace) => (
                <DropdownMenuItem key={workspace.id} onClick={() => onWorkspaceChange(workspace.id)}>
                  {workspace.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu> */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex-1 md:flex-none justify-start"
            >
              <FileText className="mr-2 h-4 w-4" />
              <span className="truncate">{getTypeName(selectedType)}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => onTypeChange(null)}>
                All Types
              </DropdownMenuItem>
              {fileTypes.map((type) => (
                <DropdownMenuItem
                  key={type.value}
                  onClick={() => onTypeChange(type.value)}
                >
                  {type.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex-1 md:flex-none justify-start"
            >
              {sortOrder === "asc" ? (
                <SortAsc className="mr-2 h-4 w-4" />
              ) : (
                <SortDesc className="mr-2 h-4 w-4" />
              )}
              <span className="truncate">{getSortLabel()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => onSortByChange("name")}>
                Sort by Name {sortBy === "name" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortByChange("date")}>
                Sort by Date {sortBy === "date" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortByChange("size")}>
                Sort by Size {sortBy === "size" && "✓"}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")
              }
            >
              {sortOrder === "asc" ? "Descending Order" : "Ascending Order"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {(selectedType || searchQuery) && (
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* {selectedWorkspace && (
            <Badge
              variant="outline"
              className="bg-blue-500/10 text-blue-500 border-blue-500/20 whitespace-nowrap"
            >
              Workspace: {getWorkspaceName(selectedWorkspace)}
              <button
                className="ml-1 rounded-full hover:bg-blue-500/20 p-0.5"
                onClick={() => onWorkspaceChange(null)}
              >
                <span className="sr-only">Remove workspace filter</span>×
              </button>
            </Badge>
          )} */}
          {selectedType && (
            <Badge
              variant="outline"
              className="bg-green-500/10 text-green-500 border-green-500/20 whitespace-nowrap"
            >
              Type: {getTypeName(selectedType)}
              <button
                className="ml-1 rounded-full hover:bg-green-500/20 p-0.5"
                onClick={() => onTypeChange(null)}
              >
                <span className="sr-only">Remove type filter</span>×
              </button>
            </Badge>
          )}
          {searchQuery && (
            <Badge
              variant="outline"
              className="bg-purple-500/10 text-purple-500 border-purple-500/20 whitespace-nowrap"
            >
              Search: {searchQuery}
              <button
                className="ml-1 rounded-full hover:bg-purple-500/20 p-0.5"
                onClick={() => onSearchChange("")}
              >
                <span className="sr-only">Clear search</span>×
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
