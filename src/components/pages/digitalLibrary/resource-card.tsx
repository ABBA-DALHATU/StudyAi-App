"use client";

import type React from "react";

import { useState } from "react";
import {
  Calendar,
  Download,
  FileText,
  MoreVertical,
  Trash2,
  FileImage,
  FileSpreadsheet,
  File,
  FileIcon as FilePresentationIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DigitalResource } from "./digital-library";

interface ResourceCardProps {
  resource: DigitalResource;
  onClick: () => void;
  onDelete: () => void;
}

export function ResourceCard({
  resource,
  onClick,
  onDelete,
}: ResourceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Get file icon based on type
  const getFileIcon = () => {
    switch (resource.type) {
      case "pdf":
        return <FileText className="h-12 w-12 text-red-500" />;
      case "docx":
        return <FileText className="h-12 w-12 text-blue-500" />;
      case "pptx":
        return <FilePresentationIcon className="h-12 w-12 text-orange-500" />;
      case "xlsx":
        return <FileSpreadsheet className="h-12 w-12 text-green-500" />;
      case "image":
        return <FileImage className="h-12 w-12 text-purple-500" />;
      default:
        return <File className="h-12 w-12 text-gray-500" />;
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
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would download the file
    console.log(`Downloading ${resource.name}`);
  };

  return (
    <Card
      className="overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer group"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div className={`rounded-lg p-3 ${getBackgroundColor()}`}>
            {getFileIcon()}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-medium truncate" title={resource.name}>
          {resource.name}
        </h3>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{formatDate(resource.createdAt)}</span>
          <span className="mx-1">•</span>
          <span>{formatFileSize(resource.size)}</span>
        </div>
        {/* {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {resource.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                {tag}
              </Badge>
            ))}
            {resource.tags.length > 2 && (
              <Badge variant="outline" className="text-xs px-1 py-0">
                +{resource.tags.length - 2}
              </Badge>
            )}
          </div>
        )} */}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage
              src={resource.uploadedByAvatar}
              alt={resource.uploadedByName}
            />
            <AvatarFallback>
              {resource.uploadedByName.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs truncate">{resource.uploadedByName}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${
            isHovered ? "opacity-100" : "opacity-0"
          } transition-opacity`}
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          <span className="sr-only">Download</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
