"use client";

import type React from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { Upload, X, FileUp } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  DigitalResource,
  ResourceType,
  Workspace,
} from "./digital-library";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import FileUpload from "@/components/global/uploadFile";
import { createDigitalResource } from "@/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// import { DigitalResource, User, Workspace } from "@prisma/client";

const FormSchema = z.object({
  url: z.string().min(1),
});

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (resource: any) => void;
  workspaceId: string;
}

interface FileMetadata {
  url: string;
  name: string;
  size: number;
  type: string; // Or ResourceType if needed
}

export function UploadDialog({
  open,
  onOpenChange,
  onUpload,
  workspaceId,
}: UploadDialogProps) {
  const router = useRouter();
  const [data, setData] = useState<FileMetadata | null>(null);
  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      if (!data) return; // Ensure data exists
      console.log(data, "🎉🎉🎉🎉🎉");
      const finalData = {
        name: data.name,
        size: data.size,
        type: data.type,
        url: values?.url || data.url,
      };

      const response = await createDigitalResource(finalData, workspaceId);
      if (response) {
        toast("Success!", {
          description: "File uploaded successfully.",
          duration: 3000,
        });
        // Call onUpload to update UI immediately
        onUpload(response);
        setData(null);
        router.refresh();
      } else {
        toast.error("couldnot upload file.", {
          description: "Please try again later.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Error uploading project.", {
        description: "Please try again later.",
        duration: 3000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Resource</DialogTitle>
          <DialogDescription>
            Upload a document to your digital library
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project File</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="digitalResources"
                      onChange={(metadata) => {
                        field.onChange(metadata?.url);
                        setData(metadata || null); // Pass null if metadata is undefined
                      }}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 mt-6">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Uploading..." : "Upload File"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
