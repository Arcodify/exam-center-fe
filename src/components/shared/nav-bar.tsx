import { Link } from "react-router";

const NavBar = () => {
  return (
    <nav className="bg-white/90 backdrop-blur-sm  border-b border-gray-200/50   sticky top-0 z-50">
      <div className="wrapper mx-auto  py-3">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700   transition-all duration-300"
          >
            Exam Management System
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/">Dashboard</Link>
            <button className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded-md">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
