"use client";

import { useMemo, useState } from "react";
import {
  getAllQuizComponents,
  getStudyQuizData,
  QuizQuestion,
} from "@/data/studyQuiz";

const TOTAL_QUESTIONS = 20;
const VISIBLE_QUESTIONS = 5;

function shuffleArray<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickRandomItems(
  items: string[],
  count: number,
  exclude: string[] = [],
) {
  const pool = items.filter((item) => !exclude.includes(item));
  const result: string[] = [];
  while (result.length < count && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(index, 1)[0]);
  }
  return result;
}

function generateQuestions(
  quizData: { title: string; components: string[] },
  allComponents: string[],
  count: number,
  seed: number,
): QuizQuestion[] {
  if (count <= 0 || quizData.components.length === 0) return [];
  const generated: QuizQuestion[] = [];
  const otherComponents = allComponents.filter(
    (component) => !quizData.components.includes(component),
  );

  for (let i = 0; i < count; i += 1) {
    const isNotIncluded = i % 2 === 1;
    if (isNotIncluded && otherComponents.length > 0) {
      const correct =
        otherComponents[Math.floor(Math.random() * otherComponents.length)];
      const wrongOptions = pickRandomItems(quizData.components, 3);
      const options = shuffleArray([correct, ...wrongOptions]);
      const answerIndex = options.indexOf(correct);
      generated.push({
        id: `auto-${seed}-${i}`,
        question: `다음 중 ${quizData.title} 구성품에 포함되지 않는 것은?`,
        options,
        answerIndex,
      });
      continue;
    }

    const correct =
      quizData.components[
        Math.floor(Math.random() * quizData.components.length)
      ];
    const wrongOptions = pickRandomItems(
      otherComponents.length > 0 ? otherComponents : quizData.components,
      3,
      [correct],
    );
    const options = shuffleArray([correct, ...wrongOptions]);
    const answerIndex = options.indexOf(correct);
    generated.push({
      id: `auto-${seed}-${i}`,
      question: `다음 중 ${quizData.title} 구성품에 포함되는 것은?`,
      options,
      answerIndex,
    });
  }

  return generated;
}

export function useStudyQuiz(objectName: string) {
  const quizData = getStudyQuizData(objectName.toLowerCase());
  const [seed, setSeed] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const allComponents = useMemo(() => getAllQuizComponents(), []);

  const questions = useMemo(() => {
    if (!quizData) return [];
    const needed = Math.max(0, TOTAL_QUESTIONS - quizData.questions.length);
    const generated = generateQuestions(quizData, allComponents, needed, seed);
    const combined = [...quizData.questions, ...generated];
    const shuffled = shuffleArray(combined);
    return shuffled.slice(0, Math.min(VISIBLE_QUESTIONS, shuffled.length));
  }, [allComponents, quizData, seed]);

  const answeredCount = questions.filter(
    (q) => answers[q.id] !== undefined,
  ).length;
  const isAllAnswered =
    questions.length > 0 && answeredCount === questions.length;
  const score = questions.reduce(
    (sum, q) => sum + (answers[q.id] === q.answerIndex ? 1 : 0),
    0,
  );

  const handleSelect = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleRetry = () => {
    setSeed((prev) => prev + 1);
    setAnswers({});
    setShowResult(false);
  };

  const handleGrade = () => setShowResult(true);

  return {
    quizData,
    questions,
    answers,
    showResult,
    score,
    isAllAnswered,
    handleSelect,
    handleRetry,
    handleGrade,
  };
}
