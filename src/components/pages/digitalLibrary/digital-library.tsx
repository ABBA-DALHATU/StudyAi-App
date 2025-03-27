"use client";

import { useEffect, useState } from "react";

import { SidebarInset } from "@/components/ui/sidebar";
import { ResourceGrid } from "./resource-grid";
import { ResourceFilterBar } from "./resource-filter-bar";
import { LibraryHeader } from "./library-header";
import { UploadDialog } from "./upload-dialog";
import { ResourceDetailsDialog } from "./resource-details-dialog";
import { deleteDigitalResource, getDigitalResources } from "@/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Mock data for digital resources
export type ResourceType = "pdf" | "docx" | "pptx" | "xlsx" | "image" | "other";
export type Workspace = {
  id: string;
  name: string;
};

export type DigitalResource = {
  id: string;
  name: string;
  url: string;
  type: ResourceType;
  size: number; // in bytes
  workspaceId: string;
  uploadedById: string;
  uploadedByName: string;
  uploadedByAvatar?: string;
  createdAt: Date;
};

export function DigitalLibrary({ workspaceId }: { workspaceId: string }) {
  const [resources, setResources] = useState<DigitalResource[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] =
    useState<DigitalResource | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ResourceType | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      const digitalResourcesRespones = await getDigitalResources(workspaceId);
      const digitalResources = digitalResourcesRespones?.data || [];

      const formattedDigitalResources = digitalResources.map((resource) => ({
        id: resource.id,
        name: resource.name,
        url: resource.url,
        size: resource.size,
        type: resource.type as ResourceType, // Cast to ResourceType
        workspaceId: resource.workspaceId,
        uploadedById: resource.uploadedById,
        uploadedByName: resource.uploadedBy.fullName,
        uploadedByAvatar: resource.uploadedBy.imageUrl || undefined,
        createdAt: resource.createdAt,
      }));
      setResources(formattedDigitalResources || []);
      setLoading(false);
    };

    fetchResources();
  }, [workspaceId]);
  // Filter resources based on selected workspace, search query, and type

  // if (loading) {
  //   return <Loader2 />;
  // }

  // if (!resources || resources.length === 0) {
  //   setResources([]);
  // }

  const filteredResources = resources.filter((resource) => {
    const matchesWorkspace = selectedWorkspace
      ? resource.workspaceId === selectedWorkspace
      : true;
    const matchesSearch = resource.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = selectedType ? resource.type === selectedType : true;
    return matchesWorkspace && matchesSearch && matchesType;
  });

  // Sort resources
  const sortedResources = [...filteredResources].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === "size") {
      return sortOrder === "asc" ? a.size - b.size : b.size - a.size;
    } else {
      // date
      return sortOrder === "asc"
        ? a.createdAt.getTime() - b.createdAt.getTime()
        : b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  // Handle resource upload
  const handleUpload = (newResource: any) => {
    const formattedNewResource = {
      id: newResource.id,
      name: newResource.name,
      url: newResource.url,
      size: newResource.size,
      type: newResource.type as ResourceType, // Cast to newResourceType
      workspaceId: newResource.workspaceId,
      uploadedById: newResource.uploadedById,
      uploadedByName: newResource.uploadedBy.fullName,
      uploadedByAvatar: newResource.uploadedBy.imageUrl || undefined,
      createdAt: newResource.createdAt,
    };
    setResources([formattedNewResource, ...resources]);
    setUploadDialogOpen(false);
  };

  // Handle resource deletion
  const handleDelete = async (resourceId: string) => {
    const deleted = await deleteDigitalResource(resourceId);
    if (deleted) {
      setResources(resources.filter((resource) => resource.id !== resourceId));
      if (selectedResource?.id === resourceId) {
        setSelectedResource(null);
      }

      toast("Success!", {
        description: "File deleted successfully.",
        duration: 3000,
      });
    }
  };

  return (
    // <div className="flex h-screen w-full bg-gradient-to-br from-background to-background/95">
    <>
      <div className="flex flex-col h-full">
        {/* <TopNavbar /> */}
        <div className="flex-1 overflow-auto">
          <LibraryHeader onUpload={() => setUploadDialogOpen(true)} />

          <ResourceFilterBar
            // workspaces={mockWorkspaces}
            // selectedWorkspace={selectedWorkspace}
            // onWorkspaceChange={setSelectedWorkspace}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />

          <ResourceGrid
            resources={sortedResources}
            onResourceClick={setSelectedResource}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </div>

      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUpload={handleUpload}
        workspaceId={workspaceId}
      />

      {selectedResource && (
        <ResourceDetailsDialog
          resource={selectedResource}
          open={!!selectedResource}
          onOpenChange={(open) => !open && setSelectedResource(null)}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
