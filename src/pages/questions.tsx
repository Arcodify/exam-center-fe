import InstituteLogo from "@/assets/logo.jpg";
import ConfirmationModal from "@/components/modal/confirm-modal";
import QuestionCard from "@/components/question-card";
import SocketInitialization from "@/components/socket/socket";
import UserInfo from "@/components/user-info";
import useQuestion from "@/hook/useQuestion";
import {
  buildQuestionSelectionState,
  getNextSelectedAnswers,
} from "@/utils/examQuestions";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type InstituteData = {
  image: string;
  session_id: number;
  start_time: string | null;
  status: string | null;
  program_id: number | null;
  program_name: string | null;
  institute_name: string | null;
  institute_logo: string | null;
  isValidated: boolean;
  isLoadingInstitute: boolean;
  submission_allowed: boolean;
};

const Questions = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [skippedQuestions, setSkippedQuestions] = useState<Set<number>>(
    new Set(),
  );
  const [instituteData, setInstituteData] = useState<InstituteData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionAllowed, setSubmissionAllowed] = useState(false);
  const { questions, setQuestions, fetchQuestions, answerSubmit, sessionEnd } =
    useQuestion();

  useEffect(() => {
    void fetchQuestions();
  }, []);

  useEffect(() => {
    const savedData = sessionStorage.getItem("institute-data");
    const parsedData = savedData ? JSON.parse(savedData) : null;

    setInstituteData(parsedData);
    setSubmissionAllowed(parsedData?.submission_allowed ?? false);
  }, []);

  const handleUpdateAnswers = (id: number, selectedAnswers: string[]) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === id
          ? {
              ...question,
              ...buildQuestionSelectionState(selectedAnswers),
            }
          : question,
      ),
    );

    void answerSubmit(id, selectedAnswers);

    setSkippedQuestions((prev) => {
      const next = new Set(prev);
      if (selectedAnswers.length > 0) {
        next.delete(id);
      }
      return next;
    });
  };

  const handleSelectAnswer = (id: number, answer: string) => {
    const question = questions.find((item) => item.id === id);
    if (!question) return;

    const nextSelectedAnswers = getNextSelectedAnswers(question, answer);
    handleUpdateAnswers(id, nextSelectedAnswers);
  };

  const handleClearAnswer = (id: number) => {
    handleUpdateAnswers(id, []);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion.student_answers.length === 0) {
        setSkippedQuestions((prev) => new Set([...prev, currentQuestion.id]));
      }

      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setIsModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      setIsSubmitting(true);
      await sessionEnd();
    } catch (error) {
      console.error("Error submitting exam:", error);
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
      navigate("/thank-you");
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2 text-slate-600">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
          <span className="text-sm font-medium">Loading questions...</span>
        </div>
      </div>
    );
  }

  const answeredCount = questions.filter(
    (question) => question.student_answers.length > 0,
  ).length;
  const totalQuestions = questions.length;

  const handleSubmissionAllowedChange = (allowed: boolean) => {
    setSubmissionAllowed(allowed);
    setInstituteData((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, submission_allowed: allowed };
      sessionStorage.setItem("institute-data", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="min-h-screen flex flex-col lg:flex-row">
        <div className="relative flex flex-1 flex-col">
          <div className="flex items-center justify-between gap-8 border-b border-slate-200 bg-white px-4 py-4 md:px-6">
            <div className="flex flex-shrink-0 items-center gap-2">
              <img
                src={instituteData?.institute_logo || InstituteLogo}
                width={50}
                height={50}
                alt="photo"
                className="aspect-square h-20 w-20 rounded-full object-cover overflow-hidden"
                onError={(e) => {
                  e.currentTarget.src = InstituteLogo;
                }}
              />
            </div>

            <div className="flex w-full max-w-sm gap-4">
              <div className="flex w-full items-center gap-2">
                <div className="flex flex-col">
                  <h3 className="max-w-[26ch] text-base font-semibold leading-5 text-slate-900">
                    {instituteData?.institute_name}
                  </h3>
                </div>
              </div>

              <div className="w-full">
                <SocketInitialization
                  onSubmissionAllowedChange={handleSubmissionAllowedChange}
                />
              </div>
            </div>
          </div>

          <div className="relative flex-1 px-4 py-6 md:px-6">
            <div className="mx-auto max-w-5xl">
              <div className="mx-auto mb-4 w-full">
                <div className="flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:gap-4">
                  <span className="whitespace-nowrap font-medium">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </span>
                  <div className="h-2 flex-1 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                      style={{
                        width: `${
                          ((currentQuestionIndex + 1) / totalQuestions) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="whitespace-nowrap font-medium">
                    {answeredCount} answered
                  </span>
                </div>
              </div>

              <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4 md:p-6">
                <QuestionCard
                  questionIndex={currentQuestionIndex}
                  questionData={questions[currentQuestionIndex]}
                  onSelectAnswer={handleSelectAnswer}
                  onClearAnswer={handleClearAnswer}
                />
              </div>
            </div>

            <section className="sticky-bottom flex-col">
              <div className="mb-4 flex items-center gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all sm:w-auto ${
                    currentQuestionIndex === 0
                      ? "cursor-not-allowed bg-blue-400 text-white opacity-60"
                      : "border border-slate-200 bg-blue-400 text-white hover:bg-blue-500"
                  }`}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous
                </button>

                {currentQuestionIndex !== questions.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 sm:w-auto"
                  >
                    Next
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}

                {currentQuestionIndex === questions.length - 1 && (
                  <button
                    disabled={!submissionAllowed}
                    onClick={handleSubmit}
                    className={`flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 sm:w-auto ${
                      !submissionAllowed ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    Submit Exam
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>

        <aside className="mx-auto flex w-82 flex-col justify-between border-t border-slate-200 bg-white lg:border-t-0 lg:border-l">
          <div className="w-full border-b border-slate-200 p-1">
            <UserInfo />
          </div>

          <div className="relative flex-1 px-4 py-2">
            <div className="mb-4">
              <h3 className="mb-1 text-sm font-medium text-slate-900">
                Question Navigation
              </h3>
              <div className="hide-scrollbar grid max-h-[22rem] grid-cols-6 gap-1 overflow-y-auto py-1">
                {questions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => goToQuestion(index)}
                    className={`h-8 w-8 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105 ${
                      index === currentQuestionIndex
                        ? "bg-blue-600 text-white ring-2 ring-blue-200"
                        : question.student_answers.length > 0
                          ? "bg-green-700 text-slate-100 hover:bg-green-200"
                          : skippedQuestions.has(question.id)
                            ? "bg-red-700 text-slate-100 hover:bg-red-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              <div className="border-t pt-4">
                <h3 className="mb-2 text-sm font-medium text-slate-900">
                  Stats
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-blue-600"></div>
                    <span className="text-slate-600">Current Question</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border border-green-200 bg-green-700"></div>
                    <span className="text-slate-600">Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border border-red-200 bg-red-700"></div>
                    <span className="text-slate-600">Skipped</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border border-slate-200 bg-slate-100"></div>
                    <span className="text-slate-600">Not Attempted</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-2">
                <h3 className="mb-2 text-sm font-medium text-slate-900">
                  Statistics
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 rounded-md bg-slate-100 px-2 py-1">
                    <div className="flex h-3 w-3 items-center justify-center font-bold text-slate-900">
                      {totalQuestions}
                    </div>
                    <span className="text-slate-900">Total</span>
                  </div>

                  <div className="flex items-center gap-2 rounded-md bg-green-100 px-2 py-1">
                    <div className="flex items-center justify-center font-bold text-green-600">
                      {answeredCount}
                    </div>
                    <span className="text-green-600">Answered</span>
                  </div>

                  <div className="flex items-center gap-2 rounded-md bg-orange-100 px-2 py-1">
                    <div className="flex items-center justify-center font-bold text-orange-600">
                      {Math.round(
                        ((totalQuestions - answeredCount) / totalQuestions) * 100,
                      )}
                      %
                    </div>
                    <span className="text-orange-600">Remaining</span>
                  </div>

                  <div className="flex items-center gap-2 rounded-md bg-blue-100 px-2 py-1">
                    <div className="flex h-3 w-3 items-center justify-center font-bold text-blue-600">
                      {skippedQuestions.size}
                    </div>
                    <span className="text-blue-600">Skipped</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSubmit}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Questions;
