import { COURSE } from './course-content';
import type { Module, Lesson } from './types';

export function allLessons(): (Lesson & { moduleId: string; moduleTitle: string })[] {
  return COURSE.modules.flatMap(m =>
    m.lessons.map(l => ({ ...l, moduleId: m.id, moduleTitle: m.title }))
  );
}

export function totalLessons(): number {
  return allLessons().length;
}

export function findModule(id: string): Module | undefined {
  return COURSE.modules.find(m => m.id === id);
}

export function findLesson(id: string) {
  return allLessons().find(l => l.id === id);
}

export function lessonNeighbors(id: string) {
  const all = allLessons();
  const i = all.findIndex(l => l.id === id);
  return { prev: all[i - 1], next: all[i + 1], index: i, total: all.length };
}

export function moduleProgress(mod: Module, completedIds: Set<string>) {
  const total = mod.lessons.length;
  const done = mod.lessons.filter(l => completedIds.has(l.id)).length;
  return { total, done, pct: Math.round((done / total) * 100) };
}

export function passwordStrength(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  return Math.min(score, 5);
}

export const STRENGTH_LABELS = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
