/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Lesson {
  id: string;
  level: number;
  title: string;
  icon: string;
  description: string;
  explanation: string;
  example: string;
  challenge: {
    instruction: string;
    starterCode: string;
    expectedOutput?: string;
    hint: string;
  };
}

export interface UserProgress {
  completedLessons: string[];
  currentLessonId: string;
  stars: number;
}

export interface AIResponse {
  feedback: string;
  isCorrect: boolean;
  improvedCode?: string;
  explanation?: string;
}
