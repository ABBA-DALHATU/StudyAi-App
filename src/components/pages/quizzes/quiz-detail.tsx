"use client";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Users,
  Award,
  Brain,
  Clock,
  BarChart3,
  ArrowRight,
  Star,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getQuiz, getUserbyClerkId } from "@/actions";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

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
  date: string; // Add the `date` field
};

type FormattedQuiz = {
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

interface QuizDetailProps {
  id: string;
  workspaceId: string;
}

export function QuizDetail({ id, workspaceId }: QuizDetailProps) {
  const [quiz, setQuiz] = useState<FormattedQuiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentUser = (await getUserbyClerkId())?.data;

        if (!currentUser) return redirect("/auth/callback");
        const quiz = await getQuiz(id);

        if (quiz) {
          setQuiz(quiz);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-amber-500";
    return "text-red-500";
  };

  if (loading || !quiz) {
    return (
      <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin" />{" "}
      {/* Replace with your loading spinner */}
    </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
          <Link href={`/dashboard/${workspaceId}/quizzes`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to quizzes</span>
          </Link>
        </Button>
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href={`/dashboard/${workspaceId}/quizzes`} className="hover:text-foreground">
            Quizzes
          </Link>
          <span>/</span>
          <span className="text-foreground">{quiz.title}</span>
        </nav>
      </div>

      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex-1 space-y-6">
          <div className="space-y-4">
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

            <div>
              <h1 className="text-2xl font-bold">{quiz.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>{quiz.numOfQuestions} questions</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{quiz.attempts} attempts</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  <span>{quiz.averageScore}% avg. score</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={quiz.createdBy.avatar}
                  alt={quiz.createdBy.name}
                />
                <AvatarFallback>{quiz.createdBy.initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Created by </span>
                  <span className="font-medium">{quiz.createdBy.name}</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(quiz.dateCreated)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Based on:</span>
              <Badge variant="outline" className="px-2 py-0.5">
                {quiz.sourceDocument}
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="leaderboard" className="space-y-4">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger
                value="leaderboard"
                className="data-[state=active]:bg-background"
              >
                Leaderboard
              </TabsTrigger>
              <TabsTrigger
                value="statistics"
                className="data-[state=active]:bg-background"
              >
                Statistics
              </TabsTrigger>
              <TabsTrigger
                value="my-attempts"
                className="data-[state=active]:bg-background"
              >
                My Attempts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="leaderboard" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Top Performers</CardTitle>
                  <CardDescription>
                    Students with the highest scores on this quiz
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quiz.recentAttempts
                      .sort((a, b) => b.score - a.score)
                      .slice(0, 5)
                      .map((attempt, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                            {index + 1}
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={attempt.user.avatar}
                              alt={attempt.user.name}
                            />
                            <AvatarFallback>
                              {attempt.user.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {attempt.user.name}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(attempt.date)}
                            </div>
                          </div>
                          <div
                            className={`font-medium ${getScoreColor(
                              attempt.score
                            )}`}
                          >
                            {attempt.score}%
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recent Attempts</CardTitle>
                  <CardDescription>
                    Latest quiz attempts by students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quiz.recentAttempts
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime()
                      )
                      .map((attempt, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={attempt.user.avatar}
                              alt={attempt.user.name}
                            />
                            <AvatarFallback>
                              {attempt.user.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {attempt.user.name}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(attempt.date)}
                            </div>
                          </div>
                          <div
                            className={`font-medium ${getScoreColor(
                              attempt.score
                            )}`}
                          >
                            {attempt.score}%
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statistics" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Quiz Statistics</CardTitle>
                  <CardDescription>
                    Performance metrics for this quiz
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Average Score
                        </span>
                        <span className="font-medium">
                          {quiz.averageScore}%
                        </span>
                      </div>
                      <Progress value={quiz.averageScore} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Highest Score
                          </span>
                          <span className="font-medium text-green-500">
                            {Math.max(
                              ...quiz.recentAttempts.map((a) => a.score)
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={Math.max(
                            ...quiz.recentAttempts.map((a) => a.score)
                          )}
                          className="h-2"
                          indicatorClassName="bg-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Lowest Score
                          </span>
                          <span className="font-medium text-red-500">
                            {Math.min(
                              ...quiz.recentAttempts.map((a) => a.score)
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={Math.min(
                            ...quiz.recentAttempts.map((a) => a.score)
                          )}
                          className="h-2"
                          indicatorClassName="bg-red-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="rounded-lg border p-3 text-center">
                        <div className="text-2xl font-bold">
                          {quiz.attempts}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Total Attempts
                        </p>
                      </div>

                      <div className="rounded-lg border p-3 text-center">
                        <div className="text-2xl font-bold">
                          {
                            quiz.recentAttempts.filter((a) => a.score >= 70)
                              .length
                          }
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Passing Scores
                        </p>
                      </div>

                      <div className="rounded-lg border p-3 text-center">
                        <div className="text-2xl font-bold">
                          {Math.round(
                            (quiz.recentAttempts.filter((a) => a.score >= 70)
                              .length /
                              quiz.recentAttempts.length) *
                              100
                          )}
                          %
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Pass Rate
                        </p>
                      </div>
                    </div>

                    <div className="h-[200px] flex items-center justify-center border rounded-md">
                      <div className="flex flex-col items-center text-muted-foreground">
                        <BarChart3 className="h-8 w-8 mb-2" />
                        <p className="text-sm">
                          Score distribution chart would appear here
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="my-attempts" className="space-y-4">
              {quiz.myAttempts > 0 ? (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Your Quiz Attempts
                    </CardTitle>
                    <CardDescription>
                      Your performance on this quiz
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Your Best Score
                          </span>
                          <span
                            className={`font-medium ${getScoreColor(
                              quiz.myBestScore
                            )}`}
                          >
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

                      <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-lg border p-3 text-center">
                          <div className="text-2xl font-bold">
                            {quiz.myAttempts}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Your Attempts
                          </p>
                        </div>

                        <div className="rounded-lg border p-3 text-center">
                          <div className="text-2xl font-bold">
                            {quiz.myBestScore}%
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Best Score
                          </p>
                        </div>

                        <div className="rounded-lg border p-3 text-center">
                          <div className="text-2xl font-bold">
                            {quiz.myBestScore >= 70 ? "Pass" : "Fail"}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Status
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">
                          Your Recent Attempts
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center gap-2">
                              <div className="rounded-full bg-primary/10 p-1.5">
                                <Star className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  First Attempt
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  March 16, 2023
                                </p>
                              </div>
                            </div>
                            <div className={`font-medium ${getScoreColor(75)}`}>
                              75%
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center gap-2">
                              <div className="rounded-full bg-primary/10 p-1.5">
                                <Award className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  Best Attempt
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  March 18, 2023
                                </p>
                              </div>
                            </div>
                            <div
                              className={`font-medium ${getScoreColor(
                                quiz.myBestScore
                              )}`}
                            >
                              {quiz.myBestScore}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <Brain className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Attempts Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You havent taken this quiz yet. Take the quiz to see your
                    performance.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:w-80 space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-green-500/10 p-3 mb-3">
                    <Brain className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="font-medium">Ready to Test Your Knowledge?</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Take this quiz to assess your understanding of {quiz.title}.
                  </p>

                  <Button
                    asChild
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Link href={`/dashboard/${workspaceId}/quizzes/${id}/take`}>
                      Take This Quiz
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {quiz.numOfQuestions} multiple-choice questions
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Estimated time: {quiz.numOfQuestions} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span>Earn XP based on your score</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {quiz.myAttempts > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Best Score
                    </span>
                    <span
                      className={`font-medium ${getScoreColor(
                        quiz.myBestScore
                      )}`}
                    >
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
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Attempts</span>
                    <span>{quiz.myAttempts}</span>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/quizzes/${quiz.id}/take`}>Try Again</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
