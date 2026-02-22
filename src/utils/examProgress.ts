type InstituteDataLike = {
  session_id?: number | string | null;
};

type ExamProgressEvent = {
  question_id: number;
  selected_answer: string;
  at: string;
  synced?: boolean;
};

type ExamProgress = {
  v: 1;
  session_id: number | null;
  updated_at: string;
  answers: Record<string, string>;
  synced_answers: Record<string, string>;
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
    answers:
      parsed?.answers && typeof parsed.answers === "object" ? (parsed.answers as Record<string, string>) : {},
    synced_answers:
      parsed?.synced_answers && typeof parsed.synced_answers === "object"
        ? (parsed.synced_answers as Record<string, string>)
        : {},
    events: Array.isArray(parsed?.events) ? (parsed.events as ExamProgressEvent[]) : [],
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
  selected_answer: string,
) => {
  const progress = loadExamProgress();
  if (!progress.session_id) return;
  const now = new Date().toISOString();

  progress.answers[String(question_id)] = selected_answer;
  progress.events.push({ question_id, selected_answer, at: now, synced: false });
  if (progress.events.length > MAX_EVENTS) {
    progress.events = progress.events.slice(progress.events.length - MAX_EVENTS);
  }
  progress.updated_at = now;

  persistExamProgress(progress);
};

export const getPendingAnswers = () => {
  const progress = loadExamProgress();
  if (!progress.session_id) return [];
  const pending: { question_id: number; selected_answer: string }[] = [];

  for (const [questionIdStr, selected_answer] of Object.entries(
    progress.answers,
  )) {
    const question_id = Number(questionIdStr);
    if (!Number.isFinite(question_id)) continue;

    if (progress.synced_answers[questionIdStr] !== selected_answer) {
      pending.push({ question_id, selected_answer });
    }
  }

  return pending;
};

export const markAnswerSynced = (
  question_id: number,
  selected_answer: string,
) => {
  const progress = loadExamProgress();
  if (!progress.session_id) return;
  const now = new Date().toISOString();
  const key = String(question_id);

  progress.synced_answers[key] = selected_answer;
  progress.updated_at = now;

  // Also mark any matching events as synced (best-effort).
  for (const event of progress.events) {
    if (
      event.question_id === question_id &&
      event.selected_answer === selected_answer
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
  T extends { id: number; student_answer: string | null; is_answered: boolean },
>(
  questions: T[],
) => {
  const progress = loadExamProgress();
  if (!progress.answers || Object.keys(progress.answers).length === 0)
    return questions;

  return questions.map((q) => {
    // Never override answers coming from server.
    if (q.student_answer) return q;

    const localAnswer = progress.answers[String(q.id)];
    if (!localAnswer) return q;

    return {
      ...q,
      student_answer: localAnswer,
      is_answered: true,
    };
  });
};
