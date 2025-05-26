import { create } from "zustand";
import { persist } from "zustand/middleware";

const useQuestionStore = create(
  persist(
    (set) => ({
      question: [],
      userAnswer: [],
      setUserAnswer: (newAnswer) =>
        set((state) => {
          const existingAnswerIndex = state.userAnswer.findIndex(
            (ans) => ans.question === newAnswer.question
          );
    
          if (existingAnswerIndex !== -1) {
            // Update the existing answer
            const updatedAnswers = [...state.userAnswer];
            updatedAnswers[existingAnswerIndex] = newAnswer;
            return { userAnswer: updatedAnswers };
          } else {
            // Add a new answer
            return { userAnswer: [...state.userAnswer, newAnswer] };
          }
        }),
      error: null,
      totalTime: 0,
      trueAnswer: 0,
      falseAnswer: 0,
      auth: {},
      page: 1,
      isLoading: false, // New loading state
      
      fetchQuestion: async (query) => {
        set({ isLoading: true, error: null }); // Set loading to true and reset error
        try {
          const app_url = process.env.BACKEND_BASE_URL;
          const response = await fetch(`app_url/${query}`);
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();

          set((state) => ({
            ...state,
            question: data.results,
            isLoading: false, // Set loading to false after data is loaded
          }));
        } catch (error) {
          set((state) => ({
            ...state,
            error: error.message, // Store the error message
            isLoading: false, // Set loading to false on error
          }));
        }
      },

      authUser: (auth) => set((state) => ({ ...state, auth })),
      addAnswer: ({ question, answer }) =>
        set((state) => ({
          ...state,
          userAnswer: [...state.userAnswer, { question, answer }],
        })),
      trueAction: () =>
        set((state) => ({ ...state, trueAnswer: state.trueAnswer + 1 })),
      falseAction: () =>
        set((state) => ({ ...state, falseAnswer: state.falseAnswer + 1 })),
      logoutUser: () =>
        set({
          question: [],
          userAnswer: [],
          error: null,
          totalTime: 0,
          trueAnswer: 0,
          falseAnswer: 0,
          auth: {},
          page: 1,
          isLoading: false,
        }),
      resetQuestion: () =>
        set((state) => ({
          ...state,
          question: [],
          trueAnswer: 0,
          falseAnswer: 0,
          error: null,
          page: 1,
        })),
      setTimeStamp: (time) =>
        set((state) => ({
          ...state,
          totalTime: time,
        })),
      nextPage: () =>
        set((state) => ({
          ...state,
          page: state.page + 1,
        })),
    }),
    {
      name: "question-storage", // unique name for storage
    }
  )
);

export default useQuestionStore;
