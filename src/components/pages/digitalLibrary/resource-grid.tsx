"use client";

import LoaderFetch from "@/components/global/LoaderFetch";
import type { DigitalResource } from "./digital-library";
import { ResourceCard } from "./resource-card";

interface ResourceGridProps {
  resources: DigitalResource[];
  onResourceClick: (resource: DigitalResource) => void;
  onDelete: (resourceId: string) => void;
  loading: boolean;
}

export function ResourceGrid({
  resources,
  onResourceClick,
  onDelete,
  loading,
}: ResourceGridProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <LoaderFetch />
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-blue-500/10 p-3 mb-4">
          <svg
            className="h-12 w-12 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium">No resources found</h3>
        <p className="text-muted-foreground mt-1">
          Try changing your filters or upload a new resource
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onClick={() => onResourceClick(resource)}
            onDelete={() => onDelete(resource.id)}
          />
        ))}
      </div>
    </div>
  );
}
