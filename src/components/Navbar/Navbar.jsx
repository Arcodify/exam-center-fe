import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // React Router hook for handling location
import TimeStamp from "../TimeStamp/TimeStamp";

const exam_name = import.meta.env.VITE_EXAM_NAME;
const company_name = import.meta.env.VITE_INSTITUTE_NAME;
function Navbar() {
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && !userInfo) {
        setUserInfo(user);
      }
    };

    fetchUser();
    const interval = setInterval(() => {
      if (!userInfo) {
        fetchUser();
      }
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  // Hide user info on the login page
  const isLoginPage = location.pathname === "/login";

  return (
    <nav className="w-full font-serif bg-white shadow-md text-neutral-900 px-6 md:px-12 flex items-center justify-between py-4 border-b border-slate-200">
      {/* Logo and Company Info */}
      <div className="flex items-center flex-col gap-4 text-center">
        {/* <img
          src="/logo.png"
          alt="Company Logo"
          loading="lazy"
          className="w-30 h-10 rounded shadow-sm p-1 company__logo"
        /> */}
        <img
          src="/logo.png"
          alt="Company Logo"
          loading="lazy"
          className="w-30 h-10 rounded shadow-sm p-1 company__logo"
          onError={(e) => (e.target.src = "/default-logo.png")}
        />
        <h3>Your Company Name</h3>
      </div>
      <div className="flex flex-col justify-center" style={{}}>
        <h1 className="text-4xl font-xl text-green-900">{exam_name}</h1>
        <span className="text-xl font-medium text-gray-500">
          Basic Computer
        </span>
      </div>
      {/* User Information (Hidden on Login Page) */}
      {!isLoginPage && userInfo && (
        <div className="user-info flex">
          <div className="info flex-col justify-items-end">
            <h3 className="font-bold">
              Name:{" "}
              <span className="text-xl">{userInfo?.data?.name || " "}</span>
            </h3>
            <h3 className="font-bold">
              Symbol Number:{" "}
              <span className="text-xl">
                {userInfo?.data?.symbol_number || " "}
              </span>
            </h3>
            <h3 className="font-bold">
              Level:{" "}
              <span className="text-xl">
                {userInfo?.data?.level?.name || ""}
              </span>
            </h3>
            <h3 className="font-bold">
              Program:{" "}
              <span className="text-xl">
                {userInfo?.data?.program?.name || ""}
              </span>
            </h3>
            {location.pathname.startsWith("/question/") && (
              <div className="timer">
                <TimeStamp />
              </div>
            )}
          </div>

          {/* User Profile Picture */}
          <div className="image ml-3">
            <img
              src={userInfo?.data?.photo} // Provide a placeholder image
              alt="User Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
