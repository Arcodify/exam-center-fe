import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimateProvider from "../../components/AnimateProvider/AnimateProvider";
import {
  FaClock,
  FaUserCheck,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

function SocketInitialization() {
  const [statusMsg, setStatusMsg] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [socketError, setSocketError] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const statusIntervalRef = useRef(null);

  function getToken() {
    const storedData = JSON.parse(localStorage.getItem("user"));
    return storedData?.data?.access_token;
  }

  // Format time remaining in HH:MM:SS
  const formatTimeRemaining = (seconds) => {
    if (!seconds || seconds <= 0) return "00:00:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Format session end time
  const formatSessionEnd = (endTime) => {
    if (!endTime) return "N/A";
    try {
      const date = new Date(endTime);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      });
    } catch (error) {
      return endTime;
    }
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return {
          color: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-200",
          icon: FaCheckCircle,
        };
      case "inactive":
        return {
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-200",
          icon: FaExclamationTriangle,
        };
      case "pending":
        return {
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          icon: FaSpinner,
        };
      default:
        return {
          color: "text-gray-600",
          bg: "bg-gray-50",
          border: "border-gray-200",
          icon: FaExclamationTriangle,
        };
    }
  };

  const connectWebSocket = () => {
    const token = getToken();
    if (!token) {
      setSocketError("Authorization token not found. Please log in.");
      return;
    }

    // Clean up any existing connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Create new WebSocket connection with token in query string
    const socket = new WebSocket(
      `ws://69.62.85.89:8000/ws/exam/status/?token=${token}`
    );
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      setSocketConnected(true);
      setSocketError(null);
      setReconnectAttempts(0);

      // Send initial status request
      socket.send(JSON.stringify({ type: "status" }));

      // Setup periodic status requests (every 10 seconds)
      statusIntervalRef.current = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "status" }));
        }
      }, 10000);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "status") {
          console.log("Status update:", data);
          setStatusMsg({
            ...data.data,
            timestamp: data.timestamp || new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    socket.onerror = (error) => {
      setSocketError("Connection error. Reconnecting...");
      setSocketConnected(false);
    };
  };

  useEffect(() => {
    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleManualReconnect = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }
    setReconnectAttempts(0);
    connectWebSocket();
  };

  const statusInfo = getStatusInfo(statusMsg?.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="w-full py-1">
      {/* Connection Status - Compact */}
      <div className="w-full flex justify-center mb-2">
        <div
          className={`px-4 py-2 rounded-lg text-xs font-medium shadow-sm transition-all duration-300 ${
            socketConnected
              ? "bg-green-100 border border-green-400 text-green-800"
              : socketError
              ? "bg-red-100 border border-red-400 text-red-800"
              : "bg-yellow-100 border border-yellow-400 text-yellow-800"
          }`}
        >
          {socketConnected ? (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Connected</span>
            </div>
          ) : socketError ? (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>{socketError}</span>
              <button
                onClick={handleManualReconnect}
                className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span>Connecting...</span>
            </div>
          )}
        </div>
      </div>

      {/* Exam Status Card - Compact */}
      {statusMsg && (
        <div className="w-full flex justify-center mb-2">
          <div className="bg-white border border-gray-200 rounded-lg shadow-md max-w-4xl w-full overflow-hidden">
            {/* Header - Compact */}
            <div
              className={`px-4 py-2 ${statusInfo.bg} ${statusInfo.border} border-b`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <StatusIcon className={`text-lg ${statusInfo.color}`} />
                  <h2 className="text-lg font-bold text-gray-800">
                    Exam Status
                  </h2>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(statusMsg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Content - Compact Grid Layout */}
            <div className="p-3">
              {/* Top Row - Status and Present */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <span className={`text-sm font-semibold ${statusInfo.color}`}>
                    {statusMsg.status || "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-sm font-medium text-gray-700">Present:</span>
                  <div className="flex items-center space-x-1">
                    {statusMsg.present ? (
                      <>
                        <FaUserCheck className="text-green-500 text-sm" />
                        <span className="text-green-600 font-semibold text-sm">
                          Yes
                        </span>
                      </>
                    ) : (
                      <>
                        <FaExclamationTriangle className="text-red-500 text-sm" />
                        <span className="text-red-600 font-semibold text-sm">
                          No
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Middle Row - Session Status and End */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-sm font-medium text-gray-700">
                    Session:
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {statusMsg.session_status || "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-sm font-medium text-gray-700">
                    Ends:
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {formatSessionEnd(statusMsg.session_effective_end)}
                  </span>
                </div>
              </div>

              {/* Bottom Row - Time Remaining (Full Width) */}
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md border border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <FaClock className="text-blue-500 text-sm" />
                    <span className="text-sm font-medium text-gray-700">
                      Time Remaining
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {statusMsg.time_remaining
                      ? `${statusMsg.time_remaining.toFixed(0)}s`
                      : "0s"}
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 font-mono">
                    {formatTimeRemaining(statusMsg.time_remaining)}
                  </div>
                  {statusMsg.time_remaining && (
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-1000"
                          style={{
                            width: `${Math.min(
                              100,
                              (statusMsg.time_remaining / 3600) * 100
                            )}%`,
                          }}
                        >  </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SocketInitialization;
