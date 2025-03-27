"use client";

import {
  FlashcardsContent,
  FormattedFlashcard,
} from "@/components/pages/flashcards/flashcards-content";
import { FlashcardsHeader } from "@/components/pages/flashcards/flashcards-header";
import { createContext, useState } from "react";

type FlashcardContextType = {
  flashcardSets: FormattedFlashcard[];
  setFlashcardSets: React.Dispatch<React.SetStateAction<FormattedFlashcard[]>>;
};
export const FlashcardContext = createContext<FlashcardContextType | undefined>(
  undefined
);

export default function FlashcardsPage({
  params: { workspaceId },
}: {
  params: { workspaceId: string };
}) {
  const [flashcardSets, setFlashcardSets] = useState<FormattedFlashcard[]>([]);

  return (
    <FlashcardContext.Provider value={{ flashcardSets, setFlashcardSets }}>
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <FlashcardsHeader workspaceId={workspaceId} />
        <FlashcardsContent workspaceId={workspaceId} />
      </div>
    </FlashcardContext.Provider>
  );
}
