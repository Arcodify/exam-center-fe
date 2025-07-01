import { useEffect, useRef, useState } from "react";
import PauseStatus from "../modal/pause-status-modal";
import SessionEndModal from "../modal/session-end-modal";

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

  return (
    <div className="w-full py-1">
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
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Connected</span>
            </div>
          ) : socketError ? (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
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
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span>Connecting...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SocketInitialization;
