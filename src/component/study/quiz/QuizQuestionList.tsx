"use client";

import styled from "styled-components";
import { Column } from "@/styles/base/BaseComponents";
import { Button } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";
import type { QuizQuestion } from "@/data/studyQuiz";

interface QuizQuestionListProps {
  questions: QuizQuestion[];
  answers: Record<string, number>;
  showResult: boolean;
  onSelect: (questionId: string, optionIndex: number) => void;
}

export default function QuizQuestionList({
  questions,
  answers,
  showResult,
  onSelect,
}: QuizQuestionListProps) {
  return (
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
                    onClick={() => onSelect(question.id, optionIndex)}
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
  );
}

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
