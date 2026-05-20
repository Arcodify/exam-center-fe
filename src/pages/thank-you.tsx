import UserPhoto from "@/assets/man.png";
import { useAuth } from "@/context/AuthContext";
import {
  FaAward,
  FaCheckCircle,
  FaClock,
  FaGraduationCap,
} from "react-icons/fa";
import { useNavigate } from "react-router";

const ThankYou = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userInfo = {
    name: user?.name || "Not available",
    symbolNumber: user?.symbol_number || "Not available",
    photo: user?.photo || UserPhoto,
    program: user?.program?.name || "Not available",
    level: user?.level?.name || "Not available",
    duration: user?.duration || "Not available",
  };

  setTimeout(() => {
    logout();
    navigate("/login");
  }, 10000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Top Message */}
        <div className="flex flex-col items-center text-center px-6 py-6 bg-gradient-to-r from-green-100 to-green-50">
          <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center mb-2">
            <FaCheckCircle className="text-green-600 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Thank You!</h1>
          <p className="text-sm text-gray-600">
            Your exam has been submitted successfully. Best of luck!
          </p>
        </div>

        {/* Student Info */}
        <div className="px-6 py-5">
          <div className="flex flex-col items-center gap-3">
            <img
              src={userInfo.photo}
              alt="photo"
              className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md"
              onError={(e) => {
                e.currentTarget.src = UserPhoto;
              }}
            />
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800">
                {userInfo.name}
              </p>
              <p className="text-sm text-gray-500">
                Symbol No: {userInfo.symbolNumber}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <InfoRow
              icon={<FaGraduationCap className="text-blue-600" />}
              label="Program"
              value={userInfo.program}
            />
            <InfoRow
              icon={<FaAward className="text-green-600" />}
              label="Level"
              value={userInfo.level}
            />
            <InfoRow
              icon={<FaClock className="text-purple-600" />}
              label="Duration"
              value={userInfo.duration}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Info Row Component
const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3 border rounded-md p-3 bg-gray-50">
    <div className="w-6 h-6">{icon}</div>
    <div className="flex flex-col text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  </div>
);

export default ThankYou;
