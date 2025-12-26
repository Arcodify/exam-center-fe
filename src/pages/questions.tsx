import ConfirmationModal from "@/components/modal/confirm-modal";
import QuestionCard from "@/components/question-card";
import SocketInitialization from "@/components/socket/socket";
import UserInfo from "@/components/user-info";
import useQuestion from "@/hook/useQuestion";
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
    new Set()
  );
  const [instituteData, setInstituteData] = useState<InstituteData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionAllowed, setSubmissionAllowed] = useState(false);
  const { questions, setQuestions, fetchQuestions, answerSubmit, sessionEnd } =
    useQuestion();

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const savedData = sessionStorage.getItem("institute-data");
    const parsedData = savedData ? JSON.parse(savedData) : null;

    setInstituteData(parsedData);
    setSubmissionAllowed(parsedData?.submission_allowed ?? false);
  }, []);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2 text-slate-600">
          <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading questions...</span>
        </div>
      </div>
    );
  }

  const handleSelectAnswer = (id: number, answer: string) => {
    answerSubmit(id, answer);
    setQuestions((prev: any) =>
      prev.map((q: any) =>
        q.id === id
          ? {
              ...q,
              student_answer: answer,
              is_answered: true,
            }
          : q
      )
    );

    setSkippedQuestions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const currentQuestion = questions[currentQuestionIndex];
      if (!currentQuestion.is_answered) {
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

  const answeredCount = questions.filter((q) => q.is_answered).length;
  // const skippedCount = skippedQuestions.size;
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
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="flex-1 flex flex-col relative">
          <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between gap-8">
            {/* Testing UI Navbar */}
            <div className="flex gap-2 items-center flex-shrink-0">
              <img
                src={
                  instituteData?.institute_logo ||
                  "https://t4.ftcdn.net/jpg/02/24/86/95/360_F_224869519_aRaeLneqALfPNBzg0xxMZXghtvBXkfIA.jpg"
                }
                width={50}
                height={50}
                alt="Institute logo"
                className="w-20 h-20 aspect-square rounded-full object-cover border border-slate-200 overflow-hidden shadow"
              />

              {/* <div className="flex flex-col leading-5 font-semibold text-lg">
                <h3>Default</h3>
                <h3>Institute</h3>
              </div> */}
            </div>

            <div className="flex gap-4 max-w-sm w-full">
              <div className="flex items-center gap-2 w-full">
                {/* {instituteData && (
                  <div>
                    <img
                      src={
                        instituteData?.institute_logo ||
                        "https://t4.ftcdn.net/jpg/02/24/86/95/360_F_224869519_aRaeLneqALfPNBzg0xxMZXghtvBXkfIA.jpg"
                      }
                      width={48}
                      height={48}
                      alt="Institute logo"
                      className="w-10 h-10 aspect-square rounded-full object-cover border border-slate-200 overflow-hidden shadow"
                    />
                  </div>
                )} */}

                <div className="flex flex-col">
                  <h3 className="text-base leading-5 font-semibold text-slate-900 max-w-[26ch]">
                    {instituteData?.institute_name}
                  </h3>

                  <div>
                    {instituteData?.program_name && (
                      <p className="text-slate-600 font-semibold max-w-[32ch]">
                        <span className="">{instituteData?.program_name}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full">
                <SocketInitialization
                  onSubmissionAllowedChange={handleSubmissionAllowedChange}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 px-4 md:px-6 py-6 relative">
            <div className="max-w-5xl mx-auto">
              <div className="mx-auto w-full mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-600">
                  <span className="font-medium whitespace-nowrap">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </span>
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          ((currentQuestionIndex + 1) / totalQuestions) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="font-medium whitespace-nowrap">
                    {answeredCount} answered
                  </span>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4 md:p-6 mb-6">
                <QuestionCard
                  questionData={questions[currentQuestionIndex]}
                  onSelectAnswer={handleSelectAnswer}
                />
              </div>
            </div>

            <section className="sticky-bottom flex-col">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentQuestionIndex === 0
                      ? "bg-blue-400 opacity-60 text-white cursor-not-allowed"
                      : "bg-blue-400 border border-slate-200 text-white hover:bg-blue-500"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
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

                {!(currentQuestionIndex === questions.length - 1) && (
                  <button
                    onClick={() => {
                      handleNext();
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-400 border border-slate-200 text-white hover:bg-blue-500"
                  >
                    Next
                    <svg
                      className="w-4 h-4"
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
                    onClick={() => {
                      handleSubmit();
                    }}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-400 border border-slate-200 text-white hover:bg-blue-500 ${
                      !submissionAllowed ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Submit Exam
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>

        <aside className="flex flex-col justify-between w-82 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 mx-auto">
          <div className="p-1 border-b border-slate-200 w-full">
            <UserInfo />
          </div>

          <div className="flex-1 px-4 py-2 relative ">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-slate-900 mb-1">
                Question Navigation
              </h3>
              <div className="grid grid-cols-6 gap-1 max-h-96 py-1 overflow-y-auto hide-scrollbar">
                {questions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => goToQuestion(index)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105 ${
                      index === currentQuestionIndex
                        ? "bg-blue-600 text-white ring-2 ring-blue-200"
                        : question.is_answered
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

            <div className="text-xs flex flex-col gap-4">
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-slate-900 mb-2">
                  Status Indicators
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span className="text-slate-600">Current Question</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-700 border border-green-200 rounded"></div>
                    <span className="text-slate-600">Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-700 border border-red-200 rounded"></div>
                    <span className="text-slate-600">Skipped</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-slate-100 border border-slate-200 rounded"></div>
                    <span className="text-slate-600">Not Attempted</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <h3 className="text-sm font-medium text-slate-900 mb-2">
                  Question Statistics
                  {/* Status Indicators */}
                </h3>

                <div className="grid grid-cols-2 gap-2  ">
                  <div className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded-md">
                    <div className="font-bold text-slate-900 w-3 h-3 flex justify-center items-center">
                      {totalQuestions}
                    </div>
                    <span className="text-slate-900">Total</span>
                  </div>

                  <div className="flex items-center gap-2 bg-green-100 px-2 py-1 rounded-md">
                    <div className="font-bold text-green-600 flex justify-center items-center">
                      {answeredCount}
                    </div>
                    <span className="text-green-600">Answered</span>
                  </div>

                  <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-orange-100">
                    <div className="font-bold text-orange-600 flex justify-center items-center">
                      {Math.round((answeredCount / totalQuestions) * 100)}%
                    </div>
                    <span className="text-orange-600">Remaining</span>
                  </div>

                  <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-blue-100">
                    <div className="font-bold text-blue-600 w-3 h-3 flex justify-center items-center">
                      {totalQuestions}
                    </div>
                    <span className="text-blue-600">Complete</span>
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
