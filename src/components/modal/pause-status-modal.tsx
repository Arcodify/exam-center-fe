import { FaClock, FaPause } from "react-icons/fa";

const PauseStatus = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-orange-100 to-orange-50 border-b border-orange-200 flex items-center space-x-3">
          <div className="p-2 bg-orange-200 rounded-lg">
            <FaPause className="text-orange-700 text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Session Paused</h2>
            <p className="text-xs text-gray-600">Please wait to resume</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-center text-sm text-gray-700">
          <div>
            <p className="mb-2">
              Your exam is temporarily paused. Don’t worry, your answers are
              saved.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-orange-100 rounded-full">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-orange-700 font-medium">
                Waiting to resume...
              </span>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start space-x-2">
            <FaClock className="text-green-600 mt-1" />
            <span>
              <strong className="text-green-700">
                Time will be compensated
              </strong>{" "}
              for this pause. You won’t lose any allocated time.
            </span>
          </div>

          <ul className="text-left text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-1">
            <li>• Stay on this page</li>
            <li>• Don’t refresh or close the browser</li>
            <li>• Exam will resume automatically</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500">
          If not resumed in 15 minutes, contact your exam administrator.
        </div>
      </div>
    </div>
  );
};

export default PauseStatus;
