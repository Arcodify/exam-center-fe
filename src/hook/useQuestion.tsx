import { questionServices } from "@/services/question.services";
import { useState } from "react";
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
  
  const fetchQuestions = async () => {
    try {
      const response = await questionServices.getQuestions();

      if (response.success) {
        toast.success(response.message || "Questions fetched successfully");

        setQuestions(response.data);

        // Don't log questions here - it will still be the old value
        // The useEffect above will log when it actually updates
      } else {
        navigate("/");
        toast.error(response.message || "Something went wrong");
      }
    } catch (error) {
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
        
      } else {
        toast.error("Failed to submit answer");
      }
    } catch (error) {
      console.error("Error in answerSubmit:", error);
    }
  };

  const sessionEnd = async () => {
    const response = await questionServices.sessionEnd();
    if (response.success) {
      toast.success("Session ended successfully");
    } else {
      toast.error("Failed to end session");
    }
  };
  return { questions, setQuestions, fetchQuestions, answerSubmit, sessionEnd };
};

export default useQuestion;
