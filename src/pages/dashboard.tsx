import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import UserPhoto from "@/assets/man.png";

type InstituteData = {
  session_id: number;
  start_time: string | null;
  status: string | null;
  program_id: number | null;
  program_name: string | null;
  institute_name: string | null;
  institute_logo: string | null;
  isValidated: boolean;
  isLoadingInstitute: boolean;
};

const Dashboard = () => {
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [instituteData, setInstituteData] = useState<InstituteData | null>(
    null
  );
  const { user, formatTime } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = sessionStorage.getItem("institute-data");
    const parsedData = savedData ? JSON.parse(savedData) : null;

    console.log(parsedData);
    setInstituteData(parsedData);
  }, []);

  useEffect(() => {
    const savedData = sessionStorage.getItem("institute-data");
    const parsedData = savedData ? JSON.parse(savedData) : null;

    setInstituteData(parsedData);

    if (parsedData?.start_time) {
      const checkStartTime = () => {
        const now = new Date();
        const examStartTime = new Date(parsedData.start_time);
        setIsExamStarted(now >= examStartTime);
      };

      checkStartTime(); // Initial check

      const interval = setInterval(checkStartTime, 1000); // Check every second
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, []);


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2 text-slate-600">
          <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Main Card */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="">
              <h1 className="text-xl font-semibold text-slate-900">
                Exam Dashboard
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Welcome back, {user?.name}
              </p>
            </div>

            {instituteData && (
              <div className="text-center">
                <div className="flex md:flex-row-reverse items-center gap-4 mt-6  md:mt-0">
                  <img
                    src={instituteData.institute_logo || ""}
                    width={48}
                    height={48}
                    alt="Institute logo"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <h2 className="text-sm text-slate-500 font-semibold">
                    {instituteData.institute_name}
                  </h2>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Student Information */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wide">
                  Student Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div>
                      <span className="text-slate-500">Symbol Number</span>
                      <p className="font-medium text-slate-900">
                        {user?.symbol_number}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Name</span>
                      <p className="font-medium text-slate-900">{user?.name}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Email</span>
                      <p className="font-medium text-slate-900">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-slate-500">Program</span>
                      <p className="font-medium text-slate-900">
                        {user?.program?.name || "Not available"}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Level</span>
                      <p className="font-medium text-slate-900">
                        {user?.level?.name || "Not available"}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Duration</span>
                      <p className="font-medium text-slate-900">
                        {formatTime(Number(user?.duration))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Photos */}
              <div className="flex flex-col lg:items-center gap-3">
                <div className="lg:text-center">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Student Photo
                  </span>
                </div>
                <img
                  src={user.photo || UserPhoto}
                  alt="Student"
                  className="w-24 h-24 rounded-lg object-cover border border-slate-200"
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wide">
                Exam Instructions
              </h3>
              <div className="bg-slate-50 rounded-lg p-4">
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Please read the following instructions carefully before
                      proceeding
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      This exam consists of questions designed to test your
                      understanding
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      You will have a set amount of time to complete the exam
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Ensure you are in a quiet environment free from
                      distractions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Review your answers carefully before submitting</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Terms and Start Button */}
            <div className="space-y-6 pt-4 border border-orange-300 bg-orange-50 p-6 rounded-xl shadow-sm animate-fade-in">
              <h3 className="text-lg font-bold text-orange-700 flex items-center gap-2">
                ⚠️ Please Read & Accept
              </h3>

              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isTermsAccepted}
                    onChange={() => setIsTermsAccepted(!isTermsAccepted)}
                  />
                  <div
                    className={`w-6 h-6 border-2 rounded-md transition-all flex items-center justify-center ${isTermsAccepted
                      ? "bg-orange-600 border-orange-600"
                      : "border-black group-hover:border-orange-400"
                      }`}
                  >
                    {isTermsAccepted && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-base text-slate-800 font-medium leading-relaxed">
                  I accept the <strong>terms and conditions</strong> of the exam and understand all the instructions provided above.
                </span>
              </label>
              {instituteData?.start_time && !isExamStarted && (
                <div className="text-sm pb-0 mb-0 text-orange-600 font-medium">
                  ⏳ Exam will start at:{" "}
                  {new Date(instituteData.start_time).toLocaleTimeString()}
                </div>
              )}

              <button
                type="button"
                disabled={!isTermsAccepted || !isExamStarted}

                onClick={() => navigate("/questions")}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-base transition-all disabled:cursor-not-allowed ${isTermsAccepted && isExamStarted
                  ? "bg-orange-600 hover:bg-orange-700 text-white shadow-md"
                  : "bg-slate-200 text-slate-400"
                  }`}
              >
                {isTermsAccepted ? "Start Exam" : "Please accept the terms and conditions"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
