import React from "react";
import { FaCheckCircle, FaExclamationTriangle, FaTimes } from "react-icons/fa";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  answeredCount?: number;
  totalQuestions?: number;
  isLoading?: boolean;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  answeredCount = 0,
  totalQuestions = 0,
  isLoading = false,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const unansweredCount = totalQuestions - answeredCount;
  const progressPercentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/10 bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaExclamationTriangle className="text-blue-600 text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Confirm Submission</h2>
                <p className="text-sm text-gray-600">Review your answers before submitting</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <FaTimes className="text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Progress Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Answer Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Questions:</span>
                <span className="font-semibold text-gray-800">{totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Answered:</span>
                <div className="flex items-center space-x-2">
                  <FaCheckCircle className="text-green-500 text-sm" />
                  <span className="font-semibold text-green-600">{answeredCount}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Unanswered:</span>
                <span className="font-semibold text-red-600">{unansweredCount}</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Warning Message */}
          {unansweredCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <FaExclamationTriangle className="text-amber-500 text-lg mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-amber-800 mb-1">Unanswered Questions</h4>
                  <p className="text-sm text-amber-700">
                    You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}. 
                    Are you sure you want to submit?
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Final Confirmation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 text-center">
              <strong>This action cannot be undone.</strong> Once submitted, you cannot change your answers.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <FaCheckCircle className="text-sm" />
                <span>Submit Exam</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
