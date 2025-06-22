import axios from "axios";
import { create } from "zustand";
import api from "./api";

// Helper function to get the access token from localStorage
function getToken() {
  const storedData = JSON.parse(localStorage.getItem("user"));
  const token = storedData?.data?.access_token;
  if (!token) {
    throw new Error("Authorization Token not found. Please log in.");
  }
  return token;
}

// Fetch questions from API
export async function checkSession() {
  try {
    const token = getToken();
    const response = await api.get("/exam/session/", {
      headers: { Authorization: `Bearer ${token}` },
      // params: { shift_plan_program_id: shiftPlanProgramId ?? 0 },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data?.message ||
        error.response.statusText ||
        "An error occurred."
      : error.message || "Network error. Please check your connection.";
    console.error("Error fetching questions:", errorMessage);
    throw new Error(errorMessage);
  }
}
export async function fetchQuestionsFromApi() {
  try {
    const token = getToken();
    const response = await api.get("/exam/list/questions/", {
      headers: { Authorization: `Bearer ${token}` },
      // params: { shift_plan_program_id: shiftPlanProgramId ?? 0 },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data?.message ||
        error.response.statusText ||
        "An error occurred."
      : error.message || "Network error. Please check your connection.";
    console.error("Error fetching questions:", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function sessionEnd() {
  try {
    const token = getToken();
    
    const response = await api.post("/exam/session/end/", {},{
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: true,
      message: "Exam submitted successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("Error submitting answer:", error.response || error.message);
      return {
      success: false,
      message: error.message || "An error occurred",
      data: null,
    };
  }
}

export async function fetchReview() {
  try {
    const token = getToken();
    const response = await api.get("/exam/review/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: true,
      message: "Exam submitted successfully",
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error fetching review:", error.response || error.message);
    return {
      success: false,
      message: error.message || "An error occurred",
      data: null,
    };
  }
}
// Fetch a question by ID
export async function fetchQuestionById(questionId) {
  try {
    const token = getToken();
    const response = await api.get("/exam/questions", {
      headers: { Authorization: `Bearer ${token}` },
      params: { page: questionId },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.status === 404
        ? "Question not found. Please check the question ID."
        : error.response?.data?.message ||
          "An error occurred while fetching the question. Please try again later.";
    console.error("Error fetching question by ID:", errorMessage);
    throw new Error(errorMessage);
  }
}

// Submit an answer for a question
export async function submitAnswer({ questionId, answer }) {
  try {
    const token = getToken();
    const response = await api.post(
      "/exam/answer/submit/",
      { question_id: questionId, selected_answer: answer },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.status >= 200 && response.status < 300) {
      return { success: true, message: "Answer submitted successfully" };
    } else {
      throw new Error("Failed to submit answer");
    }
  } catch (error) {
    console.error("Error submitting answer:", error.response || error.message);
    return { success: false, message: error.message || "An error occurred" };
  }
}
export async function endSession({}) {
  try {
    const token = getToken();
    const response = await api.post("/exam/session/end/", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status >= 200 && response.status < 300) {
      return { success: true, message: "Exam submitted successfully" };
    } else {
      throw new Error("Failed to submit answer");
    }
  } catch (error) {
    console.error("Error submitting Exam:", error.response || error.message);
    return { success: false, message: error.message || "An error occurred" };
  }
}

// Zustand store for managing API data
export const useQuestionStore = create((set) => ({
  questions: [],
  questionDetail: null,
  error: null,

  fetchQuestions: async () => {
    try {
      const data = await fetchQuestionsFromApi();
      set({ questions: data, error: null });
    } catch (error) {
      set({ error: error.message });
    }
  },

  fetchQuestionDetail: async (questionId) => {
    try {
      const data = await fetchQuestionById(questionId);
      set({ questionDetail: data, error: null });
    } catch (error) {
      set({ error: error.message });
    }
  },

  submitAnswer: async ({ questionId, answer }) => {
    const result = await submitAnswer({ questionId, answer });
    set({ error: result.success ? null : result.message });
    return result;
  },
}));
