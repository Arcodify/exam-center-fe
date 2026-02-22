/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosPrivate } from "@/services/axios";
import { questionServices } from "@/services/question.services";
import {
  appendAnswerToProgress,
  clearAllExamProgress,
  getPendingAnswers,
  markAnswerSynced,
  mergeLocalAnswers,
} from "@/utils/examProgress";
import { useRef, useState } from "react";
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
  const initialSyncDoneRef = useRef(false);

  const fetchQuestions = async () => {
    try {
      // Initial-load behavior: if local progress exists, push it first so the
      // fetched question list reflects persisted answers.
      if (!initialSyncDoneRef.current) {
        initialSyncDoneRef.current = true;
        const pending = getPendingAnswers();
        for (const { question_id, selected_answer } of pending) {
          try {
            await axiosPrivate.post(`/exam/answer/submit/`, {
              question_id,
              selected_answer,
            });
            markAnswerSynced(question_id, selected_answer);
          } catch {
            // Keep pending for later reconnect retries.
          }
        }
      }

      const response: any = await questionServices.getQuestions();

      if (response.success) {
        toast.success(response.message || "Questions fetched successfully");

        const data = Array.isArray(response.data) ? response.data : [];
        setQuestions(mergeLocalAnswers(data));

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

  const answerSubmit: any = async (
    question_id: number,
    selected_answer: string,
  ) => {
    try {
      // Persist locally immediately for refresh/offline resilience.
      appendAnswerToProgress(question_id, selected_answer);

      const response: any = await questionServices.answerSubmit(
        question_id,
        selected_answer,
      );
      if (response.success) {
        // Mark as synced so reconnect sync doesn't re-send needlessly.
        markAnswerSynced(question_id, selected_answer);
      } else {
        console.error("Failed to submit answer");
      }
    } catch (error) {
      console.error("Error in answerSubmit:", error);
    }
  };

  const sessionEnd = async () => {
    const response: any = await questionServices.sessionEnd();
    if (response.success) {
      toast.success("Session ended successfully");
      clearAllExamProgress();
      try {
        sessionStorage.removeItem("institute-data");
      } catch {
        // ignore
      }
      setQuestions([]);
    } else {
      toast.error("Failed to end session");
    }
  };
  return { questions, setQuestions, fetchQuestions, answerSubmit, sessionEnd };
};

export default useQuestion;
