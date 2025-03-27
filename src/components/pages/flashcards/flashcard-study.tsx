"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Layers,
  Check,
  X,
  HelpCircle,
  ArrowRight,
  ArrowLeftIcon,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getFlashcardSet } from "@/actions";
import LoaderFetch from "@/components/global/LoaderFetch";

type Flashcard = {
  id: string;
  front: string;
  back: string;
};

type User = {
  name: string;
  avatar: string;
  initials: string;
};

type FlashcardSet = {
  id: string;
  title: string;
  workspace: string;
  createdBy: User;
  dateCreated: string;
  mastery: number;
  cardsToReview: number;
  tags: string[];
  lastStudied: string | null;
  cards: Flashcard[];
  numOfCards: number;
};

type CardStatus = "correct" | "incorrect" | "reviewing";

interface FlashcardStudyProps {
  id: string;
}

export function FlashcardStudy({ id }: FlashcardStudyProps) {
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardStatuses, setCardStatuses] = useState<Record<string, CardStatus>>(
    {}
  );
  const [timeSpent, setTimeSpent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getFlashcardSet(id);

        const formattedData: FlashcardSet = {
          ...data,
          createdBy: {
            name: data.createdBy.fullName,
            avatar:
              data.createdBy.imageUrl || "/placeholder.svg?height=32&width=32",
            initials: data.createdBy.fullName
              .split(" ")
              .map((name) => name[0])
              .join(""),
          },
          dateCreated: data.createdAt.toISOString(),
          cards: (data.jsonData || []) as Flashcard[], // Handle null/undefined and assert type
          numOfCards: data.cards.length,
          workspace: data.workspace.name,
          mastery: 0,
          cardsToReview: 0,
          tags: [],
          lastStudied: null,
        };

        setFlashcardSet(formattedData);
      } catch (error) {
        console.error("Error fetching flashcard set:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!isCompleted && flashcardSet) {
      const timer = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isCompleted, flashcardSet]);

  const handleNextCard = () => {
    if (!flashcardSet) return;

    if (currentCardIndex < flashcardSet.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else if (Object.keys(cardStatuses).length === flashcardSet.cards.length) {
      setIsCompleted(true);
      setShowResults(true);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleCardStatus = (status: CardStatus) => {
    if (!flashcardSet) return;

    setCardStatuses({
      ...cardStatuses,
      [flashcardSet.cards[currentCardIndex].id]: status,
    });

    setTimeout(() => {
      handleNextCard();
    }, 500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getCardStatus = (cardId: string) => {
    return cardStatuses[cardId] || "reviewing";
  };

  const getProgressPercentage = () => {
    if (!flashcardSet) return 0;
    return (Object.keys(cardStatuses).length / flashcardSet.cards.length) * 100;
  };

  const getCorrectCount = () => {
    return Object.values(cardStatuses).filter((status) => status === "correct")
      .length;
  };

  const getIncorrectCount = () => {
    return Object.values(cardStatuses).filter(
      (status) => status === "incorrect"
    ).length;
  };

  const getAccuracyPercentage = () => {
    const correct = getCorrectCount();
    const total = Object.keys(cardStatuses).length;
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderFetch />
      </div>
    );
  }

  if (!flashcardSet) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-medium">Flashcard set not found</h2>
          <Button asChild className="mt-4">
            <Link href="/flashcards">Back to Flashcards</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentCard = flashcardSet.cards[currentCardIndex];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
          <Link href={`/flashcards/${id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to flashcard set</span>
          </Link>
        </Button>
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/flashcards" className="hover:text-foreground">
            Flashcards
          </Link>
          <span>/</span>
          <Link href={`/flashcards/${id}`} className="hover:text-foreground">
            {flashcardSet.title}
          </Link>
          <span>/</span>
          <span className="text-foreground">Study</span>
        </nav>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{flashcardSet.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className="bg-blue-500/10 text-blue-500 border-blue-500/20"
                >
                  {flashcardSet.workspace}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Layers className="h-4 w-4" />
                  <span>{flashcardSet.cards.length} cards</span>
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
            <Progress value={getProgressPercentage()} className="h-2 flex-1" />
            <span className="text-sm text-muted-foreground">
              {Object.keys(cardStatuses).length}/{flashcardSet.cards.length}
            </span>
          </div>

          <div className="relative perspective-1000 mx-auto max-w-2xl">
            <Card
              className={`min-h-[300px] cursor-pointer transition-all duration-500 transform-style-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className="absolute inset-0 backface-hidden">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex-1 flex items-center justify-center p-4 text-center text-lg">
                    <p className="font-medium">{currentCard.front}</p>
                  </div>
                  <div className="text-sm text-muted-foreground text-center">
                    Click to reveal answer
                  </div>
                </CardContent>
              </div>

              <div className="absolute inset-0 rotate-y-180 backface-hidden">
                <CardContent className="p-6 h-full flex flex-col bg-amber-500/5 border-amber-500/20">
                  <div className="flex-1 flex items-center justify-center p-4 text-center text-lg">
                    <p>{currentCard.back}</p>
                  </div>
                  <div className="text-sm text-muted-foreground text-center">
                    How well did you know this?
                  </div>
                </CardContent>
              </div>
            </Card>

            <div className="absolute top-4 left-4 flex items-center gap-1">
              <Badge
                variant="outline"
                className="bg-background/80 backdrop-blur-sm"
              >
                {currentCardIndex + 1}/{flashcardSet.cards.length}
              </Badge>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevCard}
              disabled={currentCardIndex === 0}
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {isFlipped && (
                <>
                  <Button
                    variant="outline"
                    className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 hover:text-red-600"
                    onClick={() => handleCardStatus("incorrect")}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Didn't Know
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20 hover:text-amber-600"
                    onClick={() => handleCardStatus("reviewing")}
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Somewhat Knew
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20 hover:text-green-600"
                    onClick={() => handleCardStatus("correct")}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Knew It
                  </Button>
                </>
              )}

              {!isFlipped && (
                <Button
                  onClick={() => setIsFlipped(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Show Answer
                </Button>
              )}
            </div>

            <Button
              variant="outline"
              onClick={handleNextCard}
              disabled={
                currentCardIndex === flashcardSet.cards.length - 1 &&
                !Object.keys(cardStatuses).includes(currentCard.id)
              }
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="md:w-64 space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Card Navigator</h3>
              <div className="grid grid-cols-5 gap-2">
                {flashcardSet.cards.map((card, index) => {
                  const status = getCardStatus(card.id);
                  return (
                    <Button
                      key={card.id}
                      variant={
                        currentCardIndex === index ? "default" : "outline"
                      }
                      size="icon"
                      className={`h-8 w-8 ${
                        status === "correct"
                          ? "bg-green-500 hover:bg-green-600 text-white border-green-500"
                          : status === "incorrect"
                          ? "bg-red-500 hover:bg-red-600 text-white border-red-500"
                          : status === "reviewing"
                          ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
                          : ""
                      }`}
                      onClick={() => {
                        setCurrentCardIndex(index);
                        setIsFlipped(false);
                      }}
                    >
                      {index + 1}
                    </Button>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>Knew It ({getCorrectCount()})</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                  <span>
                    Somewhat Knew (
                    {
                      Object.values(cardStatuses).filter(
                        (status) => status === "reviewing"
                      ).length
                    }
                    )
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span>Didn't Know ({getIncorrectCount()})</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Study Progress</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completion</span>
                    <span>{Math.round(getProgressPercentage())}%</span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-2" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Accuracy</span>
                    <span>{getAccuracyPercentage()}%</span>
                  </div>
                  <Progress
                    value={getAccuracyPercentage()}
                    className="h-2"
                    indicatorClassName={
                      getAccuracyPercentage() >= 80
                        ? "bg-green-500"
                        : getAccuracyPercentage() >= 60
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time Spent</span>
                    <span>{formatTime(timeSpent)}</span>
                  </div>
                </div>

                <div className="pt-2 text-sm text-muted-foreground">
                  {Object.keys(cardStatuses).length} of{" "}
                  {flashcardSet.cards.length} cards reviewed
                </div>

                {Object.keys(cardStatuses).length ===
                  flashcardSet.cards.length &&
                  !isCompleted && (
                    <div className="pt-2">
                      <Button
                        onClick={() => {
                          setIsCompleted(true);
                          setShowResults(true);
                        }}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                      >
                        Complete Study Session
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
            <DialogTitle>Study Session Complete!</DialogTitle>
            <DialogDescription>
              You've completed studying {flashcardSet.title}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-amber-500/20 p-3 mb-3">
                <Sparkles className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="font-medium">Great job!</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                You've earned +{Math.round(getAccuracyPercentage() / 10) * 5} XP
                for this study session.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Accuracy</span>
                <span className="font-medium">{getAccuracyPercentage()}%</span>
              </div>
              <Progress
                value={getAccuracyPercentage()}
                className="h-2"
                indicatorClassName={
                  getAccuracyPercentage() >= 80
                    ? "bg-green-500"
                    : getAccuracyPercentage() >= 60
                    ? "bg-amber-500"
                    : "bg-red-500"
                }
              />
            </div>

            <div className="rounded-lg border p-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-md bg-green-500/10 p-2">
                  <p className="text-xs text-muted-foreground">Knew It</p>
                  <p className="font-medium">{getCorrectCount()}</p>
                </div>
                <div className="rounded-md bg-amber-500/10 p-2">
                  <p className="text-xs text-muted-foreground">Somewhat Knew</p>
                  <p className="font-medium">
                    {
                      Object.values(cardStatuses).filter(
                        (status) => status === "reviewing"
                      ).length
                    }
                  </p>
                </div>
                <div className="rounded-md bg-red-500/10 p-2">
                  <p className="text-xs text-muted-foreground">Didn't Know</p>
                  <p className="font-medium">{getIncorrectCount()}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="rounded-full bg-muted p-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Time Spent</p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(timeSpent)}
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
                setCurrentCardIndex(0);
                setIsFlipped(false);
              }}
            >
              Review Cards Again
            </Button>
            <Button
              asChild
              className="sm:flex-1 bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Link href={`/flashcards/${id}`}>Back to Flashcard Set</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
