import { useNavigate } from "react-router-dom";
import AnimateProvider from "../../components/AnimateProvider/AnimateProvider";
import Question from "../../components/Questions/Questions";
import Result from "../../components/Result/Result";
import ReportCard from "../../components/Result/Result";
const staticQuestions = [
  {
    id: 1,
    data: {
      question: "What is 2 + 2?",
      answers: [
        { options: "3", answer_number: 1 },
        { options: "4", answer_number: 2 },
        { options: "5", answer_number: 3 },
      ],
      student_answer: 2, // Answer submitted by the student
    },
  },
  {
    id: 2,
    data: {
      question: "What is the capital of France?",
      answers: [
        { options: "Berlin", answer_number: 1 },
        { options: "Madrid", answer_number: 2 },
        { options: "Paris", answer_number: 3 },
      ],
      student_answer: 3, // Answer submitted by the student
    },
  },
];

function Success() {
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AnimateProvider className="flex flex-col pt-10 items-center justify-start min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-gray-700 space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
        Thank you for completing your exam!
      </h2>
      <p className="text-lg md:text-xl text-center text-gray-600 max-w-2xl">
        Your responses have been recorded successfully.
      </p>

    {/* <div className="result-container">
      <ReportCard/>
    </div> */}

    
      {/* Render all questions in read-only mode */}
      {/* <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        {staticQuestions.map((question, index) => (
          <div key={index} className="mb-6 border-b pb-4">
            <Question
              id={question.id}
              singleQuestion={question}
              readOnly={true}
            />
          </div>
        ))}
      </div> */}

      <button
        onClick={handleClick}
        className="py-3 px-8 text-lg font-semibold text-white bg-red-600 rounded-full shadow-lg transform transition duration-200 hover:bg-red-700 hover:shadow-xl active:scale-95 focus:outline-none"
      >
        Logout
      </button>
    </AnimateProvider>
  );
}

export default Success;
