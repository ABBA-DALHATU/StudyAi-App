"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Brain, Clock, ArrowRight, Layers, Sparkles, Zap } from "lucide-react";
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
import { getFlashcards, getUserbyClerkId } from "@/actions";
import { redirect } from "next/navigation";
import LoaderFetch from "@/components/global/LoaderFetch";
import { FlashcardContext } from "@/app/dashboard/[workspaceId]/flashcards/page";

type User = {
  id: string;
  fullName: string;
  imageUrl: string | null;
};

type DigitalResource = {
  id: string;
  name: string;
};

type Flashcard = {
  id: string;
  title: string;
  numOfCards: number;
  workspace: {
    name: string;
  };
  createdBy: User;
  digitalResource: DigitalResource | null;
  createdAt: Date;
};

type FormattedUser = {
  name: string;
  avatar: string;
  initials: string;
};

export type FormattedFlashcard = {
  id: string;
  title: string;
  numOfCards: number;
  workspace: string;
  createdBy: FormattedUser;
  sourceDocument: string;
  dateCreated: string;
  mastery: number; // Placeholder for mastery calculation
  cardsToReview: number; // Placeholder for cards to review
  tags: string[]; // Placeholder for tags
  lastStudied: string | null; // Placeholder for last studied date
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
//   },
//   {
//     id: "2",
//     title: "Physics Formulas",
//     numOfCards: 32,
//     workspace: "Physics Notes",
//     createdBy: {
//       name: "Jane Doe",
//       avatar: "/placeholder.svg?height=32&width=32",
//       initials: "JD",
//     },
//     dateCreated: "2023-03-10T14:20:00Z",
//     lastStudied: "2023-03-18T09:15:00Z",
//     mastery: 60,
//     cardsToReview: 13,
//     tags: ["physics", "formulas", "mechanics"],
//   },
//   {
//     id: "3",
//     title: "Circuit Components",
//     numOfCards: 18,
//     workspace: "Physics Notes",
//     createdBy: {
//       name: "Alex Taylor",
//       avatar: "/placeholder.svg?height=32&width=32",
//       initials: "AT",
//     },
//     dateCreated: "2023-03-05T09:15:00Z",
//     lastStudied: "2023-03-17T16:45:00Z",
//     mastery: 90,
//     cardsToReview: 2,
//     tags: ["electronics", "circuits", "components"],
//   },
//   {
//     id: "4",
//     title: "Programming Concepts",
//     numOfCards: 40,
//     workspace: "Programming",
//     createdBy: {
//       name: "Sam Wilson",
//       avatar: "/placeholder.svg?height=32&width=32",
//       initials: "SW",
//     },
//     dateCreated: "2023-03-01T16:45:00Z",
//     lastStudied: null,
//     mastery: 0,
//     cardsToReview: 40,
//     tags: ["programming", "algorithms", "data structures"],
//   },
//   {
//     id: "5",
//     title: "Biology Terms",
//     numOfCards: 50,
//     workspace: "Biology Class",
//     createdBy: {
//       name: "Morgan Lee",
//       avatar: "/placeholder.svg?height=32&width=32",
//       initials: "ML",
//     },
//     dateCreated: "2023-02-25T13:20:00Z",
//     lastStudied: "2023-03-15T13:20:00Z",
//     mastery: 82,
//     cardsToReview: 9,
//     tags: ["biology", "anatomy", "cells"],
//   },
//   {
//     id: "6",
//     title: "Study Group Notes",
//     numOfCards: 15,
//     workspace: "Study Group A",
//     createdBy: {
//       name: "Taylor Wilson",
//       avatar: "/placeholder.svg?height=32&width=32",
//       initials: "TW",
//     },
//     dateCreated: "2023-02-28T11:30:00Z",
//     lastStudied: "2023-03-16T11:30:00Z",
//     mastery: 70,
//     cardsToReview: 5,
//     tags: ["group study", "notes", "review"],
//   },
// ];

export function FlashcardsContent({ workspaceId }: { workspaceId: string }) {
  // const [flashcardSets, setFlashcardSets] = useState<FormattedFlashcard[]>([]);

  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error("FlashcardContext must be used within a FlashcardProvider");
  }
  const { flashcardSets, setFlashcardSets } = context;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentUser = (await getUserbyClerkId())?.data;

        if (!currentUser) return redirect("/auth/callback");
        const res = await getFlashcards(workspaceId);

        if (res) {
          const formattedFlashcards: FormattedFlashcard[] = res.map(
            (flashcard: Flashcard) => ({
              id: flashcard.id,
              title: flashcard.title,
              numOfCards: flashcard.numOfCards,
              workspace: flashcard.workspace.name,
              createdBy: {
                name: flashcard.createdBy.fullName,
                avatar:
                  flashcard.createdBy.imageUrl ||
                  "/placeholder.svg?height=32&width=32",
                initials: flashcard.createdBy.fullName
                  .split(" ")
                  .map((name) => name[0])
                  .join(""),
              },
              sourceDocument:
                flashcard.digitalResource?.name || "Unknown Document",
              dateCreated: flashcard.createdAt.toISOString(),
              mastery: 0, // Placeholder for mastery calculation
              cardsToReview: 0, // Placeholder for cards to review
              tags: [], // Placeholder for tags
              lastStudied: null, // Placeholder for last studied date
            })
          );

          setFlashcardSets(formattedFlashcards);
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [workspaceId]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return "bg-green-500";
    if (mastery >= 60) return "bg-amber-500";
    if (mastery > 0) return "bg-orange-500";
    return "bg-muted";
  };

  const getRandomGradient = (index: number) => {
    const gradients = [
      "from-amber-500/20 to-amber-500/5",
      "from-blue-500/20 to-blue-500/5",
      "from-green-500/20 to-green-500/5",
      "from-purple-500/20 to-purple-500/5",
      "from-red-500/20 to-red-500/5",
      "from-pink-500/20 to-pink-500/5",
    ];

    return gradients[index % gradients.length];
  };

  return (
    <div className="mt-6">
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-background"
          >
            All Sets
          </TabsTrigger>
          <TabsTrigger
            value="my-sets"
            className="data-[state=active]:bg-background"
          >
            My Sets
          </TabsTrigger>
          <TabsTrigger
            value="need-review"
            className="data-[state=active]:bg-background"
          >
            Need Review
          </TabsTrigger>
          <TabsTrigger
            value="mastered"
            className="data-[state=active]:bg-background"
          >
            Mastered
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <LoaderFetch />
            </div>
          ) : flashcardSets.length === 0 ? (
            <NoFlashcards />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flashcardSets.map((set, index) => (
                <Card
                  key={set.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardHeader
                    className={`p-4 pb-0 bg-gradient-to-b ${getRandomGradient(
                      index
                    )}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5">
                        <Badge
                          variant="outline"
                          className="bg-background/80 backdrop-blur-sm"
                        >
                          {set.workspace}
                        </Badge>
                        <CardTitle className="text-lg">
                          <Link
                            href={`/dashboard/${workspaceId}/flashcards/${set.id}`}
                            className="hover:underline"
                          >
                            {set.title}
                          </Link>
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-muted-foreground" />
                          <span>{set.numOfCards} cards</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-muted-foreground" />
                          <span>{set.cardsToReview} to review</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Mastery</span>
                          <span className="font-medium">{set.mastery}%</span>
                        </div>
                        <Progress
                          value={set.mastery}
                          className="h-2"
                          indicatorClassName={getMasteryColor(set.mastery)}
                        />
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {set.tags.map((tag, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs bg-muted/50"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={set.createdBy.avatar}
                          alt={set.createdBy.name}
                        />
                        <AvatarFallback>
                          {set.createdBy.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {set.lastStudied
                          ? `Studied ${formatDate(set.lastStudied)}`
                          : "Never studied"}
                      </div>
                    </div>

                    <Button asChild variant="ghost" size="sm" className="gap-1">
                      <Link
                        href={`/dashboard/${workspaceId}/flashcards/${set.id}`}
                      >
                        View Set
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-sets" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashcardSets
              .filter((set) => set.createdBy.name === "John Smith") // Just for demo
              .map((set, index) => (
                <Card
                  key={set.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardHeader
                    className={`p-4 pb-0 bg-gradient-to-b ${getRandomGradient(
                      index
                    )}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5">
                        <Badge
                          variant="outline"
                          className="bg-background/80 backdrop-blur-sm"
                        >
                          {set.workspace}
                        </Badge>
                        <CardTitle className="text-lg">
                          <Link
                            href={`/dashboard/${workspaceId}/flashcards/${set.id}`}
                            className="hover:underline"
                          >
                            {set.title}
                          </Link>
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-muted-foreground" />
                          <span>{set.numOfCards} cards</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-muted-foreground" />
                          <span>{set.cardsToReview} to review</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Mastery</span>
                          <span className="font-medium">{set.mastery}%</span>
                        </div>
                        <Progress
                          value={set.mastery}
                          className="h-2"
                          indicatorClassName={getMasteryColor(set.mastery)}
                        />
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {set.tags.map((tag, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs bg-muted/50"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={set.createdBy.avatar}
                          alt={set.createdBy.name}
                        />
                        <AvatarFallback>
                          {set.createdBy.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {set.lastStudied
                          ? `Studied ${formatDate(set.lastStudied)}`
                          : "Never studied"}
                      </div>
                    </div>

                    <Button asChild variant="ghost" size="sm" className="gap-1">
                      <Link
                        href={`/dashboard/${workspaceId}/flashcards/${set.id}`}
                      >
                        View Set
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="need-review" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashcardSets
              .filter((set) => set.cardsToReview > 0)
              .sort((a, b) => b.cardsToReview - a.cardsToReview)
              .map((set, index) => (
                <Card
                  key={set.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardHeader
                    className={`p-4 pb-0 bg-gradient-to-b ${getRandomGradient(
                      index
                    )}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5">
                        <Badge
                          variant="outline"
                          className="bg-background/80 backdrop-blur-sm"
                        >
                          {set.workspace}
                        </Badge>
                        <CardTitle className="text-lg">
                          <Link
                            href={`/dashboard/${workspaceId}/flashcards/${set.id}`}
                            className="hover:underline"
                          >
                            {set.title}
                          </Link>
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-muted-foreground" />
                          <span>{set.numOfCards} cards</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-amber-500" />
                          <span className="font-medium text-amber-500">
                            {set.cardsToReview} to review
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Mastery</span>
                          <span className="font-medium">{set.mastery}%</span>
                        </div>
                        <Progress
                          value={set.mastery}
                          className="h-2"
                          indicatorClassName={getMasteryColor(set.mastery)}
                        />
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {set.tags.map((tag, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs bg-muted/50"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={set.createdBy.avatar}
                          alt={set.createdBy.name}
                        />
                        <AvatarFallback>
                          {set.createdBy.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {set.lastStudied
                          ? `Studied ${formatDate(set.lastStudied)}`
                          : "Never studied"}
                      </div>
                    </div>

                    <Button asChild variant="ghost" size="sm" className="gap-1">
                      <Link
                        href={`/dashboard/${workspaceId}/flashcards/${set.id}/study`}
                      >
                        Study Now
                        <Zap className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="mastered" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashcardSets
              .filter((set) => set.mastery >= 80)
              .sort((a, b) => b.mastery - a.mastery)
              .map((set, index) => (
                <Card
                  key={set.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardHeader
                    className={`p-4 pb-0 bg-gradient-to-b ${getRandomGradient(
                      index
                    )}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5">
                        <Badge
                          variant="outline"
                          className="bg-background/80 backdrop-blur-sm"
                        >
                          {set.workspace}
                        </Badge>
                        <CardTitle className="text-lg">
                          <Link
                            href={`/dashboard/${workspaceId}/flashcards/${set.id}`}
                            className="hover:underline"
                          >
                            {set.title}
                          </Link>
                        </CardTitle>
                      </div>
                      <Badge className="bg-green-500 text-white">
                        <Sparkles className="h-3.5 w-3.5 mr-1" />
                        Mastered
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-muted-foreground" />
                          <span>{set.numOfCards} cards</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-green-500" />
                          <span className="text-green-500">
                            {set.cardsToReview} to review
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Mastery</span>
                          <span className="font-medium text-green-500">
                            {set.mastery}%
                          </span>
                        </div>
                        <Progress
                          value={set.mastery}
                          className="h-2"
                          indicatorClassName="bg-green-500"
                        />
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {set.tags.map((tag, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs bg-muted/50"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={set.createdBy.avatar}
                          alt={set.createdBy.name}
                        />
                        <AvatarFallback>
                          {set.createdBy.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {set.lastStudied
                          ? `Studied ${formatDate(set.lastStudied)}`
                          : "Never studied"}
                      </div>
                    </div>

                    <Button asChild variant="ghost" size="sm" className="gap-1">
                      <Link
                        href={`/dashboard/${workspaceId}/flashcards/${set.id}`}
                      >
                        View Set
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

function NoFlashcards() {
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
