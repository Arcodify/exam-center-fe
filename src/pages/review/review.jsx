import React, { useEffect, useState } from "react";
import { fetchReview } from "../../api/question";

const Review = () => {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getReview = async () => {
      try {
        setLoading(true);
        const result = await fetchReview();
        console.log(result);
        
        if (result.success) {
          setReview(result.data);
        } else {
          setError(result.message || 'Failed to fetch review');
        }
      } catch (err) {
        setError("An error occurred while fetching review");
        console.error("Review fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    getReview();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading review...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No review data available</p>
        </div>
      </div>
    );
  }

  const { exam, questions } = review;

  console.log(exam);
  console.log(questions);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Exam Review</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">Exam Details</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">Title:</span>
                  <p className="text-gray-800">{exam?.exam_title}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Program:</span>
                  <p className="text-gray-800">{exam?.program}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Subject:</span>
                  <p className="text-gray-800">{exam?.subject || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Total Marks:</span>
                  <p className="text-gray-800">{exam?.total_marks}</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">Session Information</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">Session ID:</span>
                  <p className="text-gray-800">{exam?.session_id}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Start Time:</span>
                  <p className="text-gray-800">
                    {new Date(exam?.start_time).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">End Time:</span>
                  <p className="text-gray-800">
                    {new Date(exam?.end_time).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Submitted At:</span>
                  <p className="text-gray-800">
                    {new Date(exam?.submitted_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */} 
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Q uestions Review</h2>
          {questions && questions.length > 0 ? (
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Question {index + 1}
                    </h3>
                    <span className="text-sm text-gray-500">ID: {question?.id}</span>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">{question.question}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700 mb-3">Options:</h4>
                    {question.answers.map((answer, answerIndex) => (
                      <div 
                        key={answerIndex} 
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          question?.student_answer === answer?.answer_number
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="font-medium text-gray-600 mr-3 min-w-[20px]">
                            {answer?.answer_number.toUpperCase()}.
                          </span>
                          <span className="text-gray-700">{answer?.options}</span>
                          {question?.student_answer === answer?.answer_number && (
                            <span className="ml-auto text-blue-600 font-medium">
                              ✓ Your Answer
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {question.student_answer && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <span className="font-medium">Your Answer:</span> {question?.student_answer.toUpperCase()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <p className="text-gray-600">No questions available for review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;
