"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Brain } from "lucide-react";
import { useContext, useEffect, useState } from "react";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { createQuiz, getDigitalResources } from "@/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getUserbyClerkId } from "@/actions";
import { redirect } from "next/navigation";
import { QuizContext } from "@/app/dashboard/[workspaceId]/quizzes/page";

interface Resource {
  id: string;
  name: string;
  type: string;
  url: string;
  // Add other necessary fields based on your data
}

// Mock data for the example
// const workspaces = [
//   { id: "1", name: "Personal" },
//   { id: "2", name: "Work" },
//   { id: "3", name: "School" },
// ];

// const resources = [
//   { id: "1", name: "Introduction to AI" },
//   { id: "2", name: "Web Development Basics" },
//   { id: "3", name: "Data Structures and Algorithms" },
// ];

// Define the form schema with Zod
const formSchema = z.object({
  title: z.string().min(1, "Quiz title is required"),
  resourceId: z.string().min(1, "Please select a source material"),
  numOfQuestions: z.string().min(1, "Please select number of questions"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
    required_error: "Please select a difficulty level",
  }),
});

// Type for our form values
type QuizFormValues = z.infer<typeof formSchema>;
interface CreateQuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
}

export function CreateQuizModal({
  open,
  onOpenChange,
  workspaceId,
}: CreateQuizModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const [resources, setResources] = useState<Resource[]>([]);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const router = useRouter();

  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("QuizContext must be used within a QuizProvider");
  }
  const { quizzes, setQuizzes } = context;

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
  const form = useForm<QuizFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      resourceId: "",
      numOfQuestions: "10",
      difficulty: "MEDIUM",
    },
  });

  // Form submission handler
  // const onSubmit = async (data: QuizFormValues) => {
  //   console.log("Form data:", data);

  //   // Simulate quiz generation
  //   setIsGenerating(true);
  //   setGenerationProgress(0);

  //   // Mock progress updates
  //   const interval = setInterval(() => {
  //     setGenerationProgress((prev) => {
  //       const newProgress = prev + 10;
  //       if (newProgress >= 100) {
  //         clearInterval(interval);
  //         setIsGenerating(false);
  //         onOpenChange(false);

  //         return 100;
  //       }
  //       return newProgress;
  //     });
  //   }, 500);

  //   try {
  //     const formattedData = {
  //       title: data?.title,
  //       numOfQuestions: Number(data?.numOfQuestions),
  //       difficulty: data?.difficulty,
  //       resourceId: data?.resourceId,
  //     };

  //     const response = await createQuiz(formattedData, workspaceId);

  //     if (response) {
  //       toast("Success!", {
  //         description: "File uploaded successfully.",
  //         duration: 3000,
  //       });
  //       router.refresh();
  //     } else {
  //       toast.error("couldnot upload file.", {
  //         description: "Please try again later.",
  //         duration: 3000,
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Error uploading project.", {
  //       description: "Please try again later.",
  //       duration: 3000,
  //     });
  //   }
  // };

  const onSubmit = async (data: QuizFormValues) => {
    console.log("Form data:", data);

    // Simulate quiz generation
    setIsGenerating(true);
    setGenerationProgress(0);

    // let interval: NodeJS.Timeout;

    // Mock progress updates
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
        title: data?.title,
        numOfQuestions: Number(data?.numOfQuestions),
        difficulty: data?.difficulty,
        resourceId: data?.resourceId,
      };
      const [userResponse, response] = await Promise.all([
        getUserbyClerkId(),
        createQuiz(formattedData, workspaceId),
      ]);

      const currentUser = userResponse?.data;
      if (!currentUser) return redirect("/auth/callback");

      // Clear the interval once the API request is done
      clearInterval(interval);

      // Ensure progress bar shows 100% before completing
      setGenerationProgress(100);

      // Add a finalizing state to indicate the quiz is being finalized
      setIsFinalizing(true);

      // Simulate a short delay for finalizing (e.g., 1 second)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (response) {
        toast("Success!", {
          description: "File uploaded successfully.",
          duration: 3000,
        });

        const newQuiz = {
          id: response.id,
          title: response.title,
          numOfQuestions: response.numOfQuestions,
          difficulty: response.difficulty.toLowerCase(), // Convert enum to lowercase string
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
          attempts: response.attempts.length,
          averageScore:
            response.attempts.reduce((sum, attempt) => sum + attempt.score, 0) /
              response.attempts.length || 0,
          dateCreated: response.createdAt.toISOString(),
          myAttempts: response.attempts.filter(
            (attempt) => attempt.userId === currentUser.id // Replace with actual current user ID
          ).length,
          myBestScore:
            Math.max(
              ...response.attempts
                .filter((attempt) => attempt.userId === currentUser.id) // Replace with actual current user ID
                .map((attempt) => attempt.score)
            ) || 0,
          recentAttempts: response.attempts
            .slice(-3) // Get the last 3 attempts
            .map((attempt) => ({
              user: {
                name: attempt.user.fullName,
                avatar:
                  attempt.user.imageUrl ||
                  "/placeholder.svg?height=32&width=32",
                initials: attempt.user.fullName
                  .split(" ")
                  .map((name) => name[0])
                  .join(""),
              },
              score: attempt.score,
            })),
        };

        setQuizzes([newQuiz, ...quizzes]);
        router.refresh();
      } else {
        toast.error("Could not upload file.", {
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

      toast.error("Error uploading project.", {
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
          <DialogTitle>Create New Quiz</DialogTitle>
          <DialogDescription>
            Generate an AI-powered quiz based on your study materials.
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
                  <FormLabel htmlFor="title">Quiz Title</FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder="Enter a title for your quiz"
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
                    The AI will generate questions based on this document.
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numOfQuestions"
                disabled={isGenerating}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel htmlFor="numOfQuestions">
                      Number of Questions
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={field.disabled}
                    >
                      <FormControl>
                        <SelectTrigger id="numOfQuestions">
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

              <FormField
                control={form.control}
                name="difficulty"
                disabled={isGenerating}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Difficulty Level</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex gap-4"
                        disabled={field.disabled}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="EASY" id="easy" />
                          <FormLabel htmlFor="easy" className="cursor-pointer">
                            <Badge
                              variant="outline"
                              className="bg-green-500/10 text-green-500 border-green-500/20"
                            >
                              Easy
                            </Badge>
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="MEDIUM" id="medium" />
                          <FormLabel
                            htmlFor="medium"
                            className="cursor-pointer"
                          >
                            <Badge
                              variant="outline"
                              className="bg-amber-500/10 text-amber-500 border-amber-500/20"
                            >
                              Medium
                            </Badge>
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="HARD" id="hard" />
                          <FormLabel htmlFor="hard" className="cursor-pointer">
                            <Badge
                              variant="outline"
                              className="bg-red-500/10 text-red-500 border-red-500/20"
                            >
                              Hard
                            </Badge>
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {isGenerating && (
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-sm">
                      {generationProgress < 100
                        ? "Generating quiz questions..."
                        : "Finalizing quiz generation..."}
                    </span>
                  </div>
                  <Badge variant="outline">{generationProgress}%</Badge>
                </div>
                <Progress value={generationProgress} className="h-2" />
              </div>
            )}

            <Button type="submit" disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Quiz"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
