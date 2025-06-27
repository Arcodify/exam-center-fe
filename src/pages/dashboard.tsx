import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const { user, formatTime } = useAuth();
  const navigate = useNavigate();

  // Show loading if user info is not loaded yet
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-start font-sans">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6 space-y-6">
        {/* Header with Logout */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome</h1>
        </div>

        {/* User Info */}
        <div className=" flex justify-between gap-4 items-start  ">
          <div className="space-y-1 text-gray-700 text-base leading-6">
            <p>
              <span className="font-semibold">Symbol Number:</span>{" "}
              {user?.symbol_number}
            </p>
            <p>
              <span className="font-semibold">Name:</span> {user?.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user?.email}
            </p>
            <p>
              <span className="font-semibold">Program:</span>{" "}
              {user?.program?.name || "Not available"}
            </p>
            <p>
              <span className="font-semibold">Level:</span>{" "}
              {user?.level?.name || "Not available"}
            </p>
            <p>
              <span className="font-semibold">Exam duration:</span>{" "}
              {formatTime(Number(user?.duration))}
            </p>
          </div>

          <div className="flex justify-center items-center gap-4">
            <div>
              <img
                src={
                  user.photo ||
                  "https://t4.ftcdn.net/jpg/02/24/86/95/360_F_224869519_aRaeLneqALfPNBzg0xxMZXghtvBXkfIA.jpg"
                }
                alt="Student"
                className="w-40 h-32 rounded-xl object-cover border-2 border-white shadow-md"
              />
            </div>
            <div>
              <img
                src={
                  user.photo ||
                  "https://t4.ftcdn.net/jpg/02/24/86/95/360_F_224869519_aRaeLneqALfPNBzg0xxMZXghtvBXkfIA.jpg"
                }
                alt="Student"
                className="w-40 h-32 rounded-xl object-cover border-2 border-white shadow-md"
              />
            </div>
          </div>
        </div>
        {/* Instructions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Instructions</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>
              Please read the following instructions carefully before
              proceeding:
            </li>
            <li>This exam consists of questions.</li>
            <li>
              Each question is designed to test your understanding of the
              material.
            </li>
            <li>You will have a set amount of time to complete the exam.</li>
            <li>
              Please ensure that you are in a quiet environment free from
              distractions.
            </li>
            <li>Make sure to review your answers before submitting.</li>
          </ul>
        </div>

        {/* Terms and Conditions */}
        <div className="pt-4">
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              className="accent-blue-600 w-4 h-4"
              checked={isTermsAccepted}
              onChange={() => setIsTermsAccepted(!isTermsAccepted)}
            />
            <span>I accept the terms and conditions of the exam.</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={!isTermsAccepted}
          onClick={() => navigate("/questions")}
          className={`w-full mt-2 py-2 px-4 bg-orange-500  text-white font-semibold rounded-md hover:bg-orange-600 transition ${
            !isTermsAccepted
              ? "opacity-60 cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          {isTermsAccepted
            ? "Start Exam"
            : "Please accept the terms and conditions"}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
