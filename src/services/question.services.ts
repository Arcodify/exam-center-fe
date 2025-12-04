import { axiosPrivate } from "./axios";

class QuestionServices {
  async getQuestions() {
    if (window.socketService?.isConnected) {
      console.log("📡 Using WebSocket for getQuestions");
      const success = window.socketService.getQuestions();

      if (!success) {
        console.warn("WebSocket message send failed, falling back to HTTP...");
        return this.getQuestionsHTTP();
      }

      return new Promise((resolve) => {
        window.socketService?.setQuestionCallbacks({
          onQuestionsReceived: (questions: any[]) =>
            resolve({
              success: true,
              data: questions,
              message: "Questions received via WebSocket",
            }),
          onError: (error: string) =>
            resolve({ success: false, data: null, message: error }),
        });
      });
    }

    return this.getQuestionsHTTP();
  }

  private async getQuestionsHTTP() {
    console.warn("⚠️ Using HTTP fallback for getQuestions");
    try {
      const response = await axiosPrivate.get(`/exam/list/questions/`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.error || "Something went wrong",
      };
    }
  }

  async answerSubmit(question_id: number, selected_answer: string) {
    if (window.socketService?.isConnected) {
      console.log("📡 Using WebSocket for answerSubmit");
      const success = window.socketService.submitAnswer(
        question_id,
        selected_answer
      );

      if (!success) {
        console.warn("WebSocket message send failed, falling back to HTTP...");
        return this.answerSubmitHTTP(question_id, selected_answer);
      }

      return new Promise((resolve) => {
        window.socketService?.setQuestionCallbacks({
          onAnswerSubmitted: (response: any) =>
            resolve({
              success: true,
              data: response,
              message: "Answer submitted via WebSocket",
            }),
          onError: (error: string) =>
            resolve({ success: false, data: null, message: error }),
        });
      });
    }

    return this.answerSubmitHTTP(question_id, selected_answer);
  }

  private async answerSubmitHTTP(question_id: number, selected_answer: string) {
    console.warn("⚠️ Using HTTP fallback for answerSubmit");
    try {
      const response = await axiosPrivate.post(`/exam/answer/submit/`, {
        question_id,
        selected_answer,
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.error || "Something went wrong",
      };
    }
  }

  async sessionEnd() {
    if (window.socketService?.isConnected) {
      console.log("📡 Using WebSocket for sessionEnd");
      const success = window.socketService.endSession();

      if (!success) {
        console.warn("WebSocket message send failed, falling back to HTTP...");
        return this.sessionEndHTTP();
      }

      return new Promise((resolve) => {
        // WebSocket does not return an explicit "complete_check" response, so
        // fall back to HTTP after a short grace period to avoid hanging.
        const httpFallback = setTimeout(async () => {
          const httpResponse = await this.sessionEndHTTP();
          resolve(httpResponse);
        }, 3000);

        window.socketService?.setQuestionCallbacks({
          onSessionEnded: (response: any) => {
            clearTimeout(httpFallback);
            resolve({
              success: true,
              data: response,
              message: "Session ended via WebSocket",
            });
          },
          onError: (error: string) => {
            clearTimeout(httpFallback);
            resolve({ success: false, data: null, message: error });
          },
        });
      });
    }

    return this.sessionEndHTTP();
  }

  private async sessionEndHTTP() {
    console.warn("⚠️ Using HTTP fallback for sessionEnd");
    try {
      const response = await axiosPrivate.post("/exam/session/end/", {});
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.error || "Something went wrong",
      };
    }
  }
}

export const questionServices = new QuestionServices();
