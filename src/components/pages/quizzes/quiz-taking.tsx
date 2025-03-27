"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getQuizWithQuestions, submitQuizAttempt } from "@/actions";

// types/quiz.ts
interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizWithQuestions {
  id: string;
  title: string;
  numOfQuestions: number;
  difficulty: string;
  workspace: string;
  createdBy: {
    name: string;
    avatar: string;
    initials: string;
  };
  sourceDocument: string;
  questions: Question[];
}

// Mock quiz data with questions
// const mockQuizData = {
//   id: "1",
//   title: "Calculus Fundamentals",
//   numOfQuestions: 10,
//   difficulty: "medium",
//   workspace: "Math 101",
//   createdBy: {
//     name: "John Smith",
//     avatar: "/placeholder.svg?height=32&width=32",
//     initials: "JS",
//   },
//   sourceDocument: "Calculus Formulas.pdf",
//   questions: [
//     {
//       id: "q1",
//       question: "What is the derivative of f(x) = x²?",
//       options: ["f'(x) = x", "f'(x) = 2x", "f'(x) = 2", "f'(x) = x²"],
//       correctAnswer: "f'(x) = 2x",
//     },
//     {
//       id: "q2",
//       question: "Which of the following is the power rule for derivatives?",
//       options: [
//         "If f(x) = x^n, then f'(x) = nx^(n-1)",
//         "If f(x) = x^n, then f'(x) = nx^n",
//         "If f(x) = x^n, then f'(x) = x^(n-1)",
//         "If f(x) = x^n, then f'(x) = n^x",
//       ],
//       correctAnswer: "If f(x) = x^n, then f'(x) = nx^(n-1)",
//     },
//     {
//       id: "q3",
//       question: "What is the derivative of sin(x)?",
//       options: ["cos(x)", "-sin(x)", "-cos(x)", "tan(x)"],
//       correctAnswer: "cos(x)",
//     },
//     {
//       id: "q4",
//       question: "What is the derivative of e^x?",
//       options: ["e^x", "xe^(x-1)", "e^(x-1)", "xe^x"],
//       correctAnswer: "e^x",
//     },
//     {
//       id: "q5",
//       question: "What is the derivative of ln(x)?",
//       options: ["1/x", "ln(x)/x", "x/ln(x)", "1/ln(x)"],
//       correctAnswer: "1/x",
//     },
//     {
//       id: "q6",
//       question: "What is the chain rule used for?",
//       options: [
//         "Finding derivatives of products of functions",
//         "Finding derivatives of quotients of functions",
//         "Finding derivatives of composite functions",
//         "Finding derivatives of inverse functions",
//       ],
//       correctAnswer: "Finding derivatives of composite functions",
//     },
//     {
//       id: "q7",
//       question: "What is the integral of x²?",
//       options: ["x³/3 + C", "x³ + C", "2x + C", "x²/2 + C"],
//       correctAnswer: "x³/3 + C",
//     },
//     {
//       id: "q8",
//       question: "What is the fundamental theorem of calculus about?",
//       options: [
//         "The relationship between differentiation and integration",
//         "The relationship between limits and continuity",
//         "The relationship between sequences and series",
//         "The relationship between real and complex numbers",
//       ],
//       correctAnswer: "The relationship between differentiation and integration",
//     },
//     {
//       id: "q9",
//       question: "What is the limit of sin(x)/x as x approaches 0?",
//       options: ["0", "1", "∞", "Does not exist"],
//       correctAnswer: "1",
//     },
//     {
//       id: "q10",
//       question: "Which of the following is NOT a method of integration?",
//       options: [
//         "Substitution",
//         "Integration by parts",
//         "Partial fractions",
//         "Chain rule",
//       ],
//       correctAnswer: "Chain rule",
//     },
//   ],
// };

interface QuizTakingProps {
  id: string;
}

export function QuizTaking({ id }: QuizTakingProps) {
  const [quiz, setQuiz] = useState<QuizWithQuestions | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuizWithQuestions(id);
        setQuiz(data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  // Timer
  useEffect(() => {
    if (!isSubmitted && quiz) {
      const timer = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isSubmitted, quiz]);

  if (loading || !quiz) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" />{" "}
        {/* Replace with your loading spinner */}
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);

    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const calculatedScore = Math.round(
      (correctAnswers / quiz.questions.length) * 100
    );
    setScore(calculatedScore);
    setShowResults(true);

    // Submit quiz attempt to the server
    try {
      await submitQuizAttempt({
        quizId: quiz.id,
        score: calculatedScore,
        timeSpent,
      });
    } catch (error) {
      console.error("Error submitting quiz attempt:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isAnswered = (questionId: string) => {
    return answers[questionId] !== undefined;
  };

  const isCorrect = (questionId: string) => {
    const question = quiz.questions.find((q) => q.id === questionId);
    return question && answers[questionId] === question.correctAnswer;
  };

  const getAnswerStatus = (questionId: string, option: string) => {
    if (!isSubmitted) return null;

    const question = quiz.questions.find((q) => q.id === questionId);
    if (!question) return null;

    if (option === question.correctAnswer) {
      return "correct";
    } else if (answers[questionId] === option) {
      return "incorrect";
    }
    return null;
  };

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

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-amber-500";
    return "text-red-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" />{" "}
        {/* Replace with your loading spinner */}
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Failed to load quiz.</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
          <Link href={`/quizzes/${id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to quiz</span>
          </Link>
        </Button>
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/quizzes" className="hover:text-foreground">
            Quizzes
          </Link>
          <span>/</span>
          <Link href={`/quizzes/${id}`} className="hover:text-foreground">
            {quiz.title}
          </Link>
          <span>/</span>
          <span className="text-foreground">Take Quiz</span>
        </nav>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{quiz.title}</h1>
              <div className="flex items-center gap-2 mt-1">
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
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{quiz.numOfQuestions} questions</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeSpent)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Progress
              value={((currentQuestionIndex + 1) / quiz.questions.length) * 100}
              className="h-2 flex-1"
            />
            <span className="text-sm text-muted-foreground">
              {currentQuestionIndex + 1}/{quiz.questions.length}
            </span>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                Question {currentQuestionIndex + 1}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-lg">{currentQuestion.question}</p>

                <RadioGroup
                  value={answers[currentQuestion.id] || ""}
                  onValueChange={handleAnswerChange}
                  className="space-y-3"
                  disabled={isSubmitted}
                >
                  {currentQuestion.options.map((option, index) => {
                    const status = getAnswerStatus(currentQuestion.id, option);
                    return (
                      <div
                        key={index}
                        className={`flex items-center space-x-2 rounded-md border p-3 
                        ${
                          status === "correct"
                            ? "border-green-500 bg-green-500/10"
                            : status === "incorrect"
                            ? "border-red-500 bg-red-500/10"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <RadioGroupItem
                          value={option}
                          id={`option-${index}`}
                          className={
                            status === "correct"
                              ? "text-green-500"
                              : status === "incorrect"
                              ? "text-red-500"
                              : ""
                          }
                        />
                        <Label
                          htmlFor={`option-${index}`}
                          className="flex-1 cursor-pointer py-1"
                        >
                          {option}
                        </Label>
                        {status === "correct" && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {status === "incorrect" && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <Button
                  onClick={handleNextQuestion}
                  disabled={!isAnswered(currentQuestion.id) && !isSubmitted}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                !isSubmitted && (
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      Object.keys(answers).length < quiz.questions.length
                    }
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Submit Quiz
                  </Button>
                )
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="md:w-64 space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Question Navigator</h3>
              <div className="grid grid-cols-5 gap-2">
                {quiz.questions.map((q, index) => (
                  <Button
                    key={q.id}
                    variant={
                      currentQuestionIndex === index ? "default" : "outline"
                    }
                    size="icon"
                    className={`h-8 w-8 ${
                      isSubmitted && isCorrect(q.id)
                        ? "bg-green-500 hover:bg-green-600 text-white border-green-500"
                        : isSubmitted && isAnswered(q.id)
                        ? "bg-red-500 hover:bg-red-600 text-white border-red-500"
                        : isAnswered(q.id) && !isSubmitted
                        ? "bg-primary/10 border-primary"
                        : ""
                    }`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-primary/10 border border-primary"></div>
                  <span>Answered</span>
                </div>
                {isSubmitted && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span>Correct</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span>Incorrect</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Quiz Progress</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completion</span>
                    <span>
                      {Math.round(
                        (Object.keys(answers).length / quiz.questions.length) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (Object.keys(answers).length / quiz.questions.length) *
                      100
                    }
                    className="h-2"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time Spent</span>
                    <span>{formatTime(timeSpent)}</span>
                  </div>
                </div>

                <div className="pt-2 text-sm text-muted-foreground">
                  {Object.keys(answers).length} of {quiz.questions.length}{" "}
                  questions answered
                </div>

                {!isSubmitted && (
                  <div className="pt-2">
                    <Button
                      onClick={handleSubmit}
                      disabled={
                        Object.keys(answers).length < quiz.questions.length
                      }
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                    >
                      Submit Quiz
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quiz Results</DialogTitle>
            <DialogDescription>
              Youve completed the {quiz.title} quiz.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center text-center">
              <div
                className={`text-5xl font-bold mb-2 ${getScoreColor(score)}`}
              >
                {score}%
              </div>
              <p className="text-sm text-muted-foreground">
                You answered{" "}
                {quiz.questions.filter((q) => isCorrect(q.id)).length} out of{" "}
                {quiz.questions.length} questions correctly.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Score</span>
                <span className={`font-medium ${getScoreColor(score)}`}>
                  {score}%
                </span>
              </div>
              <Progress
                value={score}
                className="h-2"
                indicatorClassName={
                  score >= 90
                    ? "bg-green-500"
                    : score >= 70
                    ? "bg-amber-500"
                    : "bg-red-500"
                }
              />
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-3 mb-3">
                {score >= 70 ? (
                  <>
                    <div className="rounded-full bg-green-500/20 p-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Congratulations!</p>
                      <p className="text-sm text-muted-foreground">
                        Youve passed the quiz.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-full bg-amber-500/20 p-2">
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium">Keep Practicing</p>
                      <p className="text-sm text-muted-foreground">
                        You need 70% or higher to pass.
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-md bg-muted/50 p-2">
                  <p className="text-xs text-muted-foreground">Time Spent</p>
                  <p className="font-medium">{formatTime(timeSpent)}</p>
                </div>
                <div className="rounded-md bg-muted/50 p-2">
                  <p className="text-xs text-muted-foreground">XP Earned</p>
                  <p className="font-medium">
                    +{Math.round(score / 10) * 10} XP
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={quiz.createdBy.avatar}
                  alt={quiz.createdBy.name}
                />
                <AvatarFallback>{quiz.createdBy.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{quiz.title}</p>
                <p className="text-xs text-muted-foreground">
                  Created by {quiz.createdBy.name}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="sm:flex-1"
              onClick={() => {
                setShowResults(false);
                setCurrentQuestionIndex(0);
              }}
            >
              Review Answers
            </Button>
            <Button
              asChild
              className="sm:flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              <Link href={`/quizzes/${id}`}>Back to Quiz</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
