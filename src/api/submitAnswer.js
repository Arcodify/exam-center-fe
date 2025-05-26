// import axios from "axios";

// // /api/submitAnswer.js
// export default async function submitaAnswer({ questionId, answer }) {
//   try {
//     const url = `http://localhost/aeirc/exam/api/question/store`;

//     // Get the access token from localStorage
//     const storedData = localStorage.getItem("user");
//     const token = storedData ? JSON.parse(storedData)?.data?.access_token : null;

//     // Make the POST request using axios
//     const response = await axios.post(
//       url,
//       {
//         question_id: questionId,  // Question ID to identify the question
//         answer: answer,           // Answer provided by the user
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,  // Add the token to the Authorization header
//         },
//       }
//     );

//     // Check if the response status is successful (status code 200-299)
//     if (response.status >= 200 && response.status < 300) {
//       return { success: true, message: "Answer submitted successfully" };
//     } else {
//       throw new Error("Failed to submit answer");
//     }
//   } catch (error) {
//     console.error("Error submitting answer:", error);
//     return { success: false, message: error.message || "An error occurred" };
//   }
// }
