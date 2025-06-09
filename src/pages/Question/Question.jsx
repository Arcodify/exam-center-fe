import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AnimateProvider from "../../components/AnimateProvider/AnimateProvider";
import { checkSession } from "../../api/question";
import { formatTime } from "../../utils";

function Question() {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [questionData, setQuestionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserInfo(user);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleStartExam = async () => {
    try {
      var shiftPlanProgramId = userInfo?.data?.shift_plan_program_id;
      if (!shiftPlanProgramId) {
        throw new Error("Invalid Shift Plan Program ID");
      }
      
      const response = await checkSession();
      if (response.status === 200) {

        setQuestionData(response.data);
        setError(null);
        navigate(`/question/1`);
      } else if (response.status === 422) {
        setError(response.error || "Exam has not started yet. Please check back later.");
        alert(response.error || "Exam has not started yet. Please check back later.");
      } else {
        setError("Something Went wrong . Please Try Again");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load questions");
    }
  };

  // const handleStartExam = async () => {
  //   try {
  //     var shiftPlanProgramId = userInfo?.data?.shift_plan_program_id;
  //     if (!shiftPlanProgramId) {
  //       throw new Error("Invalid Shift Plan Program ID");
  //     }
      
  //     const response = await fetchQuestionsFromApi(shiftPlanProgramId);
  //     if (response.status === 200) {
  //       setQuestionData(response.data);
  //       setError(null);
  //       navigate(`/question/1`);
  //     } else if (response.status === 422) {
  //       setError(response.error || "Exam has not started yet. Please check back later.");
  //       alert(response.error || "Exam has not started yet. Please check back later.");
  //     } else {
  //       setError("Something Went wrong . Please Try Again");
  //     }
  //   } catch (err) {
  //     setError(err.response?.data?.error || "Failed to load questions");
  //   }
  // };

  return (
    <AnimateProvider className="max-w-3xl mx-auto">
      {userInfo && (
        <div className="mb-5 flex">
          <div className="info">
            <h2 className="text-4xl font-semibold text-orange-700 mb-3">Welcome </h2>
            <h3 className="text-gray-500 text-xl font-semibold">Symbol Number: {userInfo.data.symbol_number}</h3>
            <h3 className="text-gray-500 text-xl font-semibold">Name: {userInfo.data.name}</h3>
            <h3 className="text-gray-500 text-xl font-semibold">Email: {userInfo.data.email}</h3>
            <h3 className="text-gray-500 text-xl font-semibold">Program ID: {userInfo.data.program.name}</h3>
            <h3 className="text-gray-500 text-xl font-semibold">Level ID: {userInfo.data.level.name}</h3>
            <h3 className="text-gray-500 text-xl font-semibold">Exam Time: {formatTime(userInfo.data.duration)}</h3>
          </div>
          <div className="image ml-32">
            <img
              src={userInfo.data.photo}
              alt="User Profile"
              className="w-48 h-56 rounded-full object-cover"
            />
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-lg font-semibold">{error}</p>}

      <h1 className="text-3xl font-bold mb-5 text-orange-700">Instructions</h1>
      <div className="mb-5 text-gray-800 text-xl">
        <p className="text-red-400 mb-3">Please read the following instructions carefully before proceeding:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>This exam consists of questions.</li>
          <li>Each question is designed to test your understanding of the material.</li>
          <li>You will have a set amount of time to complete the exam.</li>
          <li>Please ensure that you are in a quiet environment free from distractions.</li>
          <li>Make sure to review your answers before submitting.</li>
        </ul>
      </div>

      <div className="flex items-center mb-5">
        <input
          type="checkbox"
          id="accept-terms"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="accept-terms" className="text-sm text-gray-700">
          I accept the terms and conditions of the exam.
        </label>
      </div>

      <button
        disabled={!acceptedTerms}
        onClick={handleStartExam}
        className="flex w-full rounded-full bg-orange-500 cursor-pointer disabled:bg-orange-500/50 disabled:cursor-not-allowed p-1 justify-center font-semibold md:font-bold text-base md:text-lg text-center mt-10 text-white hover:bg-orange-500"
      >
        Start
      </button>
    </AnimateProvider>
  );
}

export default Question;
