import React from 'react';

const LoginForm: React.FC = () => {
  return (
    <form className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-md p-6 w-full">
        <h3 className="text-center font-bold text-l mb-10">Login Details</h3>
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
          Invalid username or password
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm mb-1 font-medium">
            Username <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            className="w-full p-2 border border-gray-300 rounded text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm mb-1 font-medium">
            Password <span className="text-red-600">*</span>
          </label>
          <div className="relative flex">
            <input
              type="password"
              id="password"
              placeholder="********"
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Show password"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-red-500 text-white font-bold rounded hover:bg-red-600"
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
