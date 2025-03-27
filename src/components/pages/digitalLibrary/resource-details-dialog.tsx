"use client";

import {
  Calendar,
  Download,
  FileText,
  Trash2,
  User,
  Tag,
  FileImage,
  FileSpreadsheet,
  File,
  FileIcon as FilePresentationIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { DigitalResource } from "./digital-library";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface ResourceDetailsDialogProps {
  resource: DigitalResource;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (resourceId: string) => void;
}

export function ResourceDetailsDialog({
  resource,
  open,
  onOpenChange,
  onDelete,
}: ResourceDetailsDialogProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get file icon based on type
  const getFileIcon = () => {
    switch (resource.type) {
      case "pdf":
        return <FileText className="h-16 w-16 text-red-500" />;
      case "docx":
        return <FileText className="h-16 w-16 text-blue-500" />;
      case "pptx":
        return <FilePresentationIcon className="h-16 w-16 text-orange-500" />;
      case "xlsx":
        return <FileSpreadsheet className="h-16 w-16 text-green-500" />;
      case "image":
        return <FileImage className="h-16 w-16 text-purple-500" />;
      default:
        return <File className="h-16 w-16 text-gray-500" />;
    }
  };

  // Get background color based on file type
  const getBackgroundColor = () => {
    switch (resource.type) {
      case "pdf":
        return "bg-red-500/10";
      case "docx":
        return "bg-blue-500/10";
      case "pptx":
        return "bg-orange-500/10";
      case "xlsx":
        return "bg-green-500/10";
      case "image":
        return "bg-purple-500/10";
      default:
        return "bg-gray-500/10";
    }
  };

  // Handle download
  const handleDownload = () => {
    // In a real app, this would download the file
    console.log(`Downloading ${resource.name}`);
  };

  // Handle delete
  const handleDelete = () => {
    onDelete(resource.id);
    setDeleteDialogOpen(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resource Details</DialogTitle>
          <DialogDescription>
            View details and manage this resource
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <div className={`rounded-lg p-4 ${getBackgroundColor()} mb-4`}>
            {getFileIcon()}
          </div>
          <h2 className="text-xl font-semibold text-center">{resource.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {formatFileSize(resource.size)} • {resource.type.toUpperCase()}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Uploaded on</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(resource.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Uploaded by</p>
              <div className="flex items-center mt-1">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage
                    src={resource.uploadedByAvatar}
                    alt={resource.uploadedByName}
                  />
                  <AvatarFallback>
                    {resource.uploadedByName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{resource.uploadedByName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <Tag className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Tags</p>
              {resource.tags && resource.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {resource.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No tags</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  resource {resource.name} from the server.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 transition-colors"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
