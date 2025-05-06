"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createWorkpace } from "@/actions";
import { toast } from "sonner";

interface AddWorkspaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const FormSchema = z.object({
  name: z.string().min(3, {
    message: "Workspace name must be at least 3 characters.",
  }),
});

type FormValues = z.infer<typeof FormSchema>;

export function AddWorkspaceModal({
  open,
  onOpenChange,
  onSuccess,
}: AddWorkspaceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      const newWorkpace = await createWorkpace(values.name);

      if (newWorkpace) {
        toast("Success!", {
          description: "New workspace created successfully.",
          duration: 3000,
        });

        form.reset();
        onOpenChange(false);

        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error("Could not create workspace", {
          description: "Please try again later.",
          duration: 3000,
        });
      }
    } catch (error) {
      toast.error("Error creating public workspace.", {
        description: "Please try again later.",
        duration: 3000,
      });
      console.error("Error creating workspace:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Workspace</DialogTitle>
          <DialogDescription>
            Add a new workspace to organize your study materials.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter workspace name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Workspace"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// "use client";

// import { useState } from "react";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { createWorkpace } from "@/actions";
// import { toast } from "sonner";

// interface AddWorkspaceModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// const FormSchema = z.object({
//   name: z.string().min(3, {
//     message: "Workspace name must be at least 3 characters.",
//   }),
// });

// type FormValues = z.infer<typeof FormSchema>;

// export function AddWorkspaceModal({
//   open,
//   onOpenChange,
// }: AddWorkspaceModalProps) {
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const form = useForm<FormValues>({
//     resolver: zodResolver(FormSchema),
//     defaultValues: {
//       name: "",
//     },
//   });

//   const onSubmit = async (values: FormValues) => {
//     setIsSubmitting(true);

//     try {
//       // In a real app, you would call an API to create the workspace
//       console.log("Creating workspace:", values.name);

//       const newWorkpace = await createWorkpace(values.name);

//       if (newWorkpace) {
//         toast("Success!", {
//           description: "New workspace created successfully.",
//           duration: 3000,
//         });
//       } else {
//         toast.error("Could not create workspace", {
//           description: "Please try again later.",
//           duration: 3000,
//         });
//       }

//       // Reset form and close modal
//       form.reset();
//       onOpenChange(false);
//     } catch (error) {
//       toast.error("Error creating public workspace.", {
//         description: "Please try again later.",
//         duration: 3000,
//       });
//       console.error("Error creating workspace:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Create New Workspace</DialogTitle>
//           <DialogDescription>
//             Add a new workspace to organize your study materials.
//           </DialogDescription>
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Workspace Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter workspace name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <DialogFooter className="mt-6">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => onOpenChange(false)}
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isSubmitting}>
//                 {isSubmitting ? "Creating..." : "Create Workspace"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }
