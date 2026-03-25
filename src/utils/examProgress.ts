import {
  areSelectedAnswersEqual,
  buildQuestionSelectionState,
  normalizeQuestionSelection,
  normalizeSelectedAnswers,
} from "./examQuestions";

type InstituteDataLike = {
  session_id?: number | string | null;
};

type ExamProgressEvent = {
  question_id: number;
  selected_answers: string[];
  at: string;
  synced?: boolean;
};

type ExamProgress = {
  v: 1;
  session_id: number | null;
  updated_at: string;
  answers: Record<string, string[]>;
  synced_answers: Record<string, string[]>;
  events: ExamProgressEvent[];
};

const STORAGE_PREFIX = "exam-progress";
const MAX_EVENTS = 500;

const safeJsonParse = <T>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const getSessionId = (): number | null => {
  try {
    const parsed = safeJsonParse<InstituteDataLike>(
      sessionStorage.getItem("institute-data"),
    );
    const raw = parsed?.session_id;
    const value =
      typeof raw === "string" ? Number(raw) : typeof raw === "number" ? raw : NaN;
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
};

const normalizeAnswerMap = (value: unknown): Record<string, string[]> => {
  if (!value || typeof value !== "object") return {};

  return Object.fromEntries(
    Object.entries(value).map(([questionId, answers]) => [
      questionId,
      normalizeSelectedAnswers(
        Array.isArray(answers) ? answers : undefined,
        typeof answers === "string" ? answers : null,
      ),
    ]),
  );
};

export const getExamProgressKey = (): string => {
  const sessionId = getSessionId();
  // Never store unscoped progress; session_id is the boundary.
  return `${STORAGE_PREFIX}:${sessionId}`;
};

export const loadExamProgress = (): ExamProgress => {
  const sessionId = getSessionId();
  const key = sessionId ? getExamProgressKey() : null;
  const parsed = key
    ? safeJsonParse<Partial<ExamProgress>>(localStorage.getItem(key))
    : null;

  return {
    v: 1,
    session_id: sessionId,
    updated_at: typeof parsed?.updated_at === "string" ? parsed.updated_at : "",
    answers: normalizeAnswerMap(parsed?.answers),
    synced_answers: normalizeAnswerMap(parsed?.synced_answers),
    events: Array.isArray(parsed?.events)
      ? parsed.events.map((event) => ({
          question_id: Number(event.question_id),
          selected_answers: normalizeSelectedAnswers(
            Array.isArray(event.selected_answers)
              ? event.selected_answers
              : undefined,
            typeof (event as { selected_answer?: unknown }).selected_answer ===
              "string"
              ? ((event as { selected_answer?: string }).selected_answer ?? null)
              : null,
          ),
          at: typeof event.at === "string" ? event.at : "",
          synced: Boolean(event.synced),
        }))
      : [],
  };
};

export const persistExamProgress = (progress: ExamProgress) => {
  if (!progress.session_id) return;
  const key = getExamProgressKey();
  try {
    localStorage.setItem(key, JSON.stringify(progress));
  } catch {
    // Best-effort persistence; ignore quota/serialization errors.
  }
};

export const appendAnswerToProgress = (
  question_id: number,
  selected_answers: string[],
) => {
  const progress = loadExamProgress();
  if (!progress.session_id) return;
  const now = new Date().toISOString();
  const normalizedAnswers = normalizeSelectedAnswers(selected_answers);

  progress.answers[String(question_id)] = normalizedAnswers;
  progress.events.push({
    question_id,
    selected_answers: normalizedAnswers,
    at: now,
    synced: false,
  });
  if (progress.events.length > MAX_EVENTS) {
    progress.events = progress.events.slice(progress.events.length - MAX_EVENTS);
  }
  progress.updated_at = now;

  persistExamProgress(progress);
};

export const getPendingAnswers = () => {
  const progress = loadExamProgress();
  if (!progress.session_id) return [];
  const pending: { question_id: number; selected_answers: string[] }[] = [];

  for (const [questionIdStr, selected_answers] of Object.entries(progress.answers)) {
    const question_id = Number(questionIdStr);
    if (!Number.isFinite(question_id)) continue;

    if (
      !areSelectedAnswersEqual(
        progress.synced_answers[questionIdStr],
        selected_answers,
      )
    ) {
      pending.push({ question_id, selected_answers });
    }
  }

  return pending;
};

export const markAnswerSynced = (
  question_id: number,
  selected_answers: string[],
) => {
  const progress = loadExamProgress();
  if (!progress.session_id) return;
  const now = new Date().toISOString();
  const key = String(question_id);
  const normalizedAnswers = normalizeSelectedAnswers(selected_answers);

  progress.synced_answers[key] = normalizedAnswers;
  progress.updated_at = now;

  // Also mark any matching events as synced (best-effort).
  for (const event of progress.events) {
    if (
      event.question_id === question_id &&
      areSelectedAnswersEqual(event.selected_answers, normalizedAnswers)
    ) {
      event.synced = true;
    }
  }

  persistExamProgress(progress);
};

export const clearExamProgress = () => {
  const sessionId = getSessionId();
  if (!sessionId) return;
  const key = getExamProgressKey();
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
};

export const clearAllExamProgress = () => {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (key === STORAGE_PREFIX || key.startsWith(`${STORAGE_PREFIX}:`)) {
        keys.push(key);
      }
    }
    for (const key of keys) localStorage.removeItem(key);
  } catch {
    // ignore
  }
};

export const mergeLocalAnswers = <
  T extends {
    id: number;
    student_answer?: string | null;
    student_answers?: string[] | null;
    allows_multiple_answers?: boolean;
    is_answered?: boolean;
  },
>(
  questions: T[],
) => {
  const progress = loadExamProgress();
  const normalizedQuestions = questions.map((question) =>
    normalizeQuestionSelection(question),
  );

  if (!progress.answers || Object.keys(progress.answers).length === 0) {
    return normalizedQuestions;
  }

  return normalizedQuestions.map((question) => {
    // Never override answers coming from server.
    if (question.student_answers.length > 0) return question;

    const localAnswers = progress.answers[String(question.id)];
    if (!localAnswers) return question;

    return {
      ...question,
      ...buildQuestionSelectionState(localAnswers),
    };
  });
};
