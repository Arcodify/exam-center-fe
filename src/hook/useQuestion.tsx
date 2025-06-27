import { questionServices } from "@/services/question.services";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

interface Question {
  id: number;
  question: string;
  answers: {
    options: string;
    answer_number: string;
  }[];
  student_answer: string | null;
  is_answered: boolean;
}

const useQuestion = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const navigate = useNavigate();
  // Debug: Log questions whenever they change
  useEffect(() => {
    console.log("🔄 Questions state updated:", questions);
  }, [questions]);

  const fetchQuestions = async () => {
    try {
      console.log("🚀 Fetching questions...");
      const response = await questionServices.getQuestions();
      console.log("📋 Question response:", response);

      if (response.success) {
        console.log("✅ Questions fetched successfully");
        toast.success(response.message || "Questions fetched successfully");

        console.log("📝 Setting questions to:", response.data);
        setQuestions(response.data);

        // Don't log questions here - it will still be the old value
        // The useEffect above will log when it actually updates
      } else {
        console.log("❌ Questions fetch failed:", response.message);
        navigate("/");
        toast.error(response.message || "Something went wrong");
      }
    } catch (error) {
      console.error("💥 Error in fetchQuestions:", error);
      toast.error("Failed to fetch questions");
      navigate("/");
    }
  };

  const answerSubmit = async (question_id: number, selected_answer: string) => {
    try {
      const response = await questionServices.answersubmit(
        question_id,
        selected_answer
      );
      if (response.success) {
        console.log("Answer submitted successfully");
      } else {
        console.log("Failed to submit answer");
      }
    } catch (error) {
      console.error("Error in answerSubmit:", error);
    }
  };

  const sessionEnd = async () => {
    const response = await questionServices.sessionEnd();
    if (response.success) {
      console.log("Session ended successfully");
    } else {
      console.log("Failed to end session");
    }
  };
  return { questions, setQuestions, fetchQuestions, answerSubmit, sessionEnd };
};

export default useQuestion;
