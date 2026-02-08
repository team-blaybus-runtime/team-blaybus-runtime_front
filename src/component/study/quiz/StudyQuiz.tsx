"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import { Column, Row } from "@/styles/base/BaseComponents";
import { Button } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";
import {
  getAllQuizComponents,
  getStudyQuizData,
  QuizQuestion,
} from "@/data/studyQuiz";

interface StudyQuizProps {
  objectId: string;
  objectName?: string;
}

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

function pickRandomItems(items: string[], count: number, exclude: string[] = []) {
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

export default function StudyQuiz({ objectId, objectName }: StudyQuizProps) {
  const quizData = getStudyQuizData(objectId);
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

  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length;
  const isAllAnswered = questions.length > 0 && answeredCount === questions.length;
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

  if (!quizData) {
    return (
      <QuizContainer>
        <HeaderRow>
          <Font typo="title_3" color="neutral_0">
            QUIZ
          </Font>
        </HeaderRow>
        <EmptyState>
          <Font typo="body_2" color="neutral_300">
            해당 학습물의 퀴즈가 아직 준비되지 않았어요.
          </Font>
        </EmptyState>
      </QuizContainer>
    );
  }

  return (
    <QuizContainer>
      <HeaderRow>
        <HeaderInfo>
          <Font typo="title_3" color="neutral_0">
            QUIZ
          </Font>
          <Font typo="label_s" color="neutral_400">
            {objectName ?? quizData.title}
          </Font>
        </HeaderInfo>
        <ActionRow>
          <SecondaryButton onClick={handleRetry}>랜덤 출제</SecondaryButton>
          <PrimaryButton onClick={() => setShowResult(true)} disabled={!isAllAnswered}>
            채점하기
          </PrimaryButton>
        </ActionRow>
      </HeaderRow>
      {showResult && (
        <ScoreRow>
          <Font typo="label_m" color="neutral_0">
            점수 {score} / {questions.length}
          </Font>
        </ScoreRow>
      )}
      <QuestionArea>
        {questions.map((question, index) => {
          const selected = answers[question.id];
          const isCorrect = selected === question.answerIndex;
          return (
            <QuestionCard key={question.id}>
              <Font typo="label_m" color="neutral_0">
                Q{index + 1}. {question.question}
              </Font>
              <OptionsColumn>
                {question.options.map((option, optionIndex) => {
                  const isSelected = selected === optionIndex;
                  const showCorrect =
                    showResult && optionIndex === question.answerIndex;
                  const showWrong =
                    showResult && isSelected && optionIndex !== question.answerIndex;
                  return (
                    <OptionButton
                      key={`${question.id}-${optionIndex}`}
                      $selected={isSelected}
                      $correct={showCorrect}
                      $wrong={showWrong}
                      onClick={() => handleSelect(question.id, optionIndex)}
                    >
                      <Font typo="body_2" color="neutral_0">
                        {option}
                      </Font>
                    </OptionButton>
                  );
                })}
              </OptionsColumn>
              {showResult && question.explanation && (
                <Font
                  typo="body_2"
                  color={isCorrect ? "green_300" : "neutral_400"}
                >
                  {question.explanation}
                </Font>
              )}
            </QuestionCard>
          );
        })}
      </QuestionArea>
    </QuizContainer>
  );
}

const QuizContainer = styled(Column)`
  width: 480px;
  height: 100%;
  flex-shrink: 0;
  gap: 16px;
  min-height: 0;
`;

const HeaderRow = styled(Row)`
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const HeaderInfo = styled(Column)`
  gap: 6px;
`;

const ActionRow = styled(Row)`
  gap: 8px;
  align-items: center;
`;

const ScoreRow = styled(Row)`
  align-items: center;
  justify-content: flex-start;
`;

const QuestionArea = styled(Column)`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  gap: 12px;
`;

const QuestionCard = styled(Column)`
  background-color: #1f1f1f;
  border-radius: 12px;
  padding: 14px;
  gap: 10px;
`;

const OptionsColumn = styled(Column)`
  gap: 8px;
`;

const OptionButton = styled(Button)<{
  $selected: boolean;
  $correct: boolean;
  $wrong: boolean;
}>`
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #2f2f2f;
  background-color: ${({ $selected }) => ($selected ? "#2a2a2a" : "transparent")};
  transition: background-color 0.15s ease, border-color 0.15s ease;

  ${({ $correct }) =>
    $correct &&
    `
      border-color: ${colors.green_400};
      background-color: rgba(34, 197, 94, 0.12);
    `}

  ${({ $wrong }) =>
    $wrong &&
    `
      border-color: ${colors.red_400};
      background-color: rgba(239, 68, 68, 0.12);
    `}
`;

const PrimaryButton = styled(Button)`
  padding: 8px 14px;
  border-radius: 10px;
  background-color: ${colors.blue_700};
  color: ${colors.white};
  font-size: 14px;
  font-weight: 600;
`;

const SecondaryButton = styled(Button)`
  padding: 8px 12px;
  border-radius: 10px;
  background-color: #2c2c2c;
  color: ${colors.neutral_200};
  font-size: 13px;
  font-weight: 500;
`;

const EmptyState = styled(Column)`
  flex: 1;
  align-items: center;
  justify-content: center;
  text-align: center;
`;
