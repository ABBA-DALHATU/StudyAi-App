"use client";

import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  Users,
  Award,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getQuizzies, getUserbyClerkId } from "@/actions";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import LoaderFetch from "@/components/global/LoaderFetch";
import { QuizContext } from "@/app/dashboard/[workspaceId]/quizzes/page";

// Mock data for quizzes
type User = {
  id: string;
  fullName: string;
  imageUrl: string | null;
};

type QuizAttempt = {
  id: string;
  userId: string;
  score: number;
  user: User;
  createdAt: Date;
};

type DigitalResource = {
  id: string;
  name: string;
};

type Quiz = {
  id: string;
  title: string;
  numOfQuestions: number;
  difficulty: string;
  workspace: {
    name: string;
  };
  createdBy: User;
  attempts: QuizAttempt[];
  digitalResource: DigitalResource | null;
  createdAt: Date;
};

type FormattedUser = {
  name: string;
  avatar: string;
  initials: string;
};

type RecentAttempt = {
  user: FormattedUser;
  score: number;
};

export type FormattedQuiz = {
  id: string;
  title: string;
  numOfQuestions: number;
  difficulty: string;
  workspace: string;
  createdBy: FormattedUser;
  sourceDocument: string;
  attempts: number;
  averageScore: number;
  dateCreated: string;
  myAttempts: number;
  myBestScore: number;
  recentAttempts: RecentAttempt[];
};

export function QuizzesContent({ workspaceId }: { workspaceId: string }) {
  //  const [quizzes, setQuizzes] = useState<FormattedQuiz[]>([]);
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("QuizContext must be used within a QuizProvider");
  }
  const { quizzes, setQuizzes } = context;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentUser = (await getUserbyClerkId())?.data;

        if (!currentUser) return redirect("/auth/callback");
        const res = await getQuizzies(workspaceId);

        if (res) {
          const formattedQuizzes: FormattedQuiz[] = res.map((quiz: Quiz) => ({
            id: quiz.id,
            title: quiz.title,
            numOfQuestions: quiz.numOfQuestions,
            difficulty: quiz.difficulty.toLowerCase(), // Convert enum to lowercase string
            workspace: quiz.workspace.name,
            createdBy: {
              name: quiz.createdBy.fullName,
              avatar:
                quiz.createdBy.imageUrl ||
                "/placeholder.svg?height=32&width=32",
              initials: quiz.createdBy.fullName
                .split(" ")
                .map((name) => name[0])
                .join(""),
            },
            sourceDocument: quiz.digitalResource?.name || "Unknown Document",
            attempts: quiz.attempts.length,
            averageScore:
              quiz.attempts.reduce((sum, attempt) => sum + attempt.score, 0) /
                quiz.attempts.length || 0,
            dateCreated: quiz.createdAt.toISOString(),
            myAttempts: quiz.attempts.filter(
              (attempt) => attempt.userId === currentUser.id // Replace with actual current user ID
            ).length,
            myBestScore:
              Math.max(
                ...quiz.attempts
                  .filter((attempt) => attempt.userId === currentUser.id) // Replace with actual current user ID
                  .map((attempt) => attempt.score)
              ) || 0,
            recentAttempts: quiz.attempts
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
          }));

          setQuizzes(formattedQuizzes);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false); // Set loading to false when fetching is done
      }
    };

    fetchData();
  }, [workspaceId]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "hard":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // if (loading) {
  //   return (
  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  //       {Array.from({ length: 6 }).map((_, index) => (
  //         <Skeleton key={index} className="h-64 w-full" />
  //       ))}
  //     </div>
  //   );
  // }

  if (!quizzes) {
    return (
      <div className="text-center text-muted-foreground">No quizzes found.</div>
    );
  }

  return (
    <div className="mt-6">
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-background"
          >
            All Quizzes
          </TabsTrigger>
          <TabsTrigger
            value="my-quizzes"
            className="data-[state=active]:bg-background"
          >
            My Quizzes
          </TabsTrigger>
          <TabsTrigger
            value="attempted"
            className="data-[state=active]:bg-background"
          >
            Attempted
          </TabsTrigger>
          <TabsTrigger
            value="not-attempted"
            className="data-[state=active]:bg-background"
          >
            Not Attempted
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <LoaderFetch />
            </div>
          ) : quizzes.length === 0 ? (
            <NoQuizzes />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardHeader className="p-4 pb-0">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getDifficultyColor(quiz.difficulty)}
                          >
                            {quiz.difficulty.charAt(0).toUpperCase() +
                              quiz.difficulty.slice(1)}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-blue-500/10 text-blue-500 border-blue-500/20"
                          >
                            {quiz.workspace}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">
                          <Link
                            href={`/dashboard/${workspaceId}/quizzes/${quiz.id}`}
                            className="hover:underline"
                          >
                            {quiz.title}
                          </Link>
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.numOfQuestions} questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.attempts} attempts</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Average Score
                          </span>
                          <span className="font-medium">
                            {quiz.averageScore}%
                          </span>
                        </div>
                        <Progress value={quiz.averageScore} className="h-2" />
                      </div>

                      {quiz.myAttempts > 0 && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Your Best Score
                            </span>
                            <span className="font-medium">
                              {quiz.myBestScore}%
                            </span>
                          </div>
                          <Progress
                            value={quiz.myBestScore}
                            className="h-2 bg-muted/50"
                            indicatorClassName={
                              quiz.myBestScore >= 90
                                ? "bg-green-500"
                                : quiz.myBestScore >= 70
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Based on:</span>
                        <Badge
                          variant="outline"
                          className="px-1.5 py-0 h-5 text-xs"
                        >
                          {quiz.sourceDocument}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={quiz.createdBy.avatar}
                          alt={quiz.createdBy.name}
                        />
                        <AvatarFallback>
                          {quiz.createdBy.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(quiz.dateCreated)}
                      </div>
                    </div>

                    <Button asChild variant="ghost" size="sm" className="gap-1">
                      <Link
                        href={`/dashboard/${workspaceId}/quizzes/${quiz.id}`}
                      >
                        View Quiz
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-quizzes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes
              .filter((quiz) => quiz.createdBy.name === "John Smith") // Just for demo
              .map((quiz) => (
                <Card
                  key={quiz.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardHeader className="p-4 pb-0">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getDifficultyColor(quiz.difficulty)}
                          >
                            {quiz.difficulty.charAt(0).toUpperCase() +
                              quiz.difficulty.slice(1)}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-blue-500/10 text-blue-500 border-blue-500/20"
                          >
                            {quiz.workspace}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">
                          <Link
                            href={`/dashboard/${workspaceId}/quizzes/${quiz.id}`}
                            className="hover:underline"
                          >
                            {quiz.title}
                          </Link>
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.numOfQuestions} questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.attempts} attempts</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Average Score
                          </span>
                          <span className="font-medium">
                            {quiz.averageScore}%
                          </span>
                        </div>
                        <Progress value={quiz.averageScore} className="h-2" />
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Based on:</span>
                        <Badge
                          variant="outline"
                          className="px-1.5 py-0 h-5 text-xs"
                        >
                          {quiz.sourceDocument}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={quiz.createdBy.avatar}
                          alt={quiz.createdBy.name}
                        />
                        <AvatarFallback>
                          {quiz.createdBy.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(quiz.dateCreated)}
                      </div>
                    </div>

                    <Button asChild variant="ghost" size="sm" className="gap-1">
                      <Link
                        href={`/dashboard/${workspaceId}/quizzes/${quiz.id}`}
                      >
                        View Quiz
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="attempted" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes
              .filter((quiz) => quiz.myAttempts > 0)
              .map((quiz) => (
                <Card
                  key={quiz.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardHeader className="p-4 pb-0">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getDifficultyColor(quiz.difficulty)}
                          >
                            {quiz.difficulty.charAt(0).toUpperCase() +
                              quiz.difficulty.slice(1)}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-blue-500/10 text-blue-500 border-blue-500/20"
                          >
                            {quiz.workspace}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">
                          <Link
                            href={`/dashboard/${workspaceId}/quizzes/${quiz.id}`}
                            className="hover:underline"
                          >
                            {quiz.title}
                          </Link>
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.numOfQuestions} questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <span>Attempted {quiz.myAttempts} times</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Your Best Score
                          </span>
                          <span className="font-medium">
                            {quiz.myBestScore}%
                          </span>
                        </div>
                        <Progress
                          value={quiz.myBestScore}
                          className="h-2"
                          indicatorClassName={
                            quiz.myBestScore >= 90
                              ? "bg-green-500"
                              : quiz.myBestScore >= 70
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }
                        />
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Based on:</span>
                        <Badge
                          variant="outline"
                          className="px-1.5 py-0 h-5 text-xs"
                        >
                          {quiz.sourceDocument}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={quiz.createdBy.avatar}
                          alt={quiz.createdBy.name}
                        />
                        <AvatarFallback>
                          {quiz.createdBy.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(quiz.dateCreated)}
                      </div>
                    </div>

                    <Button asChild variant="ghost" size="sm" className="gap-1">
                      <Link
                        href={`/dashboard/${workspaceId}/quizzes/${quiz.id}`}
                      >
                        View Quiz
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="not-attempted" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes
              .filter((quiz) => quiz.myAttempts === 0)
              .map((quiz) => (
                <Card
                  key={quiz.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardHeader className="p-4 pb-0">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getDifficultyColor(quiz.difficulty)}
                          >
                            {quiz.difficulty.charAt(0).toUpperCase() +
                              quiz.difficulty.slice(1)}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-blue-500/10 text-blue-500 border-blue-500/20"
                          >
                            {quiz.workspace}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">
                          <Link
                            href={`/dashboard/${workspaceId}/quizzes/${quiz.id}`}
                            className="hover:underline"
                          >
                            {quiz.title}
                          </Link>
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.numOfQuestions} questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.attempts} attempts</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Average Score
                          </span>
                          <span className="font-medium">
                            {quiz.averageScore}%
                          </span>
                        </div>
                        <Progress value={quiz.averageScore} className="h-2" />
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Based on:</span>
                        <Badge
                          variant="outline"
                          className="px-1.5 py-0 h-5 text-xs"
                        >
                          {quiz.sourceDocument}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={quiz.createdBy.avatar}
                          alt={quiz.createdBy.name}
                        />
                        <AvatarFallback>
                          {quiz.createdBy.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(quiz.dateCreated)}
                      </div>
                    </div>

                    <Button asChild variant="ghost" size="sm" className="gap-1">
                      <Link
                        href={`/dashboard/${workspaceId}/quizzes/${quiz.id}`}
                      >
                        Try Quiz
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NoQuizzes() {
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
