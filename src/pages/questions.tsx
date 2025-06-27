import ConfirmationModal from "@/components/modal/confirm-modal";
import QuestionCard from "@/components/question-card";
import SocketInitialization from "@/components/socket/socket";
import UserInfo from "@/components/user-info";
import { useAuth } from "@/context/AuthContext";
import useQuestion from "@/hook/useQuestion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const Questions = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [skippedQuestions, setSkippedQuestions] = useState<Set<number>>(
    new Set()
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { questions, setQuestions, fetchQuestions, answerSubmit, sessionEnd } =
    useQuestion();
  const { logout } = useAuth();
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Show loading while questions are being fetched
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg">Loading questions...</div>
      </div>
    );
  }

  const handleSelectAnswer = (id: number, answer: string) => {
    console.log(`Question ${id}: Selected answer "${answer}"`);
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
    // Remove from skipped if it was previously skipped
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
        console.log(
          `Auto-skipping question ${currentQuestion.id} - no answer provided`
        );
        setSkippedQuestions((prev) => new Set([...prev, currentQuestion.id]));
      }

      console.log(
        `Navigating from question ${currentQuestionIndex + 1} to ${
          currentQuestionIndex + 2
        }`
      );
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      console.log(
        `Navigating from question ${
          currentQuestionIndex + 1
        } to ${currentQuestionIndex}`
      );
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Submitting answers");
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
      logout();
      navigate("/login");
    }
  };

  const resetCurrentQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    console.log(`Resetting question ${currentQuestion.id}`);
    setQuestions((prev: any) =>
      prev.map((q: any) =>
        q.id === currentQuestion.id
          ? {
              ...q,
              student_answer: null,
              is_answered: false,
            }
          : q
      )
    );
    // Remove from skipped
    setSkippedQuestions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(currentQuestion.id);
      return newSet;
    });
  };

  // const goToQuestion = (index: number) => {
  //   console.log(`Jumping to question ${index + 1}`);
  //   setCurrentQuestionIndex(index);
  // };

  const answeredCount = questions.filter((q) => q.is_answered).length;
  const skippedCount = skippedQuestions.size;
  const totalQuestions = questions.length;

  return (
    <div className="min-h-screen wrapper   ">
      <SocketInitialization />
      <div className="flex  min-h-screen   ">
        {/* Main Content - Fixed Height */}
        <div className="  flex flex-col   w-full    ">
          <div className="bg-white/80 backdrop-blur-sm     p-4 h-full flex flex-col border border-white/20">
            {/* Current Question - Fixed Height */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Lab Safety & Techniques Quiz
              </h1>

              <div className="mb-2">
                <div className="flex  gap-4 justify-between text-sm text-gray-600 mb-3">
                  <p className="font-medium w-1/4">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </p>

                  <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                      style={{
                        width: `${
                          ((currentQuestionIndex + 1) / totalQuestions) * 100
                        }%`,
                      }}
                    ></div>
                  </div>

                  <p className="font-medium w-1/4">
                    {answeredCount} of {totalQuestions} answered
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br mb-4  from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200/50 ">
                <h3 className="font-bold mb-3 text-gray-800 text-center border-b border-blue-200 pb-2">
                  Summary
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between items-center bg-white/70 p-2 rounded-lg border border-blue-100 shadow-sm">
                    <span className="text-gray-600 font-medium">Total:</span>
                    <span className="font-bold text-gray-800 bg-blue-100 px-3 py-1 rounded-md border border-blue-200">
                      {totalQuestions}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-white/70 p-2 rounded-lg border border-green-100 shadow-sm">
                    <span className="text-gray-600 font-medium">Answered:</span>
                    <span className="font-bold text-green-600 bg-green-100 px-3 py-1 rounded-md border border-green-200">
                      {answeredCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-white/70 p-2 rounded-lg border border-orange-100 shadow-sm">
                    <span className="text-gray-600 font-medium">
                      Remaining:
                    </span>
                    <span className="font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-md border border-orange-200">
                      {totalQuestions - answeredCount - skippedCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-white/70 p-2 rounded-lg border border-purple-100 shadow-sm">
                    <span className="text-gray-600 font-medium">Progress:</span>
                    <span className="font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-md border border-blue-200">
                      {Math.round((answeredCount / totalQuestions) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <QuestionCard
                questionData={questions[currentQuestionIndex]}
                onSelectAnswer={handleSelectAnswer}
              />

              {/* Navigation Buttons - Just Above Bottom */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={`px-6 py-2 rounded-lg transition ${
                    currentQuestionIndex === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  ← Previous
                </button>

                <div className="flex gap-4">
                  <button
                    onClick={resetCurrentQuestion}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Reset Current
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (currentQuestionIndex === questions.length - 1) {
                      handleSubmit();
                    } else {
                      handleNext();
                    }
                  }}
                  className={`px-6 py-2 rounded-lg transition        bg-blue-600 text-white hover:bg-blue-700  `}
                >
                  {currentQuestionIndex === questions.length - 1
                    ? "Submit"
                    : "Next →"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Scrollable */}
        <div className="w-96 bg-white/80 backdrop-blur-sm flex flex-col border-l border-white/20  ">
          {/* Fixed Header */}
          <div className="p-3  border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-blue-50/50">
            <UserInfo />
          </div>

          {/* Scrollable Question List */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="grid grid-cols-5 gap-3">
              {questions.map((question, index) => (
                <button
                  key={question.id}
                  // onClick={() => goToQuestion(index)}
                  className={`h-12 w-12 flex items-center justify-center rounded-md border-1 transition-all duration-200 hover:shadow-md font-bold text-sm ${
                    index === currentQuestionIndex
                      ? "border-blue-500 bg-blue-500 text-white shadow-lg scale-105"
                      : question.is_answered
                      ? "border-green-500 bg-green-500 text-white hover:bg-green-600 hover:border-green-600"
                      : skippedQuestions.has(question.id)
                      ? "border-red-500 bg-red-500 text-white hover:bg-red-600 hover:border-red-600"
                      : "border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:border-gray-400"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
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
