"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  Clock,
  Layers,
  BarChart3,
  Sparkles,
  Zap,
  Search,
  Plus,
  Edit,
  Trash2,
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
import { Input } from "@/components/ui/input";
import { FlashcardPreview } from "./flashcard-preview";
import LoaderFetch from "@/components/global/LoaderFetch";
import { getFlashcard } from "@/actions";

// type User = {
//   id: string;
//   fullName: string;
//   imageUrl: string | null;
// };
type FormattedUser = {
  name: string;
  avatar: string;
  initials: string | null;
};

type DigitalResource = {
  id: string;
  name: string;
};

type Flashcard = {
  id: string;
  front: string;
  back: string;
};

type FlashcardSet = {
  id: string;
  title: string;
  numOfCards: number;
  workspace: string;
  createdBy: FormattedUser;
  sourceDocument: string;
  dateCreated: string;
  mastery: number;
  cardsToReview: number;
  tags: string[];
  lastStudied: string | null;
  cards: Flashcard[];
  studyHistory: {
    date: string;
    cardsStudied: number;
    correctAnswers: number;
  }[];
};

// Mock data for flashcard sets
// const mockFlashcardSets = [
//   {
//     id: "1",
//     title: "Calculus Key Concepts",
//     numOfCards: 24,
//     workspace: "Math 101",
//     createdBy: {
//       name: "John Smith",
//       avatar: "/placeholder.svg?height=32&width=32",
//       initials: "JS",
//     },
//     dateCreated: "2023-03-15T10:30:00Z",
//     lastStudied: "2023-03-20T14:30:00Z",
//     mastery: 75,
//     cardsToReview: 6,
//     tags: ["math", "calculus", "derivatives"],
//     cards: [
//       {
//         id: "c1",
//         front: "What is a derivative?",
//         back: "A derivative measures the rate at which a function is changing at a given point. It represents the slope of the tangent line to the function at that point.",
//       },
//       {
//         id: "c2",
//         front: "What is the power rule for derivatives?",
//         back: "If f(x) = x^n, then f'(x) = n·x^(n-1)",
//       },
//       {
//         id: "c3",
//         front: "What is the derivative of sin(x)?",
//         back: "The derivative of sin(x) is cos(x)",
//       },
//       {
//         id: "c4",
//         front: "What is the derivative of e^x?",
//         back: "The derivative of e^x is e^x",
//       },
//       {
//         id: "c5",
//         front: "What is the chain rule?",
//         back: "The chain rule is a formula for computing the derivative of a composite function. If h(x) = f(g(x)), then h'(x) = f'(g(x)) · g'(x)",
//       },
//       {
//         id: "c6",
//         front: "What is an integral?",
//         back: "An integral represents the area under a curve. It is the reverse operation of differentiation.",
//       },
//     ],
//     studyHistory: [
//       { date: "2023-03-20T14:30:00Z", cardsStudied: 24, correctAnswers: 18 },
//       { date: "2023-03-18T09:15:00Z", cardsStudied: 24, correctAnswers: 16 },
//       { date: "2023-03-15T13:20:00Z", cardsStudied: 24, correctAnswers: 12 },
//     ],
//   },
// ];

interface FlashcardSetDetailProps {
  id: string;
  workspaceId: string;
}

export function FlashcardSetDetail({
  id,
  workspaceId,
}: FlashcardSetDetailProps) {
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const flashcard = await getFlashcard(id);

        if (flashcard) {
          setFlashcardSet(flashcard);
        }
      } catch (error) {
        console.error("Error fetching flashcard set:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return "bg-green-500";
    if (mastery >= 60) return "bg-amber-500";
    if (mastery > 0) return "bg-orange-500";
    return "bg-muted";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <LoaderFetch />
      </div>
    );
  }

  if (!flashcardSet) {
    return (
      <div className="text-center text-muted-foreground">
        Flashcard set not found.
      </div>
    );
  }

  const filteredCards = flashcardSet.cards.filter(
    (card) =>
      card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.back.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
          <Link href="/flashcards">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to flashcards</span>
          </Link>
        </Button>
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/flashcards" className="hover:text-foreground">
            Flashcards
          </Link>
          <span>/</span>
          <span className="text-foreground">{flashcardSet.title}</span>
        </nav>
      </div>

      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex-1 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-blue-500/10 text-blue-500 border-blue-500/20"
              >
                {flashcardSet.workspace}
              </Badge>
              {flashcardSet.mastery >= 80 && (
                <Badge className="bg-green-500 text-white">
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  Mastered
                </Badge>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold">{flashcardSet.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Layers className="h-4 w-4" />
                  <span>{flashcardSet.numOfCards} cards</span>
                </div>
                <div className="flex items-center gap-1">
                  <Brain className="h-4 w-4" />
                  <span>{flashcardSet.cardsToReview} to review</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    Last studied {formatDate(flashcardSet.lastStudied)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={flashcardSet.createdBy.avatar}
                  alt={flashcardSet.createdBy.name}
                />
                <AvatarFallback>
                  {flashcardSet.createdBy.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Created by </span>
                  <span className="font-medium">
                    {flashcardSet.createdBy.name}
                  </span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(flashcardSet.dateCreated)}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {flashcardSet.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-muted/50">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Mastery</span>
                <span className="font-medium">{flashcardSet.mastery}%</span>
              </div>
              <Progress
                value={flashcardSet.mastery}
                className="h-2"
                indicatorClassName={getMasteryColor(flashcardSet.mastery)}
              />
            </div>
          </div>

          <Tabs defaultValue="cards" className="space-y-4">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger
                value="cards"
                className="data-[state=active]:bg-background"
              >
                Cards
              </TabsTrigger>
              <TabsTrigger
                value="statistics"
                className="data-[state=active]:bg-background"
              >
                Statistics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cards" className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search cards..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add card</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCards.map((card) => (
                  <FlashcardPreview key={card.id} card={card} />
                ))}
              </div>

              {filteredCards.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No cards found</h3>
                  <p className="text-muted-foreground mb-4">
                    No cards match your search query. Try a different search
                    term.
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="statistics" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Study Statistics</CardTitle>
                  <CardDescription>
                    Your performance with this flashcard set
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="rounded-lg border p-3 text-center">
                        <div className="text-2xl font-bold">
                          {flashcardSet.studyHistory.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Study Sessions
                        </p>
                      </div>

                      <div className="rounded-lg border p-3 text-center">
                        <div className="text-2xl font-bold">
                          {flashcardSet.mastery}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Mastery Level
                        </p>
                      </div>

                      <div className="rounded-lg border p-3 text-center">
                        <div className="text-2xl font-bold">
                          {flashcardSet.cardsToReview}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Cards to Review
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">
                        Recent Study Sessions
                      </h3>
                      <div className="space-y-3">
                        {flashcardSet.studyHistory.map((session, index) => {
                          const accuracy = Math.round(
                            (session.correctAnswers / session.cardsStudied) *
                              100
                          );
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 border rounded-md"
                            >
                              <div className="flex items-center gap-2">
                                <div className="rounded-full bg-amber-500/10 p-1.5">
                                  <Brain className="h-4 w-4 text-amber-500" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">
                                    Study Session
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(session.date)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">
                                  {accuracy}% Accuracy
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {session.correctAnswers} of{" "}
                                  {session.cardsStudied} correct
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="h-[200px] flex items-center justify-center border rounded-md">
                      <div className="flex flex-col items-center text-muted-foreground">
                        <BarChart3 className="h-8 w-8 mb-2" />
                        <p className="text-sm">
                          Performance chart would appear here
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:w-80 space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-amber-500/10 p-3 mb-3">
                    <Brain className="h-6 w-6 text-amber-500" />
                  </div>
                  <h3 className="font-medium">Ready to Study?</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Test your knowledge with these flashcards.
                  </p>

                  <Button
                    asChild
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    <Link
                      href={`/dashboard/${workspaceId}/flashcards/${id}/study`}
                    >
                      Study Now
                      <Zap className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      <span>{flashcardSet.numOfCards} flashcards to study</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Brain className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {flashcardSet.cardsToReview} cards need review
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                      <span>Earn XP for each study session</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Flashcards
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Cards
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Flashcard Set
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
