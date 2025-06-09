import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AnimateProvider from "../../components/AnimateProvider/AnimateProvider";
import Question from "../../components/Questions/Questions";
import ConfirmationModal from "../../components/Modal/ConfirmationModal";
import {
  fetchQuestionById,
  fetchQuestionsFromApi,
  submitAnswer,
} from "../../api/question";
import { getElapsedTime } from "../../utils";
import { FaArrowAltCircleLeft, FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight, FaRegCheckSquare } from "react-icons/fa";

function SingleQuestion() {
  const navigate = useNavigate();
  const { id } = useParams();
  const questionId = Number(id) || 1;

  const [userInfo, setUserInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionsAll, setQuestionsAll] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserInfo(user);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchAllQuestions = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const shiftPlanProgramId = user?.data?.shift_plan_program_id;

        const allQuestionsResponse = await fetchQuestionsFromApi();
        if (allQuestionsResponse?.data) {
          console.log("he", allQuestionsResponse.data)
          
          const questionsWithSerial = allQuestionsResponse.data.map(
            (question, index) => ({
              ...question,
              serialNumber: index + 1,
            })
          );
          setQuestionsAll(questionsWithSerial);
          const answeredSet = new Set(
            questionsWithSerial
              .filter((q) => q.student_answer)
              .map((q) => q.serialNumber)
          );
          setAnsweredQuestions(answeredSet);
        } else {
          throw new Error("Failed to fetch questions.");
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllQuestions();
  }, []);
console.log(questions, questionsAll)
  const fetchSingleQuestion = async () => {
    if (firstLoad) {
      setLoading(true);
    }
    setRetrying(false);
    try {
      const questionData = questionsAll.find(
        (q) => q.serialNumber === questionId
      );
      if (questionData) {
        const data = await fetchQuestionById(questionData.id);
        setQuestions([data]);
      } else {
        throw new Error("Question not found");
      }
    } catch (err) {
      console.error("Error fetching question:", err);
      setRetrying(true);
    } finally {
      if (firstLoad) {
        setLoading(false);
        setFirstLoad(false);
      }
    }
  };

  useEffect(() => {
    if (questionsAll.length > 0) {
      fetchSingleQuestion();
    }
  }, [questionId, questionsAll]);

  useEffect(() => {
    if (retrying) {
      const retryTimeout = setTimeout(fetchSingleQuestion, 3000);
      return () => clearTimeout(retryTimeout);
    }
  }, [retrying]);

  // const handleClick = async (value) => {
  //   if (!questions[0]) return;

  //   const questionData = questionsAll.find(
  //     (q) => q.serialNumber === questionId
  //   );
  //   const elapsedTime = getElapsedTime();

  //   const result = await submitAnswer({
  //     questionId: questionData.id,
  //     answer: value.answer,
  //     elapsedTime: elapsedTime,
  //   });

  //   if (result.success) {
  //     setAnsweredQuestions((prev) => new Set(prev).add(questionId));

  //     const updatedQuestions = questions.map((q) =>
  //       q.id === questionData.id ? { ...q, student_answer: value.answer } : q
  //     );

  //     setQuestions(updatedQuestions);
  //   } else {
  //     console.error(result.message);
  //   }
  // };
  const handleClick = async (value) => {
    if (!questions[0]) return;

    const questionData = questionsAll.find(
      (q) => q.serialNumber === questionId
    );
    const elapsedTime = getElapsedTime();

    const result = await submitAnswer({
      questionId: questionData.id,
      answer: value.answer,
      elapsedTime: elapsedTime,
    });

    if (result.success) {
      setAnsweredQuestions((prev) => {
        const updatedSet = new Set(prev);
        if (value.answer === null) {
          updatedSet.delete(questionId); // Remove from answered set if cleared
        } else {
          updatedSet.add(questionId); // Add to answered set if answered
        }
        return updatedSet;
      });

      const updatedQuestions = questions.map((q) =>
        q.id === questionData.id ? { ...q, student_answer: value.answer } : q
      );

      setQuestions(updatedQuestions);
    } else {
      console.error(result.message);
    }
  };

  const handlePrevious = () => {
    if (questionId > 1) {
      navigate(`/question/${questionId - 1}`);
    }
  };

  const handleNext = () => {
    if (questionId >= questionsAll.length) {
      setModalOpen(true);
    } else {
      navigate(`/question/${questionId + 1}`);
    }
  };

  const submitQuiz = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("endTime");
    navigate("/finish");
  };

  const handlePagination = (num) => {
    navigate(`/question/${num}`);
  };

  const totalQuestions = questionsAll.length;
  const answeredCount = answeredQuestions.size;
  const remainingCount = totalQuestions - answeredCount;

  return (
    <AnimateProvider>
      {loading && firstLoad && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
      <div className={`w-full ${loading && firstLoad ? "opacity-50" : ""}`}>
        <div className="mx-10 px-5 pt-10">
          <div className="flex flex-row gap-4">
            <div className="w-[80%]">
              <div className="pr-4">
                {questions[0] && (
                  <Question
                    id={questionId}
                    handleClick={handleClick}
                    singleQuestion={questions[0]}
                  />
                )}
                <div className="flex justify-between mt-6 navigator">
                  <button
                    onClick={handlePrevious}
                    disabled={questionId === 1}
                    className={`px-4 py-2 bg-gray-300 rounded ${
                      questionId === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <FaArrowAltCircleLeft />
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    className={`px-4 py-2 bg-blue-500 text-white rounded ${
                      questionId > questionsAll.length
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {questionId === questionsAll.length ? "Submit" : "Next"}
                    {questionId === questionsAll.length ? <FaRegCheckSquare /> : <FaRegArrowAltCircleRight />}
                  </button>
                </div>
              </div>
            </div>
            <div className="w-[20%]">
              <div className="answer bg-white p-3 shadow-md rounded-lg">
                <div className="div item-container w-50">
                  <div className="w-full question-summary mb-6 text-s p-2 h-105 bg-gray-100 rounded-lg shadow-md">
                    <div className="flex-col">
                      <div className="p-2 bg-white rounded-lg flex h-50 status justify-between">
                         <p className="text-md text-gray-700 font-semibold">
                          Total :{" "}
                          <span className="text-xl font-bold text-blue-600">
                            {totalQuestions}
                          </span>
                        </p>
                        
                        <p className="text-md text-green-700 font-semibold">
                          Answered :{" "}
                          <span className="text-xl font-bold">
                            {answeredCount}
                          </span>
                        </p>
                        <p className="text-md text-red-500 font-semibold">
                          Remaining :{" "}
                          <span className="text-xl font-bold">
                            {remainingCount}
                          </span>
                        </p>
                       
                      </div>
                    </div>
                  </div>
                  <div
                    className="flex flex-wrap justify-between mb-5 paginated-buttons"
                    style={{
                      maxHeight: "400px",
                      minHeight: "160px",
                      overflow: "auto",
                    }}
                  >
                    {Array.from({ length: totalQuestions }, (_, index) => {
                      const questionNum = index + 1;
                      const isCurrentQuestion = questionId === questionNum;
                      const hasAnswered = answeredQuestions.has(questionNum);

                      return (
                        <button
                          key={index}
                          onClick={() => handlePagination(questionNum)}
                          className={`h-10 w-10 mb-3 text-lg font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center
                              ${
                                isCurrentQuestion && hasAnswered
                                  ? "bg-green-600 border-4 border-orange-500 text-white shadow-xl"
                                  : isCurrentQuestion
                                  ? "bg-orange-500 text-white shadow-xl"
                                  : hasAnswered
                                  ? "bg-green-500 text-white shadow-md"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-sm"
                              }
                            `}
                          title={`Question ${questionNum}`}
                        >
                          {questionNum}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={submitQuiz}
          />
        </div>
      </div>
    </AnimateProvider>
  );
}

export default SingleQuestion;
