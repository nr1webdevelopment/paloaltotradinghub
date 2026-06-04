export type Lesson = {
  id: string;
  title: string;
  duration: number;     // minutes
  content: string;      // HTML string (lesson body)
};

export type QuizQuestion = {
  q: string;
  options: string[];
  correct: number;      // index into options
  why: string;
};

export type Module = {
  id: string;
  title: string;
  summary: string;
  duration: string;     // human-readable total time
  lessons: Lesson[];
  quiz: { questions: QuizQuestion[] };
};

export type Course = {
  title: string;
  modules: Module[];
};

export type Profile = {
  id: string;
  name: string;
  email: string;
  onboarded: boolean;
  onboarding: Record<string, string> | null;
  digest_pref: string | null;
  joined_at: string;
};

export type LessonProgress = {
  user_id: string;
  lesson_id: string;
  module_id: string;
  completed_at: string;
};

export type QuizScore = {
  user_id: string;
  module_id: string;
  score: number;
  total: number;
  attempts: number;
  taken_at: string;
};
