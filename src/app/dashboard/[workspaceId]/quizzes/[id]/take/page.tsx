import { QuizTaking } from "@/components/pages/quizzes/quiz-taking";

export default function TakeQuizPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex-1 overflow-auto p-4 md:p-6">
      <QuizTaking id={params.id} />
    </div>
  );
}
