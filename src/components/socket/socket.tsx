import { useEffect, useRef, useState } from "react";
import PauseStatus from "../modal/pause-status-modal";
import SessionEndModal from "../modal/session-end-modal";
import { FaClock } from "react-icons/fa";

interface StatusMessage {
  status: string;
  present: boolean;
  session_status: string;
  session_effective_end: string;
  time_remaining: number;
  timestamp?: string;
}

function SocketInitialization() {
  const baseURL = import.meta.env.VITE_PRODUCTION_SOCKET_URL;

  const [statusMsg, setStatusMsg] = useState<StatusMessage | null>(null);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [socketError, setSocketError] = useState<string | null>(null);
  const [_reconnectAttempts, setReconnectAttempts] = useState<number>(0);

  console.log(_reconnectAttempts);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const statusIntervalRef = useRef<NodeJS.Timeout | null>(null);

  function getToken(): string | null {
    const storedData = localStorage.getItem("userInfo");
    try {
      const parsed = storedData ? JSON.parse(storedData) : null;
      return parsed?.access_token || null;
    } catch {
      return null;
    }
  }

  const connectWebSocket = () => {
    const token = getToken();
    if (!token) {
      setSocketError("Authorization token not found. Please log in.");
      return;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const socket = new WebSocket(
      `ws://${baseURL}/ws/exam/status/?token=${token}`
    );
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      setSocketConnected(true);
      setSocketError(null);
      setReconnectAttempts(0);

      socket.send(JSON.stringify({ type: "status" }));

      statusIntervalRef.current = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "status" }));
        }
      }, 10000);
    };

    socket.onmessage = (event: MessageEvent) => {
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

    socket.onerror = () => {
      setSocketError("Connection error. Reconnecting...");
      setSocketConnected(false);
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (statusIntervalRef.current) clearInterval(statusIntervalRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const handleManualReconnect = () => {
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    setReconnectAttempts(0);
    connectWebSocket();
  };

  if (
    statusMsg?.status === "submitted" ||
    statusMsg?.session_status === "submitted" ||
    statusMsg?.status === "completed" ||
    statusMsg?.session_status === "completed"
  ) {
    return <SessionEndModal />;
  }

  if (
    statusMsg?.status === "paused" ||
    statusMsg?.session_status === "paused"
  ) {
    return <PauseStatus />;
  }

  const formatTimeRemaining = (seconds: number) => {
    if (!seconds || seconds <= 0) return "00:00:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} `;
  };

  return (
    <div className="w-full mb-4 py-3 px-4 flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50 border border-gray-200 rounded-lg shadow-sm">
      {/* Connection Status */}
      <div
        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm border transition-all duration-300 ${
          socketConnected
            ? "bg-green-50 text-green-700 border-green-200 shadow-green-100"
            : socketError
            ? "bg-red-50 text-red-700 border-red-200 shadow-red-100"
            : "bg-yellow-50 text-yellow-700 border-yellow-200 shadow-yellow-100"
        }`}
      >
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            socketConnected
              ? "bg-green-500 animate-pulse"
              : socketError
              ? "bg-red-500"
              : "bg-yellow-500 animate-pulse"
          }`}
        ></div>
        {socketConnected ? (
          <span className="font-semibold">Connected</span>
        ) : socketError ? (
          <>
            <span className="font-semibold">{socketError}</span>
            <button
              onClick={handleManualReconnect}
              className="ml-2 px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors duration-200 font-medium"
            >
              Retry
            </button>
          </>
        ) : (
          <span className="font-semibold">Connecting...</span>
        )}
      </div>

      {/* Timer Section */}
      {statusMsg && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-3 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-gray-600 text-sm font-semibold">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <FaClock className="text-blue-600 text-sm" />
              </div>
              <span>Time Remaining <sub>(Hours:Minutes)</sub></span>
            </div>
          
          </div>

          <div className="text-center mb-2">
            <div className="text-xl font-mono font-bold text-blue-700 tracking-wider">
              {formatTimeRemaining(statusMsg.time_remaining)}
            </div>
          </div>

          <div className="w-full bg-gray-300 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(100, (statusMsg.time_remaining / 3600) * 100)}%`,
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SocketInitialization;
