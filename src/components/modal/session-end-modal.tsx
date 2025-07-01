import useQuestion from "@/hook/useQuestion";
import { useEffect } from "react";
import { FaCheckCircle, FaClock, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router";

const SessionEndModal = () => {
  const { sessionEnd } = useQuestion();

  const navigate = useNavigate();

  const handleConfirmSubmit = async () => {
    try {
      await sessionEnd();
    } catch (error) {
      console.error("Error submitting exam:", error);
    } finally {
      navigate("/thank-you");
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleConfirmSubmit();
    }, 10000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center space-x-3 px-5 py-3 bg-gradient-to-r from-red-100 to-orange-50 border-b border-red-200">
          <div className="p-2 bg-red-200 rounded-lg">
            <FaClock className="text-red-700 text-lg" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">
              Session Ended
            </h2>
            <p className="text-xs text-gray-600">Time is up</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-sm">
          {/* Warning */}
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaExclamationTriangle className="w-6 h-6 text-red-600" />
            </div>
          
            <p className="text-gray-600 text-xs">
              Your exam will auto-submit shortly.
            </p>
          </div>

          {/* Summary Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center text-blue-800 font-semibold mb-2">
              <FaCheckCircle className="w-4 h-4 mr-2" />
              <span>What to Expect</span>
            </div>
            <ul className="list-disc list-inside text-blue-700 text-xs space-y-1">
              <li>All answers are auto-saved</li>
              <li>Unanswered will be marked incomplete</li>
              <li>You'll be redirected to results</li>
            </ul>
          </div>

          {/* Status Indicator */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-red-100 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-red-700">
                Ending in moments...
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-[11px] text-gray-500">
            Don’t worry, your progress is saved automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionEndModal;
