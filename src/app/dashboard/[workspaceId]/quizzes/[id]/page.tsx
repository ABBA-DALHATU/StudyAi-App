import { QuizDetail } from "@/components/pages/quizzes/quiz-detail";

export default function QuizDetailPage({
  params,
}: {
  params: { id: string; workspaceId: string };
}) {
  return (
    <div className="flex-1 overflow-auto p-4 md:p-6">
      <QuizDetail id={params.id} workspaceId={params.workspaceId} />
    </div>
  );
}
