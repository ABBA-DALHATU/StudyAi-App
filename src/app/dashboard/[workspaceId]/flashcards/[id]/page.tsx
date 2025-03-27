import { FlashcardSetDetail } from "@/components/pages/flashcards/flashcard-set-detail";

export default function FlashcardSetDetailPage({
  params,
}: {
  params: { workspaceId: string; id: string };
}) {
  return (
    <div className="flex-1 overflow-auto p-4 md:p-6">
      <FlashcardSetDetail id={params.id} workspaceId={params.workspaceId} />
    </div>
  );
}
