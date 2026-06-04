import { notFound } from 'next/navigation';
import { findModule } from '@/lib/utils';
import { QuizRunner } from './QuizRunner';

export default function QuizPage({ params }: { params: { moduleId: string } }) {
  const mod = findModule(params.moduleId);
  if (!mod) notFound();
  return <QuizRunner moduleId={mod.id} moduleTitle={mod.title} questions={mod.quiz.questions} />;
}
