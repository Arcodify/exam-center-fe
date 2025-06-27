import { axiosPrivate } from "./axios";

class QuestionServices {
  async getQuestions() {
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
        message: error.response.data.message || "Something went wrong",
      };
    }
  }
  async answersubmit(question_id: number, selected_answer: string) {
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
        message: error.response.data.message || "Something went wrong",
      };
    }
  }

  async sessionEnd() {
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
        message: error.response.data.message || "Something went wrong",
      };
    }
  }
}

export const questionServices = new QuestionServices();
