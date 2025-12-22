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
  event?: any;
}

interface WebSocketMessage {
  type: string;
  data?: any;
  message?: string;
  error?: string;
  timestamp?: string;
}

interface Question {
  id: number;
  question: string;
  paragraph?: string | null;
  marks?: number;
  negative_marks?: number;
  answers: {
    options: string;
    answer_number: string;
  }[];
  student_answer: string | null;
  is_answered: boolean;
}

declare global {
  interface Window {
    socketService?: {
      getQuestions: () => boolean;
      submitAnswer: (question_id: number, selected_answer: string) => boolean;
      endSession: () => boolean;
      setQuestionCallbacks: (callbacks: any) => void;
      isConnected: boolean;
    };
  }
}

function SocketInitialization() {
  const rawSocketHost = import.meta.env.VITE_PRODUCTION_SOCKET_URL;

  const [statusMsg, setStatusMsg] = useState<StatusMessage | null>(null);
  const [displayTime, setDisplayTime] = useState<number | null>(null);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [socketError, setSocketError] = useState<string | null>(null);
  const [_reconnectAttempts, setReconnectAttempts] = useState<number>(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const statusIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Callbacks for parent component
  const questionCallbacksRef = useRef<{
    onQuestionsReceived?: (questions: Question[]) => void;
    onAnswerSubmitted?: (response: any) => void;
    onSessionEnded?: (response: any) => void;
    onError?: (error: string, type?: string) => void;
  }>({});

  const normalizeTimeRemaining = (time?: number | null) => {
    if (time === undefined || time === null) return null;
    const parsed = Number(time);
    if (Number.isNaN(parsed)) return null;
    return Math.max(0, Math.floor(parsed));
  };

  function getToken(): string | null {
    const storedData = localStorage.getItem("userInfo");
    try {
      const parsed = storedData ? JSON.parse(storedData) : null;
      return parsed?.access_token || null;
    } catch {
      return null;
    }
  }

  const setQuestionCallbacks = (
    callbacks: typeof questionCallbacksRef.current
  ) => {
    questionCallbacksRef.current = callbacks;
  };

  const sendWebSocketMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  };

  const getQuestions = () => {
    return sendWebSocketMessage({ action: "get_question_list" });
  };

  const submitAnswer = (question_id: number, selected_answer: string) => {
    return sendWebSocketMessage({
      action: "submit_answer",
      question_id,
      selected_answer,
    });
  };

  const endSession = () => {
    return sendWebSocketMessage({ action: "complete_check" });
  };

  const buildSocketUrl = (token: string) => {
    const normalizeHost = (host?: string) =>
      (host || "")
        .replace(/^https?:\/\//, "")
        .replace(/^wss?:\/\//, "")
        .replace(/\/$/, "");

    const host = normalizeHost(rawSocketHost) || window.location.host;
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    return `${protocol}://${host}/ws/exam/unified/?token=${token}`;
  };

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

    const socketUrl = buildSocketUrl(token);
    const socket = new WebSocket(socketUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      setSocketConnected(true);
      setSocketError(null);
      setReconnectAttempts(0);

      // Request initial status
      socket.send(JSON.stringify({ action: "get_status" }));

      // Set up status polling
      statusIntervalRef.current = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ action: "get_status" }));
        }
      }, 10000);

      // Initialize socket service for parent components
      window.socketService = {
        getQuestions,
        submitAnswer,
        endSession,
        setQuestionCallbacks,
        isConnected: true,
      };
    };

    socket.onmessage = (event: MessageEvent) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);

        switch (data.type) {
          case "status": {
            setStatusMsg({
              ...data.data,
              timestamp: data.timestamp || new Date().toISOString(),
            });
            const normalizedTime = normalizeTimeRemaining(
              data.data?.time_remaining
            );
            if (normalizedTime !== null) {
              setDisplayTime(normalizedTime);
            }

            // Resolve any waiting "end session" callbacks when we see a submitted/completed status
            if (
              ["submitted", "completed"].includes(
                data.data?.status || data.data?.session_status
              )
            ) {
              questionCallbacksRef.current.onSessionEnded?.(data);
            }
            break;
          }

          case "question_list":
            if (data.error) {
              const errorMsg = data.error ?? data.message ?? "Unknown error";
              questionCallbacksRef.current.onError?.(
                errorMsg,
                "get_question_list"
              );
            } else {
              questionCallbacksRef.current.onQuestionsReceived?.(
                data.data || []
              );
            }
            break;

          case "answer_submitted":
            if (data.error) {
              const errorMsg = data.error ?? data.message ?? "Unknown error";
              questionCallbacksRef.current.onError?.(errorMsg, "submit_answer");
            } else {
              questionCallbacksRef.current.onAnswerSubmitted?.(data);
            }
            break;

          case "exam_review":
          case "paginated_questions":
            // Add handlers here if the UI needs these responses
            break;

          case "admin_stats_update":
            // Admin-only payload; not currently consumed in the candidate UI
            break;

          case "error":
            questionCallbacksRef.current.onError?.(
              data.error || data.message || "An error occurred",
              "general"
            );
            break;

          default:
            console.warn("Unknown message type:", data.type);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
        questionCallbacksRef.current.onError?.(
          "Failed to parse server response",
          "parse_error"
        );
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setSocketError("Connection error. Reconnecting...");
      setSocketConnected(false);
    };

    socket.onclose = (event) => {
      setSocketConnected(false);
      if (window.socketService) {
        window.socketService.isConnected = false;
      }
      if (statusIntervalRef.current) clearInterval(statusIntervalRef.current);

      // Auto-reconnect with exponential backoff
      if (event.code !== 1000) {
        const attempts = _reconnectAttempts + 1;
        setReconnectAttempts(attempts);

        const delay = Math.min(1000 * Math.pow(2, attempts), 30000);
        reconnectTimerRef.current = setTimeout(() => {
          connectWebSocket();
        }, delay);
      }
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (statusIntervalRef.current) clearInterval(statusIntervalRef.current);
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounting");
      }
    };
  }, []);

  const handleManualReconnect = () => {
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    setReconnectAttempts(0);
    connectWebSocket();
  };

  useEffect(() => {
    if (countdownIntervalRef.current)
      clearInterval(countdownIntervalRef.current);

    countdownIntervalRef.current = setInterval(() => {
      setDisplayTime((prev) => {
        if (prev === null) return prev;
        return Math.max(0, prev - 1);
      });
    }, 1000);

    return () => {
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
    };
  }, []);

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

  const formatTimeRemaining = (seconds?: number | null) => {
    const totalSeconds = Math.max(0, Math.floor(seconds ?? 0));
    if (totalSeconds <= 0) return "00:00:00";

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const effectiveTimeRemaining =
    displayTime ?? normalizeTimeRemaining(statusMsg?.time_remaining) ?? 0;

  return (
    <>
      <div className="p-4">
        {/* Connection Status */}

        {/* Timer Section */}
        {statusMsg && (
          <div className="w-full">
            <div className="flex items-center gap-2">
              <section className="mb-2">
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
                  <span className="font-semibold">{/* Connected */}</span>
                ) : socketError ? (
                  <>
                    {/* <span className="font-semibold">{socketError}</span>
                    <button
                      onClick={handleManualReconnect}
                      className="ml-2 px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors duration-200 font-medium"
                    >
                      Retry
                    </button> */}
                  </>
                ) : (
                  <span className="font-semibold">{/* Connecting... */}</span>
                )}
              </section>

              <div className="text-center mb-2">
                <div className="text-xl font-mono font-bold text-blue-700 tracking-wider">
                  {formatTimeRemaining(effectiveTimeRemaining)}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min(
                    100,
                    (effectiveTimeRemaining / 3600) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SocketInitialization;
