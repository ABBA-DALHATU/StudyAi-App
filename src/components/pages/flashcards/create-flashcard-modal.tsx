"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Brain, Loader2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { createFlashcardSet, getDigitalResources } from "@/actions";
import { FlashcardContext } from "@/app/dashboard/[workspaceId]/flashcards/page";

interface Resource {
  id: string;
  name: string;
  type: string;
  url: string;
}

// Define the form schema with Zod
const formSchema = z.object({
  title: z.string().min(1, "Flashcard set title is required"),
  resourceId: z.string().min(1, "Please select a source material"),
  numOfCards: z.string().min(1, "Please select number of cards"),
  // tags: z.string().optional(),
});

// Type for our form values
type FlashcardFormValues = z.infer<typeof formSchema>;

interface CreateFlashcardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
}

export function CreateFlashcardModal({
  open,
  onOpenChange,
  workspaceId,
}: CreateFlashcardModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const router = useRouter();

  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error("FlashcardContext must be used within a FlashcardProvider");
  }
  const { flashcardSets, setFlashcardSets } = context;

  useEffect(() => {
    const fetchData = async () => {
      const res = await getDigitalResources(workspaceId);
      const resourcesObj = res.data || [];

      const formattedResourcesObj = resourcesObj.map((resource) => ({
        id: resource.id,
        name: resource.name,
        type: resource.type,
        url: resource.url,
      }));

      setResources(formattedResourcesObj);
    };

    fetchData();
  }, [workspaceId]);

  // Initialize the form with default values
  const form = useForm<FlashcardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      resourceId: "",
      // tags: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: FlashcardFormValues) => {
    console.log("Form data:", data);

    // Simulate flashcard generation
    setIsGenerating(true);
    setGenerationProgress(0);

    const interval: NodeJS.Timeout = setInterval(() => {
      setGenerationProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 500);

    try {
      const formattedData = {
        title: data.title,
        resourceId: data.resourceId,
        numOfCards: Number(data.numOfCards),
        // tags: data.tags?.split(",").map((tag) => tag.trim()) || [],
      };

      const response = await createFlashcardSet(formattedData, workspaceId);

      // Clear the interval once the API request is done
      clearInterval(interval);

      // Ensure progress bar shows 100% before completing
      setGenerationProgress(100);

      // Add a finalizing state to indicate the flashcards are being finalized
      setIsFinalizing(true);

      // Simulate a short delay for finalizing (e.g., 1 second)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (response) {
        toast("Success!", {
          description: "Flashcard set created successfully.",
          duration: 3000,
        });

        const newFlashcard = {
          id: response.id,
          title: response.title,
          numOfCards: response.numOfCards,
          workspace: response.workspace.name,
          createdBy: {
            name: response.createdBy.fullName,
            avatar:
              response.createdBy.imageUrl ||
              "/placeholder.svg?height=32&width=32",
            initials: response.createdBy.fullName
              .split(" ")
              .map((name) => name[0])
              .join(""),
          },
          sourceDocument: response.digitalResource?.name || "Unknown Document",
          dateCreated: response.createdAt.toISOString(),
          mastery: 0, // Placeholder for mastery calculation
          cardsToReview: 0, // Placeholder for cards to review
          tags: [], // Placeholder for tags
          lastStudied: null, // Placeholder for last studied date
        };
        setFlashcardSets([newFlashcard, ...flashcardSets]);

        router.refresh();
      } else {
        toast.error("Could not create flashcard set.", {
          description: "Please try again later.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.log(error);

      // Clear the interval in case of error
      clearInterval(interval);

      // Reset progress and loading state
      setGenerationProgress(0);
      setIsGenerating(false);
      setIsFinalizing(false);

      toast.error("Error creating flashcard set.", {
        description: "Please try again later.",
        duration: 3000,
      });
    } finally {
      // Ensure loading state is reset
      setIsGenerating(false);
      setIsFinalizing(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Flashcard Set</DialogTitle>
          <DialogDescription>
            Generate an AI-powered flashcard set based on your study materials.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              disabled={isGenerating}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="title">Flashcard Set Title</FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder="Enter a title for your flashcard set"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resourceId"
              disabled={isGenerating}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="resource">Source Material</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={field.disabled}
                  >
                    <FormControl>
                      <SelectTrigger id="resource">
                        <SelectValue placeholder="Select a document" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {resources.map((resource) => (
                        <SelectItem key={resource.id} value={resource.id}>
                          {resource.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The AI will generate flashcards based on this document.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numOfCards"
              disabled={isGenerating}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="numOfCards">Number of Cards</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={field.disabled}
                  >
                    <FormControl>
                      <SelectTrigger id="numOfCards">
                        <SelectValue placeholder="10" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[5, 10, 15, 20, 25].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} questions
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="tags"
              disabled={isGenerating}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="tags">Tags (optional)</FormLabel>
                  <FormControl>
                    <Input
                      id="tags"
                      placeholder="Enter tags separated by commas (e.g., math, calculus, derivatives)"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            /> */}

            {isGenerating && (
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-sm">
                      {generationProgress < 100
                        ? "Generating flashcards..."
                        : "Finalizing flashcard generation..."}
                    </span>
                  </div>
                  <Badge variant="outline">{generationProgress}%</Badge>
                </div>
                <Progress value={generationProgress} className="h-2" />
              </div>
            )}

            <Button type="submit" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Create Flashcards"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
