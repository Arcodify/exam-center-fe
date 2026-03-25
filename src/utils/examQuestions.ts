export type ExamAnswer = {
  options: string;
  answer_number: string;
};

export type ExamQuestion = {
  id: number;
  question: string;
  answers: ExamAnswer[];
  allows_multiple_answers: boolean;
  student_answer: string | null;
  student_answers: string[];
  is_answered: boolean;
  paragraph?: string | null;
  marks?: number;
  negative_marks?: number;
};

type QuestionSelectionFields = {
  allows_multiple_answers?: boolean;
  student_answer?: string | null;
  student_answers?: string[] | null;
  is_answered?: boolean;
};

export const normalizeSelectedAnswers = (
  studentAnswers?: string[] | null,
  studentAnswer?: string | null,
) => {
  const fromArray = Array.isArray(studentAnswers) ? studentAnswers : [];
  const normalized = Array.from(
    new Set(
      fromArray.filter(
        (answer): answer is string =>
          typeof answer === "string" && answer.trim().length > 0,
      ),
    ),
  ).sort();

  if (normalized.length > 0) return normalized;

  return typeof studentAnswer === "string" && studentAnswer.trim().length > 0
    ? [studentAnswer]
    : [];
};

export const buildQuestionSelectionState = (selectedAnswers: string[]) => {
  const normalizedAnswers = normalizeSelectedAnswers(selectedAnswers);

  return {
    student_answers: normalizedAnswers,
    student_answer: normalizedAnswers.length === 1 ? normalizedAnswers[0] : null,
    is_answered: normalizedAnswers.length > 0,
  };
};

export const normalizeQuestionSelection = <T extends QuestionSelectionFields>(
  question: T,
): T & {
  allows_multiple_answers: boolean;
  student_answer: string | null;
  student_answers: string[];
  is_answered: boolean;
} => {
  const student_answers = normalizeSelectedAnswers(
    question.student_answers,
    question.student_answer,
  );

  return {
    ...question,
    allows_multiple_answers: Boolean(question.allows_multiple_answers),
    ...buildQuestionSelectionState(student_answers),
  };
};

export const toggleSelectedAnswer = (
  selectedAnswers: string[],
  answer: string,
) => {
  if (selectedAnswers.includes(answer)) {
    return selectedAnswers.filter((item) => item !== answer);
  }

  return [...selectedAnswers, answer].sort();
};

export const getNextSelectedAnswers = (
  question: Pick<ExamQuestion, "allows_multiple_answers" | "student_answers">,
  answer: string,
) => {
  return question.allows_multiple_answers
    ? toggleSelectedAnswer(question.student_answers, answer)
    : [answer];
};

export const areSelectedAnswersEqual = (
  left: string[] | null | undefined,
  right: string[] | null | undefined,
) => {
  const normalizedLeft = normalizeSelectedAnswers(left);
  const normalizedRight = normalizeSelectedAnswers(right);

  if (normalizedLeft.length !== normalizedRight.length) return false;

  return normalizedLeft.every(
    (answer, index) => answer === normalizedRight[index],
  );
};
