"use client";
import { FileIcon, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { UploadDropzone } from "@/lib/uploadthing";
import { Progress } from "../ui/progress"; // Assuming you have a Progress component

type FileMetadata = {
  url: string;
  name: string;
  size: number;
  type: string;
};

type Props = {
  apiEndpoint: "digitalResources";
  onChange: (metadata?: FileMetadata) => void; // Pass file metadata to the form
  value?: string; // URL of the uploaded file
};

const FileUpload = ({ apiEndpoint, onChange, value }: Props) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileMetadata, setFileMetadata] = useState<FileMetadata | null>(null);

  const fileType = value?.split(".").pop();

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  if (value) {
    return (
      <div className="flex flex-col justify-center items-center">
        {fileType === "pdf" || fileType === "docx" ? (
          <div className="relative flex items-center p-1 mt-1 rounded-md bg-background/10">
            <FileIcon className="h-10 w-10 text-indigo-500" />
            <div className="ml-2">
              <a
                href={value}
                target="_blank"
                rel="noopener_noreferrer"
                className="text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                View {fileType === "pdf" ? "PDF" : "DOCX"}
              </a>
              {fileMetadata && (
                <div className="text-xs text-muted-foreground">
                  <p>Name: {fileMetadata.name}</p>
                  <p>Size: {(fileMetadata.size / 1024).toFixed(2)} KB</p>
                  <p>Type: {fileMetadata.type}</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
        <Button
          onClick={() => {
            onChange(undefined); // Clear the form field
            setFileMetadata(null); // Clear the metadata
          }}
          variant="ghost"
          type="button"
          className="mt-4"
        >
          <X className="h-4 w-4 mr-2" />
          Remove File
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-muted/30 rounded-lg p-4">
      <UploadDropzone
        endpoint="digitalResources"
        onClientUploadComplete={(res) => {
          if (res && res[0]) {
            const file = res[0];
            const metadata = {
              url: file.url,
              name: file.name,
              size: file.size,
              type: file.type, // Ensure this matches the expected type
            };
            onChange(metadata); // Pass metadata to the form
            setFileMetadata(metadata); // Store metadata for display
          }
          setUploadProgress(0);
          setIsUploading(false);
        }}
        onUploadError={(error: Error) => {
          console.error("Upload error:", error);
          alert("Upload failed. Please try again.");
          setUploadProgress(0);
          setIsUploading(false);
        }}
        onUploadProgress={(progress) => {
          handleUploadProgress(progress);
          setIsUploading(true);
        }}
        config={{
          allowedFileTypes: ["pdf", "docx"],
          maxFileSize: "4MB",
        }}
      />
      {isUploading && (
        <div className="mt-4">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
