import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  digitalResources: f({
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // Add auth logic here if needed
      return { userId: "user123" }; // Replace with actual user ID
    })
    .onUploadComplete(async ({ file }) => {
      console.log("file❌❌❌❌❌", file);
      console.log("File uploaded:", file.url);
      return {
        url: file.url,
        name: file.name,
        size: file.size,
        type: file.type,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
