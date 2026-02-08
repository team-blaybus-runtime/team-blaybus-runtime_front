"use client";

import styled from "styled-components";
import { Column, Row } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";
import QuizEmptyState from "./QuizEmptyState";
import QuizHeader from "./QuizHeader";
import QuizQuestionList from "./QuizQuestionList";
import { useStudyQuiz } from "../../../hooks/study/useStudyQuiz";

interface StudyQuizProps {
  objectId: string;
  objectName?: string;
}

export default function StudyQuiz({ objectId, objectName }: StudyQuizProps) {
  const {
    quizData,
    questions,
    answers,
    showResult,
    score,
    isAllAnswered,
    handleSelect,
    handleRetry,
    handleGrade,
  } = useStudyQuiz(objectId);

  if (!quizData) {
    return (
      <QuizContainer>
        <QuizHeader title="QUIZ" onRetry={handleRetry} hideActions />
        <QuizEmptyState />
      </QuizContainer>
    );
  }

  return (
    <QuizContainer>
      <QuizHeader
        title="QUIZ"
        subtitle={objectName ?? quizData.title}
        onRetry={handleRetry}
        onGrade={handleGrade}
        isGradeDisabled={!isAllAnswered}
      />
      {showResult && (
        <ScoreRow>
          <Font typo="label_m" color="neutral_0">
            점수 {score} / {questions.length}
          </Font>
        </ScoreRow>
      )}
      <QuizQuestionList
        questions={questions}
        answers={answers}
        showResult={showResult}
        onSelect={handleSelect}
      />
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

const ScoreRow = styled(Row)`
  align-items: center;
  justify-content: flex-start;
`;
