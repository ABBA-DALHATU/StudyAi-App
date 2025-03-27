import { FlashcardStudy } from "@/components/pages/flashcards/flashcard-study";

export default function StudyFlashcardsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="flex-1 overflow-auto p-4 md:p-6">
      <FlashcardStudy id={params.id} />
    </div>
  );
}
