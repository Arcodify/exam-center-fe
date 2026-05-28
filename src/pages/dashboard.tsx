import UserPhoto from "@/assets/man.png";
import InstituteLogo from "@/assets/logo.jpg";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

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
  const examInstructions = [
    "प्रश्नहरू बीच जानका लागि Next र Previous बटन प्रयोग गर्नुहोस्।",
    "दायाँपट्टिको प्यानलमा Question View देखिन्छ भने माथि तपाईंको Progress Bar देखाइन्छ।",
    "माथिल्लो दायाँ कुनामा बाँकी रहेको Exam Time देखाइन्छ।",
    "Question View मा: रातो रंगले उत्तर नदिएका प्रश्न, हरियो रंगले उत्तर दिइसकेका प्रश्न, र खाली अवस्थाले अझै प्रयोग नगरिएका प्रश्नहरू जनाउँछ।",
    "Question View को तल रहेको Exam Indicators ले तपाईंको परीक्षा स्थिति र प्रगतिको छिटो जानकारी दिन्छ।",
  ];
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [instituteData, setInstituteData] = useState<InstituteData | null>(
    null,
  );
  const { user, formatTime } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = sessionStorage.getItem("institute-data");
    const parsedData = savedData ? JSON.parse(savedData) : null;

    setInstituteData(parsedData);
  }, []);

  console.log(user);

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
            {instituteData && (
              <div className="text-center">
                <div className="flex md:flex-row-reverse items-center gap-2 mt-6  md:mt-0">
                  <h2 className="text-sm text-slate-500 font-semibold">
                    {instituteData.institute_name}
                  </h2>

                  <img
                    src={instituteData.institute_logo || InstituteLogo}
                    width={48}
                    height={48}
                    alt="photo"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    onError={(e) => {
                      e.currentTarget.src = InstituteLogo;
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Student Information */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div>
                      <span className="text-slate-500">Name</span>
                      <p className="font-medium text-slate-900">{user?.name}</p>
                    </div>

                    <div>
                      <span className="text-slate-500">Level</span>
                      <p className="font-medium text-slate-900">
                        {user?.level?.name || "Not available"}
                      </p>
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
                      <span className="text-slate-500">Symbol Number</span>
                      <p className="font-medium text-slate-900">
                        {user?.symbol_number}
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
                <img
                  src={user.photo || UserPhoto}
                  alt="photo"
                  className="w-24 h-24 rounded-lg object-cover border border-slate-200"
                  onError={(e) => {
                    e.currentTarget.src = UserPhoto;
                  }}
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
                  {examInstructions.map((instruction) => (
                    <li key={instruction} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Terms and Start Button */}
            <div className="space-y-6 pt-4 border border-orange-300 bg-orange-50 p-6 rounded-xl shadow-sm animate-fade-in">
              <h3 className="text-lg font-bold text-orange-700 flex items-center gap-2">
                ⚠️ Please Accept
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
                    className={`w-6 h-6 border-2 rounded-md transition-all flex items-center justify-center ${
                      isTermsAccepted
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
                  I understand all the instruction provided above.
                </span>
              </label>
              {instituteData?.start_time && (
                <div className="text-sm pb-0 mb-0 text-orange-600 font-medium">
                  ⏳ Exam start time:{" "}
                  {new Date(instituteData.start_time).toLocaleTimeString()}
                </div>
              )}

              <button
                type="button"
                disabled={!isTermsAccepted}
                onClick={() => navigate("/questions")}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-base transition-all disabled:cursor-not-allowed ${isTermsAccepted
                  ? "bg-orange-600 hover:bg-orange-700 text-white shadow-md"
                  : "bg-slate-200 text-slate-400"
                  }`}
              >
                {isTermsAccepted
                  ? "Start Exam"
                  : "Please accept"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
